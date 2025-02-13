const buildFiles = [
  "/airplay/index.html",
  "/app.js",
  "/ar-vr/index.html",
  "/audio/index.html",
  "/audio-recording/index.html",
  "/audiosession/index.html",
  "/audit/index.html",
  "/authentication/index.html",
  "/background-fetch/index.html",
  "/background-sync/index.html",
  "/barcode/index.html",
  "/bluetooth/index.html",
  "/bluetooth-test/index.html",
  "/capture-handle/index.html",
  "/contacts/index.html",
  "/device-motion/index.html",
  "/device-orientation/index.html",
  "/element-capture/index.html",
  "/email-list/index.html",
  "/face-detection/index.html",
  "/file-handling/index.html",
  "/file-system/index.html",
  "/geolocation/index.html",
  "/image-gallery/index.html",
  "/index.html",
  "/info/index.html",
  "/installation/index.html",
  "/manifest.json",
  "/media/index.html",
  "/multi-touch/index.html",
  "/network-info/index.html",
  "/nfc/index.html",
  "/notifications/index.html",
  "/offline/index.html",
  "/offline-support/index.html",
  "/page-lifecycle/index.html",
  "/payment/index.html",
  "/pip/index.html",
  "/protocol-handler-page/index.html",
  "/protocol-handling/index.html",
  "/service-worker.js",
  "/share-target/index.html",
  "/shortcuts/index.html",
  "/speech-recognition/index.html",
  "/speech-synthesis/index.html",
  "/src/amplifyconfiguration.json",
  "/src/aws-exports.js",
  "/src/controllers/ar-vr.js",
  "/src/controllers/audio-recording.js",
  "/src/controllers/audio.js",
  "/src/controllers/audiosession.js",
  "/src/controllers/audit.js",
  "/src/controllers/authentication.js",
  "/src/controllers/background-fetch.js",
  "/src/controllers/background-sync.js",
  "/src/controllers/barcode.js",
  "/src/controllers/bluetooth.js",
  "/src/controllers/bluetooth2.js",
  "/src/controllers/capture-handle.js",
  "/src/controllers/contacts.js",
  "/src/controllers/device-motion.js",
  "/src/controllers/device-orientation.js",
  "/src/controllers/element-capture.js",
  "/src/controllers/email-list.js",
  "/src/controllers/face-detection.js",
  "/src/controllers/file-handling.js",
  "/src/controllers/file-system.js",
  "/src/controllers/geolocation.js",
  "/src/controllers/home.js",
  "/src/controllers/image-gallery.js",
  "/src/controllers/info.js",
  "/src/controllers/installation.js",
  "/src/controllers/media.js",
  "/src/controllers/network-info.js",
  "/src/controllers/nfc.js",
  "/src/controllers/notifications.js",
  "/src/controllers/page-lifecycle.js",
  "/src/controllers/payment.js",
  "/src/controllers/pip.js",
  "/src/controllers/protocol-handler-page.js",
  "/src/controllers/protocol-handling.js",
  "/src/controllers/share-target.js",
  "/src/controllers/speech-recognition.js",
  "/src/controllers/speech-synthesis.js",
  "/src/controllers/storage.js",
  "/src/controllers/vibration.js",
  "/src/controllers/view-transitions.js",
  "/src/controllers/wake-lock.js",
  "/src/controllers/web-share.js",
  "/src/css/ar-vr.css",
  "/src/css/audio-recording.css",
  "/src/css/authentication.css",
  "/src/css/background-fetch.css",
  "/src/css/barcode.css",
  "/src/css/bluetooth.css",
  "/src/css/capture-handle.css",
  "/src/css/contacts.css",
  "/src/css/face-detection.css",
  "/src/css/file-handling.css",
  "/src/css/file-system.css",
  "/src/css/fonts.css",
  "/src/css/geolocation.css",
  "/src/css/home.css",
  "/src/css/main.css",
  "/src/css/media.css",
  "/src/css/network-info.css",
  "/src/css/nfc.css",
  "/src/css/pagelifecycle.css",
  "/src/css/payment.css",
  "/src/css/prism.css",
  "/src/css/speech-recognition.css",
  "/src/css/storage.css",
  "/src/css/styles.css",
  "/src/css/transitions.css",
  "/src/css/vibration.css",
  "/src/css/wake-lock.css",
  "/src/css/web-share.css",
  "/src/elements/FormElementMixin.js",
  "/src/elements/_file-tree.js",
  "/src/elements/barcode-reader.js",
  "/src/elements/code-snippet.js",
  "/src/elements/context-menu.js",
  "/src/elements/device-motion.js",
  "/src/elements/device-orientation.js",
  "/src/elements/face-detector.js",
  "/src/elements/file-tree.js",
  "/src/elements/form-field.js",
  "/src/elements/google-map.js",
  "/src/elements/iterateWorker.js",
  "/src/elements/multi-touch.js",
  "/src/elements/network-information.js",
  "/src/elements/on-outside-click.js",
  "/src/elements/saveFileWorker.js",
  "/src/elements/shape-detector.js",
  "/src/elements/speech-recognition.js",
  "/src/elements/speech-synthesis.js",
  "/src/elements/web-cam.js",
  "/src/fonts/MaterialIcons-Regular.woff",
  "/src/fonts/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
  "/src/fonts/ionicons.svg",
  "/src/fonts/ionicons.woff",
  "/src/fonts/material-icons.woff2",
  "/src/img/camera-cursor.svg",
  "/src/img/crate.gif",
  "/src/img/gallery/IMG_0791.webp",
  "/src/img/gallery/IMG_0829.webp",
  "/src/img/gallery/IMG_0848.webp",
  "/src/img/gallery/IMG_0860.webp",
  "/src/img/gallery/IMG_0924.webp",
  "/src/img/gallery/IMG_0927.webp",
  "/src/img/gallery/IMG_0955.webp",
  "/src/img/gallery/IMG_0966.webp",
  "/src/img/geolocation/android-chrome-settings-1.webp",
  "/src/img/geolocation/android-chrome-settings-2.webp",
  "/src/img/geolocation/android-chrome-settings-3.webp",
  "/src/img/geolocation/android-chrome-settings-4.webp",
  "/src/img/geolocation/android-chrome-settings-5.webp",
  "/src/img/geolocation/android-edge-settings-1.webp",
  "/src/img/geolocation/android-edge-settings-2.webp",
  "/src/img/geolocation/android-edge-settings-3.webp",
  "/src/img/geolocation/android-edge-settings-4.webp",
  "/src/img/geolocation/android-edge-settings-5.webp",
  "/src/img/geolocation/android-edge-settings-6.webp",
  "/src/img/geolocation/android-firefox-settings-1.webp",
  "/src/img/geolocation/android-firefox-settings-2.webp",
  "/src/img/geolocation/android-firefox-settings-3.webp",
  "/src/img/geolocation/android-firefox-settings-4.webp",
  "/src/img/geolocation/android-firefox-settings-5.webp",
  "/src/img/geolocation/android-settings-1.webp",
  "/src/img/geolocation/android-settings-2.webp",
  "/src/img/geolocation/android-settings-3.webp",
  "/src/img/geolocation/app-permissions-chrome.webp",
  "/src/img/geolocation/app-permissions-edge.webp",
  "/src/img/geolocation/app-permissions-firefox.webp",
  "/src/img/geolocation/desktop-chrome-settings-1.webp",
  "/src/img/geolocation/desktop-chrome-settings-2.webp",
  "/src/img/geolocation/desktop-chrome-settings-3.webp",
  "/src/img/geolocation/desktop-chrome-settings-4.webp",
  "/src/img/geolocation/desktop-chrome-settings-5.webp",
  "/src/img/geolocation/desktop-chrome-settings-6.webp",
  "/src/img/geolocation/desktop-edge-settings-1.webp",
  "/src/img/geolocation/desktop-edge-settings-2.webp",
  "/src/img/geolocation/desktop-edge-settings-3.webp",
  "/src/img/geolocation/desktop-edge-settings-4.webp",
  "/src/img/geolocation/desktop-edge-settings-5.webp",
  "/src/img/geolocation/desktop-firefox-settings-1.webp",
  "/src/img/geolocation/desktop-firefox-settings-2.webp",
  "/src/img/geolocation/desktop-firefox-settings-3.webp",
  "/src/img/geolocation/desktop-firefox-settings-4.webp",
  "/src/img/geolocation/desktop-firefox-settings-5.webp",
  "/src/img/geolocation/desktop-safari-settings-1.webp",
  "/src/img/geolocation/desktop-safari-settings-2.webp",
  "/src/img/geolocation/ios-chrome-settings-1.webp",
  "/src/img/geolocation/ios-chrome-settings-2.webp",
  "/src/img/geolocation/ios-edge-settings-1.webp",
  "/src/img/geolocation/ios-edge-settings-2.webp",
  "/src/img/geolocation/ios-safari-settings-1.webp",
  "/src/img/geolocation/ios-safari-settings-2.webp",
  "/src/img/geolocation/ios-settings-1.webp",
  "/src/img/geolocation/ios-settings-2.webp",
  "/src/img/geolocation/ios-settings-3.webp",
  "/src/img/geolocation/location-permission-chrome.webp",
  "/src/img/geolocation/location-permission-edge.webp",
  "/src/img/geolocation/location-permission-firefox.webp",
  "/src/img/geolocation/macos-settings-1.webp",
  "/src/img/geolocation/macos-settings-2.webp",
  "/src/img/geolocation/macos-settings-3.webp",
  "/src/img/icons/authentication-192x192.png",
  "/src/img/icons/authentication-96x96.png",
  "/src/img/icons/element-capture.svg",
  "/src/img/icons/favicon-32.png",
  "/src/img/icons/geolocation-192x192.png",
  "/src/img/icons/geolocation-96x96.png",
  "/src/img/icons/icon-144x144.png",
  "/src/img/icons/icon-152x152.png",
  "/src/img/icons/icon-167x167.png",
  "/src/img/icons/icon-180x180.png",
  "/src/img/icons/icon-192x192.png",
  "/src/img/icons/icon-512x512.png",
  "/src/img/icons/icon-600x600.png",
  "/src/img/icons/info-192x192.png",
  "/src/img/icons/info-96x96.png",
  "/src/img/icons/manifest-icon-192.maskable.png",
  "/src/img/icons/manifest-icon-512.maskable.png",
  "/src/img/icons/mediacapture-192x192.png",
  "/src/img/icons/mediacapture-96x96.png",
  "/src/img/icons/notification.png",
  "/src/img/install/add-to-dock.svg",
  "/src/img/install/add-to-home-screen.svg",
  "/src/img/install/add-to-phone.svg",
  "/src/img/install/arrow-back.svg",
  "/src/img/install/arrow-forward.svg",
  "/src/img/install/close.svg",
  "/src/img/install/install-phone.svg",
  "/src/img/install/ios-share.svg",
  "/src/img/install/menu-vert.svg",
  "/src/img/install/menu.svg",
  "/src/img/media/mirror-conspiracy256x256.jpeg",
  "/src/img/media/mirror-conspiracy512x512.jpeg",
  "/src/img/media/mirror-conspiracy64x64.jpeg",
  "/src/img/pwa/apple-icon-120.png",
  "/src/img/pwa/apple-icon-152.png",
  "/src/img/pwa/apple-icon-167.png",
  "/src/img/pwa/apple-icon-180.png",
  "/src/img/pwa/apple-splash-1125-2436.png",
  "/src/img/pwa/apple-splash-1136-640.png",
  "/src/img/pwa/apple-splash-1170-2532.png",
  "/src/img/pwa/apple-splash-1179-2556.png",
  "/src/img/pwa/apple-splash-1242-2208.png",
  "/src/img/pwa/apple-splash-1242-2688.png",
  "/src/img/pwa/apple-splash-1284-2778.png",
  "/src/img/pwa/apple-splash-1290-2796.png",
  "/src/img/pwa/apple-splash-1334-750.png",
  "/src/img/pwa/apple-splash-1536-2048.png",
  "/src/img/pwa/apple-splash-1620-2160.png",
  "/src/img/pwa/apple-splash-1668-2224.png",
  "/src/img/pwa/apple-splash-1668-2388.png",
  "/src/img/pwa/apple-splash-1792-828.png",
  "/src/img/pwa/apple-splash-2048-1536.png",
  "/src/img/pwa/apple-splash-2048-2732.png",
  "/src/img/pwa/apple-splash-2160-1620.png",
  "/src/img/pwa/apple-splash-2208-1242.png",
  "/src/img/pwa/apple-splash-2224-1668.png",
  "/src/img/pwa/apple-splash-2388-1668.png",
  "/src/img/pwa/apple-splash-2436-1125.png",
  "/src/img/pwa/apple-splash-2532-1170.png",
  "/src/img/pwa/apple-splash-2556-1179.png",
  "/src/img/pwa/apple-splash-2688-1242.png",
  "/src/img/pwa/apple-splash-2732-2048.png",
  "/src/img/pwa/apple-splash-2778-1284.png",
  "/src/img/pwa/apple-splash-2796-1290.png",
  "/src/img/pwa/apple-splash-640-1136.png",
  "/src/img/pwa/apple-splash-750-1334.png",
  "/src/img/pwa/apple-splash-828-1792.png",
  "/src/img/pwa/apple-splash-dark-1125-2436.png",
  "/src/img/pwa/apple-splash-dark-1136-640.png",
  "/src/img/pwa/apple-splash-dark-1170-2532.png",
  "/src/img/pwa/apple-splash-dark-1179-2556.png",
  "/src/img/pwa/apple-splash-dark-1242-2208.png",
  "/src/img/pwa/apple-splash-dark-1242-2688.png",
  "/src/img/pwa/apple-splash-dark-1284-2778.png",
  "/src/img/pwa/apple-splash-dark-1290-2796.png",
  "/src/img/pwa/apple-splash-dark-1334-750.png",
  "/src/img/pwa/apple-splash-dark-1536-2048.png",
  "/src/img/pwa/apple-splash-dark-1620-2160.png",
  "/src/img/pwa/apple-splash-dark-1668-2224.png",
  "/src/img/pwa/apple-splash-dark-1668-2388.png",
  "/src/img/pwa/apple-splash-dark-1792-828.png",
  "/src/img/pwa/apple-splash-dark-2048-1536.png",
  "/src/img/pwa/apple-splash-dark-2048-2732.png",
  "/src/img/pwa/apple-splash-dark-2160-1620.png",
  "/src/img/pwa/apple-splash-dark-2208-1242.png",
  "/src/img/pwa/apple-splash-dark-2224-1668.png",
  "/src/img/pwa/apple-splash-dark-2388-1668.png",
  "/src/img/pwa/apple-splash-dark-2436-1125.png",
  "/src/img/pwa/apple-splash-dark-2532-1170.png",
  "/src/img/pwa/apple-splash-dark-2556-1179.png",
  "/src/img/pwa/apple-splash-dark-2688-1242.png",
  "/src/img/pwa/apple-splash-dark-2732-2048.png",
  "/src/img/pwa/apple-splash-dark-2778-1284.png",
  "/src/img/pwa/apple-splash-dark-2796-1290.png",
  "/src/img/pwa/apple-splash-dark-640-1136.png",
  "/src/img/pwa/apple-splash-dark-750-1334.png",
  "/src/img/pwa/apple-splash-dark-828-1792.png",
  "/src/img/pwa/manifest-icon-192.png",
  "/src/img/pwa/manifest-icon-512.png",
  "/src/img/pwalogo.png",
  "/src/img/pwalogo.svg",
  "/src/img/pwalogo.webp",
  "/src/img/robot.webp",
  "/src/img/robot_walk_idle.usdz",
  "/src/img/screenshots/shot1.png",
  "/src/img/screenshots/shot2.png",
  "/src/img/screenshots/shot3.png",
  "/src/img/screenshots/shot4.png",
  "/src/img/screenshots/shot5.png",
  "/src/img/screenshots/shot6.png",
  "/src/img/screenshots/shot7.png",
  "/src/img/screenshots/shot8.png",
  "/src/img/screenshots/shot9.png",
  "/src/img/sensors/edge-settings-motion-sensor-1.webp",
  "/src/img/sensors/edge-settings-motion-sensor-2.webp",
  "/src/img/sensors/sensors-chrome-step1.webp",
  "/src/img/sensors/sensors-chrome-step2.webp",
  "/src/img/sensors/sensors-chrome-step3.webp",
  "/src/img/sensors/sensors-chrome-step4.webp",
  "/src/img/sensors/sensors-chrome-step5.webp",
  "/src/img/social-logo.png",
  "/src/img/social-logo.webp",
  "/src/lib/bootstrap.js",
  "/src/lib/feature-support.js",
  "/src/lib/gtag.js",
  "/src/lib/image-gallery.js",
  "/src/lib/imagemin.mjs",
  "/src/lib/material-bottom-sheet.js",
  "/src/lib/pages.js",
  "/src/lib/post-build.js",
  "/src/lib/prism.js",
  "/src/lib/router.js",
  "/src/lib/utils.js",
  "/src/over.mp3",
  "/src/routes.js",
  "/src/routing.js",
  "/src/templates/ar-vr.js",
  "/src/templates/audio-recording.js",
  "/src/templates/audio.js",
  "/src/templates/audiosession.js",
  "/src/templates/audit.js",
  "/src/templates/authentication.js",
  "/src/templates/background-fetch.js",
  "/src/templates/background-sync.js",
  "/src/templates/barcode.js",
  "/src/templates/bluetooth.js",
  "/src/templates/bluetooth2.js",
  "/src/templates/capture-handle.js",
  "/src/templates/contacts.js",
  "/src/templates/device-motion.js",
  "/src/templates/device-orientation.js",
  "/src/templates/element-capture.js",
  "/src/templates/email-list.js",
  "/src/templates/face-detection.js",
  "/src/templates/file-handling.js",
  "/src/templates/file-system.js",
  "/src/templates/footer.js",
  "/src/templates/geolocation.js",
  "/src/templates/geolocationsheet.js",
  "/src/templates/header.js",
  "/src/templates/home.js",
  "/src/templates/image-gallery.js",
  "/src/templates/info.js",
  "/src/templates/installation.js",
  "/src/templates/installsheet.js",
  "/src/templates/media-airplay.js",
  "/src/templates/media.js",
  "/src/templates/multi-touch.js",
  "/src/templates/network-info.js",
  "/src/templates/nfc.js",
  "/src/templates/notifications.js",
  "/src/templates/offline-support.js",
  "/src/templates/offline.js",
  "/src/templates/page-lifecycle.js",
  "/src/templates/payment.js",
  "/src/templates/pip.js",
  "/src/templates/protocol-handler-page.js",
  "/src/templates/protocol-handling.js",
  "/src/templates/screen-orientation.js",
  "/src/templates/sensorsheet.js",
  "/src/templates/share-target.js",
  "/src/templates/shortcuts.js",
  "/src/templates/speech-recognition.js",
  "/src/templates/speech-synthesis.js",
  "/src/templates/status.js",
  "/src/templates/storage.js",
  "/src/templates/vibration.js",
  "/src/templates/view-transitions.js",
  "/src/templates/wake-lock.js",
  "/src/templates/web-share.js",
  "/src/thievery-corporation.mp3",
  "/storage/index.html",
  "/sw-registration.js",
  "/vibration/index.html",
  "/view-transitions/index.html",
  "/wake-lock/index.html",
  "/web-share/index.html",
];

