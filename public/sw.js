const CACHE_NAME = 'little-champion-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => {
      // On localhost, unregister immediately so dev server works without SW interception
      if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
        return self.registration.unregister();
      }
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Never intercept localhost dev requests
  if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
    return;
  }

  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
