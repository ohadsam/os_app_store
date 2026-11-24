// Offline-first service worker. VERSION equals version.json (scripts/bump-version.mjs + a unit test enforce it).
const VERSION = '1.1.0';
const CACHE = `osapps-${VERSION}`;
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'version.json', 'icon.svg', 'css/app.css', 'data/apps.json',
  'js/app.js', 'js/appVersion.js', 'js/theme-boot.js', 'js/util.js', 'js/i18n.js', 'js/store.js', 'js/catalog.js', 'js/icons.js', 'js/share.js', 'js/update.js',
  'js/ui/card.js', 'js/ui/home.js', 'js/ui/detail.js', 'js/ui/guide.js', 'js/ui/mock.js', 'js/ui/about.js', 'js/ui/lightbox.js', 'art/store/states/no-results-light.svg', 'art/store/states/no-results-dark.svg', 'art/store/states/offline-light.svg', 'art/store/states/offline-dark.svg', 'art/store/states/load-error-light.svg', 'art/store/states/load-error-dark.svg', 'art/store/states/coming-soon-light.svg', 'art/store/states/coming-soon-dark.svg', 'art/store/install/download-light.svg', 'art/store/install/download-dark.svg', 'art/store/install/allow-once-light.svg', 'art/store/install/allow-once-dark.svg', 'art/store/install/done-light.svg', 'art/store/install/done-dark.svg', 'art/store/home/hero-light.svg', 'art/store/home/hero-dark.svg', 'js/ui/art.js', 'art/store/bg/bg-light.svg', 'art/store/bg/bg-dark.svg', 'art/store/categories/cat-health.svg', 'art/store/categories/cat-family.svg', 'art/store/categories/cat-faith.svg', 'art/store/categories/cat-tools.svg', 'art/store/categories/cat-time.svg', 'art/store/categories/cat-events.svg', 'art/store/categories/cat-files.svg', 'art/store/categories/cat-dev.svg', 'art/store/categories/cat-travel.svg',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'];

self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return; // never touch cross-origin
  // version.json and the catalog: network first, so a new version / new app shows up right away; cache is the offline fallback.
  if (url.pathname.endsWith('/version.json') || url.pathname.endsWith('/data/apps.json')) {
    e.respondWith(fetch(req, { cache: 'no-cache' }).then((r) => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then((x) => x.put(req, c)); } return r; }).catch(() => caches.match(req, { ignoreSearch: true })));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((r) => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then((x) => x.put(req, c)); } return r; })).catch(() => caches.match('index.html')));
});