const staticFiles = [
  "/@dannymoerkerke/audio-recorder/dist/audio-recorder.js",
  "/@dannymoerkerke/custom-element/dist/custom-element.es.js",
  "/@dannymoerkerke/material-webcomponents/src/material-app-bar.js",
  "/@dannymoerkerke/material-webcomponents/src/material-bottom-sheet.js",
  "/@dannymoerkerke/material-webcomponents/src/material-button.js",
  "/@dannymoerkerke/material-webcomponents/src/material-checkbox.js",
  "/@dannymoerkerke/material-webcomponents/src/material-dialog.js",
  "/@dannymoerkerke/material-webcomponents/src/material-dropdown.js",
  "/@dannymoerkerke/material-webcomponents/src/material-loader.js",
  "/@dannymoerkerke/material-webcomponents/src/material-progress.js",
  "/@dannymoerkerke/material-webcomponents/src/material-radiobutton-group.js",
  "/@dannymoerkerke/material-webcomponents/src/material-radiobutton.js",
  "/@dannymoerkerke/material-webcomponents/src/material-switch.js",
  "/@dannymoerkerke/material-webcomponents/src/material-textfield.js",
  "/three/build/three.module.js",
  // 'https://www.googletagmanager.com/gtag/js?id=G-VTKNPJ5HVC',
];

