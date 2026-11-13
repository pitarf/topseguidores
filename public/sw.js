self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || "Nova Notificação";
    const options = {
      body: data.body || "",
      icon: data.icon || "/favicon.png",
      badge: data.badge || "/favicon.png",
      vibrate: data.vibrate || [200, 100, 200, 100, 200],
      tag: data.tag || "venda-notificacao",
      renotify: true,
      data: data.data || { url: "/administracao" },
      actions: [
        { action: "open", title: "Ver Pedidos" }
      ]
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error("Erro ao processar evento de push:", err);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/administracao";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("/administracao") && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
