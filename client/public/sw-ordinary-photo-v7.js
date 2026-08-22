const CACHE = "cropguide-shell-v7";
const APP_SHELL = ["/", "/manifest.webmanifest"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("cropguide-shell-") && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.pathname.startsWith("/api/") || url.pathname.startsWith("/manus-storage/")) return;
  const isDeployedAsset = url.origin === location.origin && url.pathname.startsWith("/assets/");
  const networkRequest = event.request.mode === "navigate" || isDeployedAsset
    ? new Request(event.request, { cache: "no-store" })
    : event.request;

  event.respondWith(
    fetch(networkRequest)
      .then(response => {
        if (url.origin === location.origin && response.ok) {
          const copy = response.clone();
          void caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then(cached => {
        if (cached) return cached;
        if (event.request.mode === "navigate") return caches.match("/");
        return new Response("Offline", { status: 503, statusText: "Service Unavailable" });
      })),
  );
});
