self.addEventListener('push', event => {
  const data = event.data.json();
  console.log('Push Received:', data);

  const options = {
    body: data.body,
    icon: '/icon.png',
    badge: '/badge.png',
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/') // Navigate to the app's home page
  );
});
