workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.routing.registerRoute(
    ({url}) => url.origin === 'https://hacker-news.firebaseio.com',
    new workbox.strategies.StaleWhileRevalidate()
);

self.addEventListener('push', (event) => {
    const notification = event.data.json();
    const title = notification.title;
    const options = {
        body: notification.body,
        data: notification.data,
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    let url = event.notification.data.url;
    event.notification.close(); // Android needs explicit close.
    event.waitUntil(
        clients.matchAll({type: 'window'}).then( windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
workbox.precaching.precacheAndRoute(self.__precacheManifest);
