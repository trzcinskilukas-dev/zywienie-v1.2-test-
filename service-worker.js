self.addEventListener("push", event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || "Powiadomienie";
    const body = data.body || "";
    const icon = "icon-192.png";
    event.waitUntil(
        self.registration.showNotification(title, { body, icon, vibrate:[200,100,200], data })
    );
});
self.addEventListener("notificationclick", event => {
    event.notification.close();
    event.waitUntil(clients.openWindow("/"));
});
