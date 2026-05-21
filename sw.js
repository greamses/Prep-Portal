const CACHE_NAME = "prepportal-v2";
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon.svg",
  "/home/css/main.css",
  "/home/css/login.css",
  "/utils/components/nav.css",
  "/utils/components/loader.js",
  "/utils/components/nav-builder.js",
  "/home/js/auth-modal.js",
];

// The install handler takes care of precaching resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

// The activate handler takes care of cleaning up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// The fetch handler uses a Stale-While-Revalidate strategy for auto-updates
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Set up the network fetch request to run in the background
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // If the network response is valid, overwrite the old cache with the fresh file
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback logic if the network is completely down/offline
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });

      // Serve the cached response immediately if it exists, otherwise wait for the network
      return cachedResponse || fetchPromise;
    }),
  );
});