const routes = [
  "/",
  "/installation",
  "/offline-support",
  "/shortcuts",
  "/media",
  "/pip",
  "/geolocation",
  "/notifications",
  "/view-transitions",
  "/file-system",
  "/authentication",
  "/protocol-handling",
  "/file-handling",
  "/contacts",
  "/web-share",
  "/share-target",
  "/barcode",
  "/face-detection",
  "/vibration",
  "/audio-recording",
  "/audio",
  "/audiosession",
  "/capture-handle",
  "/element-capture",
  "/background-fetch",
  "/background-sync",
  "/storage",
  "/bluetooth",
  "/nfc",
  "/ar-vr",
  "/payment",
  "/wake-lock",
  "/device-orientation",
  "/device-motion",
  "/network-info",
  "/speech-synthesis",
  "/speech-recognition",
  "/multi-touch",
  "/info",
  "/offline",
  "/email-list",
];

const filesToCache = [...buildFiles, ...staticFiles, ...routes];

self.numBadges = 0;
const SW_VERSION = 674;

const cacheName = `pwa-cache-${SW_VERSION}`;

const debug = true;

const log = debug ? console.log.bind(console) : () => {};

const requestsToRetryWhenOffline = [];

const IDBConfig = {
  name: "pwa-today-db",
  version: SW_VERSION,
  stores: {
    requestStore: {
      name: `request-store`,
      keyPath: "timestamp",
    },
    notificationStore: {
      name: `notification-store`,
      keyPath: "timestamp",
    },
  },
};

