// Service worker: aplikace funguje i offline a ukáže poslední stažená data.
const VERSION = 'meteo-v2';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // Data z ThingSpeaku: nejdřív síť, při výpadku poslední uložená odpověď.
  if (url.hostname === 'api.thingspeak.com') {
    e.respondWith(fetch(e.request).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request.url, copy)); }
      return r;
    }).catch(() => caches.match(e.request.url)));
    return;
  }
  // Fonty: z cache, jinak ze sítě a uložit.
  if (url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com')) {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
      const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r;
    })));
    return;
  }
  // Vlastní soubory aplikace: síť s fallbackem na cache (aktualizace se projeví hned).
  if (url.origin === self.location.origin) {
    e.respondWith(fetch(e.request).then(r => {
      const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r;
    }).catch(() => caches.match(e.request).then(hit => hit || caches.match('index.html'))));
  }
});
