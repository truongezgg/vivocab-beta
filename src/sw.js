const version = "0.0.47";
const cacheName = `vivocab@${version}`;
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

  // data
  "/data/oxford-3000-a1.json",
];

self.addEventListener("install", (e) => {
  // Forces the new service worker to activate immediately
  e.waitUntil(self.skipWaiting()); // Skip the waiting state
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      cache
        .addAll(assets.map((file) => new Request(file, { cache: "no-cache" })))
        .then(() => console.log("Install success"))
        .catch((e) => console.error("Install failed", e));
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

const activateHandler = (e) => {
  e.waitUntil(
    self.clients.claim() // Take control of all pages
  );
  e.waitUntil(
    caches.keys().then((names) => {
      const invalidNames = names.filter((name) => name !== cacheName);
      if (!invalidNames.length) return;
      return Promise.all(invalidNames.map((name) => caches.delete(name)));
    })
  );
};

self.addEventListener("activate", activateHandler);

self.addEventListener("message", (event) => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});