// returns if the app is offline
const isOffline = () => !self.navigator.onLine;

const isRequestEligibleForRetry = ({ url, method }) => {
  return (
    ["POST", "PUT", "DELETE"].includes(method) ||
    requestsToRetryWhenOffline.includes(url)
  );
};

const createIndexedDB = ({ name, stores }) => {
  const request = self.indexedDB.open(name, 1);

  return new Promise((resolve, reject) => {
    request.onupgradeneeded = (e) => {
      const db = e.target.result;

      Object.keys(stores).forEach((store) => {
        const { name, keyPath } = stores[store];

        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath });
          console.log("create objectstore", name);
        }
      });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getStoreFactory =
  (dbName) =>
  ({ name }, mode = "readonly") => {
    return new Promise((resolve, reject) => {
      const request = self.indexedDB.open(dbName, 1);

      request.onsuccess = (e) => {
        const db = request.result;
        const transaction = db.transaction(name, mode);
        const store = transaction.objectStore(name);

        // return a proxy object for the IDBObjectStore, allowing for promise-based access to methods
        const storeProxy = new Proxy(store, {
          get(target, prop) {
            if (typeof target[prop] === "function") {
              return (...args) =>
                new Promise((resolve, reject) => {
                  const req = target[prop].apply(target, args);

                  req.onsuccess = () => resolve(req.result);
                  req.onerror = (err) => reject(err);
                });
            }

            return target[prop];
          },
        });

        return resolve(storeProxy);
      };

      request.onerror = (e) => reject(request.error);
    });
  };

const openStore = getStoreFactory(IDBConfig.name);

const serializeHeaders = (headers) =>
  [...headers.entries()].reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {}
  );

