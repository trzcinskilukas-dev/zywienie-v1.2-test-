// ---------------------------
// CACHE (opcjonalny: offline UI)
// ---------------------------
const CACHE_NAME = "kalkulator-cache-v3";

const FILES = [
  "/zywienie-v1.2-test-/",
  "/zywienie-v1.2-test-/index.html",
  "/zywienie-v1.2-test-/manifest.webmanifest",
  "/zywienie-v1.2-test-/service-worker.js",
  "/zywienie-v1.2-test-/icon-192.png",
  "/zywienie-v1.2-test-/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
});

// ---------------------------
// FETCH — offline fallback
// ---------------------------
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});

// ---------------------------
// ODBIÓR POWIADOMIEŃ PUSH
// ---------------------------
self.addEventListener("push", event => {
  let data = {};
  try { data = event.data.json(); } catch (err) {}

  const title = data.title || "Powiadomienie";
  const body  = data.body  || "";
  const icon  = "/zywienie-v1.2-test-/icon-192.png";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge: "/zywienie-v1.2-test-/icon-192.png",
      vibrate: [200, 100, 200],
      data
    })
  );
});

// ---------------------------
// KLIK W POWIADOMIENIE
// ---------------------------
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/zywienie-v1.2-test-/")
  );
});