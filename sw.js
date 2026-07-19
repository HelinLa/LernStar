/* LernStar Service Worker – Offline-Cache
 *
 * Wichtig: index.html wird IMMER zuerst aus dem Netz geholt (Network-First).
 * Sonst liefert der Cache dauerhaft eine alte Startseite aus, die noch auf
 * alte ?v=-Nummern verweist – dann wirkt kein Cache-Busting mehr, und
 * Änderungen an app.js, content.js oder physics-sim.js kommen nie an.
 * Alles Übrige darf aus dem Cache kommen, weil es über ?v=N versioniert ist:
 * eine neue Versionsnummer ist eine neue Adresse und damit automatisch frisch.
 *
 * Bei Änderungen an dieser Datei den Cache-Namen hochzählen. */
const CACHE = 'lernstar-v4';

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

/* ── Fetch ── */
self.addEventListener('fetch', e => {
  // Nur http/https-Requests behandeln
  if (!e.request.url.startsWith('http')) return;

  /* Startseite: Network-First. Frisch aus dem Netz, sonst aus dem Cache
     (damit die App offline weiterhin startet). */
  const istStartseite = e.request.mode === 'navigate' ||
                        new URL(e.request.url).pathname.endsWith('.html');
  if (istStartseite) {
    e.respondWith(
      fetch(e.request).then(response => {
        if (response && response.status === 200 && response.type !== 'opaque') {
          const copy = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return response;
      }).catch(() =>
        caches.match(e.request).then(c => c || caches.match('./index.html'))
      )
    );
    return;
  }

  /* Alles Übrige: Cache-First. Unbedenklich, weil versioniert (?v=N). */
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