// store the request in IndexedDB
const storeRequest = async ({
  url,
  method,
  body,
  headers,
  mode,
  credentials,
}) => {
  const serializedHeaders = serializeHeaders(headers);

  try {
    // Read the body stream and convert it to text or ArrayBuffer
    let storedBody = body;

    if (body && body instanceof ReadableStream) {
      const clonedBody = body.tee()[0];
      storedBody = await new Response(clonedBody).arrayBuffer();
    }

    const timestamp = Date.now();
    const store = await openStore(IDBConfig.stores.requestStore, "readwrite");

    await store.add({
      timestamp,
      url,
      method,
      ...(storedBody && { body: storedBody }),
      headers: serializedHeaders,
      mode,
      credentials,
    });

    // register a sync event for retrying failed requests if Background Sync is supported
    if ("sync" in self.registration) {
      console.log("register sync for retry request");
      await self.registration.sync.register(`retry-request`);
    }
  } catch (error) {
    console.log("idb error", error);
  }
};

const scheduleNotification = async (notification) => {
  try {
    const store = await openStore(
      IDBConfig.stores.notificationStore,
      "readwrite"
    );

    log("store notification", notification);
    await store.add(notification);
    await self.registration.sync.register(`retry-notification`);
  } catch (error) {
    log("idb error", error);
  }
};

