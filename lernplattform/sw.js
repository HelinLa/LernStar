/* LernStar Service Worker – Offline-Cache */
const CACHE = 'lernstar-v3';

const CORE_ASSETS = [
  './index.html',
  './style.css',
  './app.js',
  './content.js',
  './manifest.json',
  './icon.svg',
];

/* ── Install: alle Kerndateien in Cache legen ── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* ── Activate: alte Caches löschen ── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ── Fetch: Cache-First, dann Netzwerk ── */
self.addEventListener('fetch', e => {
  // Nur http/https-Requests behandeln
  if (!e.request.url.startsWith('http')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;

      return fetch(e.request).then(response => {
        // Nur gültige Antworten cachen
        if (
          response &&
          response.status === 200 &&
          response.type !== 'opaque'
        ) {
          const copy = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return response;
      }).catch(() => {
        // Offline-Fallback: Hauptseite zurückgeben
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
