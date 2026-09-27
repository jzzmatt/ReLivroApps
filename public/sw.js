self.addEventListener("push", (event) => {
  let payload = {title: "ReLivroApps", body: "", url: "/notifications"};
  try {
    if (event.data) payload = {...payload, ...event.data.json()};
  } catch {
    payload.body = event.data ? event.data.text() : "";
  }
  event.waitUntil(
    self.registration.showNotification(payload.title || "ReLivroApps", {
      body: payload.body || "",
      data: {url: payload.url || "/notifications"},
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/notifications";
  event.waitUntil(self.clients.openWindow(url));
});
