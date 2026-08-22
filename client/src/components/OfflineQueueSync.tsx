import { useCallback, useEffect, useRef } from "react";
import { removeQueuedScan, queuedScans, shouldDiscardQueuedScan } from "@/lib/offlineQueue";
import { trpc } from "@/lib/trpc";

/** Retries pending scans automatically when the browser reconnects or remains open online. */
export default function OfflineQueueSync() {
  const analyze = trpc.observation.analyze.useMutation();
  const flushing = useRef(false);
  const mutateAsyncRef = useRef(analyze.mutateAsync);

  // tRPC mutation objects may be recreated when their status changes. Keep the
  // latest callback in a ref so the scheduler below stays mounted exactly once.
  useEffect(() => {
    mutateAsyncRef.current = analyze.mutateAsync;
  }, [analyze.mutateAsync]);

  const flush = useCallback(async () => {
    if (!navigator.onLine || flushing.current) return;
    flushing.current = true;
    try {
      for (const queued of await queuedScans()) {
        try {
          await mutateAsyncRef.current(queued.payload);
          await removeQueuedScan(queued.id);
        } catch (error) {
          if (shouldDiscardQueuedScan(error)) {
            await removeQueuedScan(queued.id);
            continue;
          }
          // Preserve ordering and retry the first failed request after the next reconnect/timer.
          break;
        }
      }
    } finally {
      flushing.current = false;
    }
  }, []);

  useEffect(() => {
    void flush();
    window.addEventListener("online", flush);
    const interval = window.setInterval(() => void flush(), 45_000);
    return () => {
      window.removeEventListener("online", flush);
      window.clearInterval(interval);
    };
  }, [flush]);

  return null;
}
