// Service Worker für Baustellenanmeldung BG BAU PWA
const CACHE_NAME = 'bg-bau-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Installation
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache geöffnet');
        return cache.addAll(urlsToCache);
      })
  );
});

// Aktivierung
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Alter Cache entfernt:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch-Ereignis
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache-Hit - gebe die Response aus dem Cache zurück
        if (response) {
          return response;
        }
        
        // Kein Cache-Hit - hole die Ressource vom Netzwerk
        return fetch(event.request).then(
          response => {
            // Prüfe ob wir eine gültige Response erhalten haben
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }
            
            // Clone der Response
            const responseToCache = response.clone();
            
            // Füge die neue Response zum Cache hinzu
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        );
      })
  );
});
