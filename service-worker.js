// ---------------------------------------------
// SERVICE WORKER – odbieranie powiadomień PUSH
// ---------------------------------------------

// Odbiór push od backendu (Render.com)
self.addEventListener("push", event => {
    let data = {};

    try {
        data = event.data.json();
    } catch (e) {
        console.error("Błąd odczytu danych push:", e);
    }

    const title = data.title || "Powiadomienie";
    const body  = data.body  || "";
    const icon  = "icon-192.png";  // ikona dodasz sam
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

// Reakcja na kliknięcie w powiadomienie
self.addEventListener("notificationclick", event => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true })
            .then(windowClients => {
                // Jeśli aplikacja już jest otwarta → aktywujemy ją
                for (let client of windowClients) {
                    if (client.url.includes("/") && "focus" in client) {
                        return client.focus();
                    }
                }
                // Jeśli nie jest otwarta → otwieramy nową kartę
                if (clients.openWindow) {
                    return clients.openWindow("/");
                }
            })
    );
});

// (UWAGA: brak setInterval — SW nie może utrzymywać timera!)