const getCacheStorageNames = async () => {
  const cacheNames = (await caches.keys()) || [];
  const outdatedCacheNames = cacheNames.filter(
    (name) => !name.includes(cacheName)
  );
  const latestCacheName = cacheNames.find((name) => name.includes(cacheName));

  return { latestCacheName, outdatedCacheNames };
};

// update outdated caches with the content of the latest one so new content is served immediately
// when the Service Worker is updated but it can't serve this new content yet on the first navigation or reload
const updateLastCache = async () => {
  const { latestCacheName, outdatedCacheNames } = await getCacheStorageNames();
  if (!latestCacheName || !outdatedCacheNames?.length) {
    return null;
  }

  const latestCache = await caches.open(latestCacheName);
  const latestCacheEntries =
    (await latestCache?.keys())?.map((c) => c.url) || [];

  for (const outdatedCacheName of outdatedCacheNames) {
    const outdatedCache = await caches.open(outdatedCacheName);

    for (const entry of latestCacheEntries) {
      const latestCacheResponse = await latestCache.match(entry);

      await outdatedCache.put(entry, latestCacheResponse.clone());
    }
  }
};

// get all requests from IndexedDB that were stored when the app was offline
const getRequests = async () => {
  try {
    const store = await openStore(IDBConfig.stores.requestStore, "readwrite");
    return await store.getAll();
  } catch (err) {
    return err;
  }
};

