/*
 * Plately service worker.
 *
 * Network-first for same-origin GET requests: the app always loads the newest
 * deploy when online (so it auto-updates), and falls back to the last cached
 * response when offline. Cross-origin requests (e.g. Supabase) are left to the
 * network untouched. skipWaiting + clients.claim make a new worker take over
 * immediately instead of waiting for every tab to close.
 */

const CACHE = 'plately-runtime-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Drop any caches from older worker versions.
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // Supabase & other hosts: straight to network.

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(request);
        // Stash a copy so the app still opens offline.
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
        return response;
      } catch {
        const cached = await caches.match(request);
        if (cached) return cached;
        // For navigations, fall back to the cached app shell.
        if (request.mode === 'navigate') {
          const shell = await caches.match('/');
          if (shell) return shell;
        }
        throw new Error('offline and not cached');
      }
    })(),
  );
});
