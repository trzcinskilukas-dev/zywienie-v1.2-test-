// ---------------------------------------------
// SERVICE WORKER – CACHE + OBSŁUGA POWIADOMIEŃ PUSH
// ---------------------------------------------

// Wersja cache PWA
const CACHE_NAME = "kalkulator-cache-v3";

// Pliki do cache (zawsze z prefixem repo GitHub Pages)
const FILES = [
  "/zywienie-v1.2-test-/",
  "/zywienie-v1.2-test-/index.html",
  "/zywienie-v1.2-test-/manifest.webmanifest",
  "/zywienie-v1.2-test-/service-worker.js",
  "/zywienie-v1.2-test-/icon-192.png",
  "/zywienie-v1.2-test-/icon-512.png"
];

// Instalacja SW → zapis do cache
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
  self.skipWaiting();
});

// Tryb offline – próba pobrania z cache, jeśli brak internetu
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(
      response => response || fetch(event.request)
    )
  );
});

// ---------------------------------------------
//  ODBIERANIE POWIADOMIEŃ PUSH Z BACKENDU RENDER
// ---------------------------------------------
self.addEventListener("push", event => {
  let data = {};

  try {
    data = event.data.json();
  } catch (err) {
    console.warn("Push event bez danych JSON:", err);
  }

  const title = data.title || "Powiadomienie";
  const body  = data.body  || "";
  const icon  = "/zywienie-v1.2-test-/icon-192.png";
  const badge = "/zywienie-v1.2-test-/icon-192.png";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      vibrate: [200, 100, 200],
      data
    })
  );
});

// ---------------------------------------------
//  KLIK W POWIADOMIENIE → otwórz aplikację
// ---------------------------------------------
self.addEventListener("notificationclick", event => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then(windowClients => {
        for (let client of windowClients) {
          if ("focus" in client) return client.focus();
        }

        return clients.openWindow("/zywienie-v1.2-test-/");
      })
  );
});