// retry failed requests that were stored in IndexedDB when the app was offline
const retryRequests = async () => {
  const reqs = await getRequests();
  const requests = reqs.map(
    ({ url, method, headers: serializedHeaders, body, mode, credentials }) => {
      const headers = new Headers(serializedHeaders);

      return fetch(url, { method, headers, body, mode, credentials });
    }
  );

  const responses = await Promise.allSettled(requests);
  const requestStore = await openStore(
    IDBConfig.stores.requestStore,
    "readwrite"
  );
  const { keyPath } = IDBConfig.stores.requestStore;

  responses.forEach((response, index) => {
    const key = reqs[index][keyPath];

    // remove the request from IndexedDB if the response was successful
    if (response.status === "fulfilled") {
      requestStore.delete(key);
    } else {
      console.log(
        `retrying response with ${keyPath} ${key} failed: ${response.reason}`
      );
    }
  });
};

const getNotifications = async () => {
  try {
    const store = await openStore(
      IDBConfig.stores.notificationStore,
      "readwrite"
    );
    return await store.getAll();
  } catch (err) {
    return err;
  }
};

const retryNotifications = async () => {
  const title = "Background Sync demo";
  const message = "Background Sync demo message";
  const options = {
    body: message,
    icon: "/src/img/icons/icon-512x512.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
    },
    actions: [
      {
        action: "confirm",
        title: "OK",
      },
      {
        action: "close",
        title: "Close notification",
      },
    ],
  };

  const notifications = await getNotifications();
  console.log("notification", notifications);
  const requests = notifications.map(({ message }) => {
    options.body = message;
    return self.registration.showNotification(title, options);
  });

  const responses = await Promise.allSettled(requests);
  const notificationStore = await openStore(
    IDBConfig.stores.notificationStore,
    "readwrite"
  );
  const { keyPath } = IDBConfig.stores.notificationStore;

  responses.forEach((response, index) => {
    const key = notifications[index][keyPath];

    // remove the request from IndexedDB if the response was successful
    if (response.status === "fulfilled") {
      notificationStore.delete(key);
    } else {
      console.log(
        `retrying notification with ${keyPath} ${key} failed: ${response.reason}`
      );
    }
  });
};

// cache all files and routes when the Service Worker is installed
// add {cache: 'no-cache'} } to all requests to bypass the browser cache so content is always fetched from the server
const installHandler = (e) => {
  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) =>
        Promise.all([
          cache.addAll(
            filesToCache.map((file) => new Request(file, { cache: "no-cache" }))
          ),
          createIndexedDB(IDBConfig),
        ])
      )
      .catch((err) => console.error("install error", err))
  );
};

const activateHandler = (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name !== cacheName)
            .map((name) => caches.delete(name))
        )
      )
  );
};

const cleanRedirect = async (response) => {
  const clonedResponse = response.clone();

  return new Response(clonedResponse.body, {
    headers: clonedResponse.headers,
    status: clonedResponse.status,
    statusText: clonedResponse.statusText,
  });
};

