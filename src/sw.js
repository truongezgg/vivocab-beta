const staticDevCoffee = "dev-coffee-site-v1";
const assets = [
  "/",
  "/?source=pwa",
  "/index.html",
  "/index.js",
  "/app.js",
  "/speech.js",
  "/learn-progress.js",
  "/lesson.js",
  "/offline.html",
  "/styles.css",
  "/manifest.json",

  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/favicon.ico",
];

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticDevCoffee).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
