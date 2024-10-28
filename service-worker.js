const CACHE_NAME = 'TrashApp 1.6.2'; // 버전 업데이트
const urlsToCache = [
    '/trashApps/',
    '/trashApps/index.html',
    '/trashApps/favicons/android-chrome-192x192.png',
    '/trashApps/favicons/android-chrome-512x512.png'
];

// 설치 이벤트 - 초기 캐싱 및 즉시 활성화
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // 설치 후 즉시 활성화
});

// 요청 인터셉트하여 캐시 사용
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// 활성화 이벤트 - 이전 캐시 삭제
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // 활성화 후 즉시 컨트롤
});