// the fetch event handler for the Service Worker that is invoked for each request
const fetchHandler = async (e) => {
  const { request } = e;
  const { url } = request;

  e.respondWith(
    (async () => {
      try {
        // store requests to IndexedDB that are eligible for retry when offline and return the offline page
        // as response so no error is logged
        if (isOffline() && isRequestEligibleForRetry(request)) {
          console.log("storing request", request);
          await storeRequest(request);

          return await caches.match("/offline");
        }

        // try to get the response from the cache
        const response = await caches.match(request, {
          ignoreVary: true,
          ignoreSearch: true,
        });
        if (response) {
          return response.redirected ? cleanRedirect(response) : response;
        }

        // if not in the cache, try to fetch the response from the network
        const fetchResponse = await fetch(e.request);
        if (fetchResponse) {
          return fetchResponse;
        }
      } catch (err) {
        // a fetch error occurred, serve the offline page since we don't have a cached response
        const response = await caches.match("/offline", {
          ignoreVary: true,
          ignoreSearch: true,
        });
        if (response) {
          return response.redirected ? cleanRedirect(response) : response;
        }
      }
    })()
  );
};

const getClients = async () =>
  await self.clients.matchAll({
    includeUncontrolled: true,
  });

const hasActiveClients = async () => {
  const clients = await getClients();

  return clients.some(({ visibilityState }) => visibilityState === "visible");
};

const sendMessage = async (message) => {
  const clients = await getClients();

  clients.forEach((client) => client.postMessage({ type: "message", message }));
};

const pushHandler = async (e) => {
  const data = e.data.json();
  const { title, message, interaction } = data;

  const options = {
    body: message,
    icon: "/src/img/icons/icon-512x512.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
    },
    actions: [
      {
        action: "confirm",
        title: "OK",
      },
      {
        action: "close",
        title: "Close notification",
      },
    ],
    requireInteraction: interaction,
  };

  e.waitUntil(
    self.registration
      .showNotification(title, options)
      .then(hasActiveClients)
      .then((activeClients) => {
        if (!activeClients) {
          self.numBadges += 1;
          navigator.setAppBadge(self.numBadges);
        }
      })
      .catch((err) => sendMessage(err))
  );
};

const messageHandler = async ({ data }) => {
  const { type } = data;

  switch (type) {
    case "clearBadges":
      self.numBadges = 0;
      if ("clearAppBadge" in navigator) {
        navigator.clearAppBadge();
      }

      break;

    case "SKIP_WAITING":
      const clients = await self.clients.matchAll({
        includeUncontrolled: true,
      });

      if (clients.length < 2) {
        self.skipWaiting();
      }

      break;

    case "PREPARE_CACHES_FOR_UPDATE":
      await updateLastCache();

      break;

    // retry any requests that were stored in IndexedDB when the app was offline in browsers that don't
    // support Background Sync
    case "retry-requests":
      if (!("sync" in self.registration)) {
        console.log("retry requests when Background Sync is not supported");
        await retryRequests();
      }

      break;

    // retry any notifications that were stored in IndexedDB when the app was offline in browsers that don't
    // support Background Sync
    case "retry-notifications":
      if (!("sync" in self.registration)) {
        console.log(
          "retry notifications when Background Sync is not supported"
        );
        await retryNotifications();
      }

      break;

    case "schedule-notification":
      await scheduleNotification(data.notification);

      break;
  }
};

const syncHandler = async (e) => {
  console.log("sync event with tag:", e.tag);

  const { tag } = e;

  switch (tag) {
    case "retry-request":
      e.waitUntil(retryRequests());

      break;

    case "retry-notification":
      e.waitUntil(retryNotifications());

      break;
  }
};

const notificationClickHandler = async (e) => {
  e.notification.close();
};

self.addEventListener("install", installHandler);
self.addEventListener("activate", activateHandler);
self.addEventListener("fetch", fetchHandler);
self.addEventListener("push", pushHandler);
self.addEventListener("notificationclick", notificationClickHandler);
self.addEventListener("sync", syncHandler);
self.addEventListener("message", messageHandler);

self.addEventListener("backgroundfetchsuccess", async (e) => {
  const { id } = e.registration;
  const clients = await getClients();

  clients.forEach((client) =>
    client.postMessage({ type: "background-fetch-success", id })
  );
});
