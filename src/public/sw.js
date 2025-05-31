const CACHE_NAME = 'static-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/bundle.js',
  '/style.css',
  '/favicon.png',
];

self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
        });
    })
  );
});

self.addEventListener('push', (event) => {
  let title = 'Dicoding Story';
  const options = {
    body: 'Push message received!',
    icon: '/icon-192.png',
    vibrate: [100, 50, 100],
  };

  if (event.data) {
    try {
      const dataText = event.data.text();
      const data = JSON.parse(dataText); 

      title = data.title || title;
      options.body = data.options?.body || options.body;
      if (data.options?.icon) options.icon = data.options.icon;
      if (data.options?.vibrate) options.vibrate = data.options.vibrate;
      if (data.options?.actions) options.actions = data.options.actions;
    } catch (err) {
      options.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

