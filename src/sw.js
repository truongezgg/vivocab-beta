const version = "0.0.2";
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
];

self.addEventListener("install", (e) => {
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
    caches.keys().then((names) => {
      const invalidNames = names.filter((name) => name !== cacheName);
      if (!invalidNames.length) return;
      return Promise.all(invalidNames.map((name) => caches.delete(name)));
    })
  );
};

self.addEventListener("activate", activateHandler);
