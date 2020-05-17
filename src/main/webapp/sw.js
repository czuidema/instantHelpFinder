workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.routing.registerRoute(
    ({url}) => url.origin === 'https://hacker-news.firebaseio.com',
    new workbox.strategies.StaleWhileRevalidate()
);

self.addEventListener('push', (event) => {
    console.log(JSON.stringify(event.data))
    console.log(event.data.json());
    const data = event.data.json();
    const title = data.title;
    const options = {
        body: data.body
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

workbox.precaching.precacheAndRoute(self.__precacheManifest);
