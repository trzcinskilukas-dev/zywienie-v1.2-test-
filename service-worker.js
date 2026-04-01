// ---------------------------------------------
// SERVICE WORKER – CACHE + OBSŁUGA POWIADOMIEŃ PUSH
// ---------------------------------------------

// Wersja cache PWA
const CACHE_NAME = "kalkulator-cache-v3";

// Pliki do cache (bez prefixów – root repo)
const FILES = [
  "index.html",
  "manifest.webmanifest",
  "service-worker.js",
  "icon-192.png",
  "icon-512.png"
];

// Instalacja SW → zapis do cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
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
    console.warn("Push event bez JSON:", err);
  }

  const title = data.title || "Powiadomienie";
  const body  = data.body  || "";
  const icon  = "icon-192.png";
  const badge = "icon-192.png";

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
          // jeśli aplikacja już działa → aktywuj ją
          if ("focus" in client) return client.focus();
        }
        // inaczej otwórz nową kartę
        return clients.openWindow("./");
      })
  );
});