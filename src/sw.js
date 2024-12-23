const CACHE_NAME = "vocab-app-cache"; // Keep a consistent cache name
const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/learn-progress.js",
  "/speech.js",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// Install event: Cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching app shell");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event: Serve files from cache or fetch from network
self.addEventListener("fetch", (event) => {
  // Ignore requests from chrome-extension:// or other unsupported URLs
  if (event.request.url.startsWith("chrome-extension://")) {
    return; // Skip caching this request
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone()); // Update cache
            return fetchResponse;
          });
        })
      );
    })
  );
});

// Activate event: Remove outdated caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[Service Worker] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
