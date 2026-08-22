import type { FieldSpecies } from "@shared/species";

export type QueuedScanPayload = {
  imageDataUrl: string;
  detailImageDataUrls?: string[];
  fileName?: string;
  visitorId: string;
  species: FieldSpecies;
  latitude?: number;
  longitude?: number;
  capturedAt: number;
};

type QueuedScan = { id: number; payload: QueuedScanPayload; queuedAt: number };

const DB_NAME = "cropguide-offline";
const STORE_NAME = "queued-scans";
const CHANGE_EVENT = "cropguide-queue-change";

/** A queued scan cannot become valid after the server rejects its image/input. */
export function shouldDiscardQueuedScan(error: unknown) {
  const code = (error as { data?: { code?: string } } | undefined)?.data?.code;
  return code === "BAD_REQUEST" || code === "PAYLOAD_TOO_LARGE";
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function notifyChange() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export async function enqueueScan(payload: QueuedScanPayload) {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).add({ payload, queuedAt: Date.now() });
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  db.close();
  notifyChange();
}

export async function queuedScans(): Promise<QueuedScan[]> {
  const db = await openDatabase();
  const scans = await new Promise<QueuedScan[]>((resolve, reject) => {
    const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result as QueuedScan[]);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return scans.sort((a, b) => a.queuedAt - b.queuedAt);
}

export async function removeQueuedScan(id: number) {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  db.close();
  notifyChange();
}

export function subscribeToQueue(listener: () => void) {
  window.addEventListener(CHANGE_EVENT, listener);
  return () => window.removeEventListener(CHANGE_EVENT, listener);
}
