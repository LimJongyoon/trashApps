const CACHE_NAME = 'TrashApp 0.31.2';
const urlsToCache = [
  '/trashApps/',
  '/trashApps/index.html',
  '/trashApps/appDownloadGuide.html',
  '/trashApps/donation.html'
];

// Install event: Pre-cache static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // Activate this service worker immediately
});

// Fetch event: Serve from cache, otherwise fetch from network
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Match dynamically generated app files (e.g., /trashApps/apps/0001.html)
  if (url.includes('/trashApps/list/') && url.match(/\/\d{4}\.html$/)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          // Dynamically cache the response
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  } else {
    // Serve other requests from cache or fetch them
    event.respondWith(
      caches.match(event.request)
        .then((response) => response || fetch(event.request))
    );
  }
});

// Activate event: Remove old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of clients immediately
});
