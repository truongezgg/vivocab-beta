const version = "0.0.94";
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
  "/components/LessonNavigation.js",

  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/favicon.ico",

  // data
  "/data/oxford-3000-a1.json",
  "/data/oxford-3000-a2.json",
  "/data/oxford-3000-b1.json",
  "/data/oxford-3000-b2.json",
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
  console.log("Service Worker installed");
});

// self.addEventListener("fetch", (fetchEvent) => {
//   fetchEvent.respondWith(
//     caches.match(fetchEvent.request).then((res) => {
//       return res || fetch(fetchEvent.request);
//     })
//   );
// });
self.addEventListener("fetch", (fetchEvent) => {
  // Skip caching for non-http(s) requests (like chrome-extension://)
  if (!fetchEvent.request.url.startsWith("http")) {
    return;
  }

  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      // If found in cache, return it
      if (res) return res;

      // If not in cache, try fetching from network
      return fetch(fetchEvent.request)
        .then((networkRes) => {
          return caches.open(cacheName).then((cache) => {
            // Only cache successful responses
            if (networkRes.ok) {
              cache.put(fetchEvent.request, networkRes.clone()); // Store for future use
            }
            return networkRes; // Return the network response
          });
        })
        .catch(() => {
          // If both cache and network fail, return an empty response
          return new Response("", {
            status: 504,
            statusText: "Gateway Timeout",
          });
        });
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
  console.log("Service Worker activated");
};

self.addEventListener("activate", activateHandler);

self.addEventListener("message", (event) => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }

  if (event.data.type === "UPDATE_BADGE") {
    console.log("UPDATE_BADGE", event.data.count);
    updateBadge(event.data.count);
  }

  // Handle count response from client
  if (event.data.type === "COUNT_RESPONSE") {
    console.log("COUNT_RESPONSE", event.data.count);
    updateBadge(event.data.count);
  }
});

self.badgeCount = 0;
// Function to update badge
const updateBadge = async (count) => {
  if (self.badgeCount === count) return;

  if ("setAppBadge" in navigator) {
    try {
      if (count > 0) {
        self.badgeCount = count;
        await navigator.setAppBadge(count);
      } else {
        self.badgeCount = 0;
        await navigator.clearAppBadge();
      }
    } catch (error) {
      console.log("Error setting badge:", error);
    }
  }
};

// Add periodic sync event listener
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "update-badge") {
    event.waitUntil(backgroundJobUpdateBadge());
  }
});

// Function to get review count from client
const backgroundJobUpdateBadge = async () => {
  try {
    const getClients = async () =>
      await self.clients.matchAll({
        includeUncontrolled: true,
      });
    const clients = await getClients();
    clients.forEach((client) => {
      client.postMessage({ type: "REQUEST_COUNT", isShowNotification: true });
    });
  } catch (error) {
    console.error("Error requesting count:", error);
  }
};
