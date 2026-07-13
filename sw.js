/* ═══════════════════════════════════════
   Service Worker — Rilevazioni PWA
   v6 — Gesti rapidi sulle ultime rilevazioni
═══════════════════════════════════════ */

const CACHE = 'rilevazioni-v6';

// File locali da pre-cachare all'installazione
const LOCAL_ASSETS = [
  './index_mobile.html',
  './sw.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './splash.jpg',
];

// Librerie CDN da cachare al primo caricamento
const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
];

// ── INSTALL: pre-cacha i file locali ──
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(async c => {
      // File locali: fallisce silenziosamente per file non ancora presenti
      await Promise.allSettled(LOCAL_ASSETS.map(url => c.add(url).catch(()=>{})));
      // CDN: tenta il pre-caching, fallisce silenziosamente
      await Promise.allSettled(CDN_ASSETS.map(url =>
        fetch(url, {mode:'cors'}).then(r => {
          if(r.ok || r.type==='opaque') return c.put(url, r);
        }).catch(()=>{})
      ));
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE: elimina cache vecchie ──
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── FETCH: strategia per tipo di risorsa ──
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  // 1. Chiamate Supabase (API) → sempre rete, mai intercettare
  if(url.hostname.includes('supabase.co')) return;

  // 2. Google Fonts → cache-first (sono immutabili)
  if(url.hostname.includes('fonts.gstatic.com') || url.hostname.includes('fonts.googleapis.com')) {
    e.respondWith(
      caches.match(req).then(cached => {
        if(cached) return cached;
        return fetch(req).then(r => {
          if(r && r.ok) {
            const clone = r.clone();
            caches.open(CACHE).then(c => c.put(req, clone));
          }
          return r;
        }).catch(() => new Response('', {status: 503}));
      })
    );
    return;
  }

  // 3. CDN librerie (xlsx, supabase-js) → cache-first, poi aggiorna in background
  if(url.hostname.includes('cdnjs.cloudflare.com') ||
     url.hostname.includes('jsdelivr.net') ||
     url.hostname.includes('unpkg.com')) {
    e.respondWith(
      caches.match(req).then(cached => {
        // Aggiorna in background se online
        const networkFetch = fetch(req).then(r => {
          if(r && (r.ok || r.type==='opaque')) {
            const clone = r.clone();
            caches.open(CACHE).then(c => c.put(req, clone));
          }
          return r;
        }).catch(() => null);
        // Serve subito dalla cache, oppure aspetta la rete
        return cached || networkFetch;
      })
    );
    return;
  }

  // 4. App shell (HTML, JS, CSS, immagini locali) → stale-while-revalidate
  // Serve subito dalla cache se disponibile, aggiorna in background
  e.respondWith(
    caches.match(req).then(cached => {
      const networkFetch = fetch(req).then(r => {
        if(r && r.ok && req.method === 'GET') {
          const clone = r.clone();
          caches.open(CACHE).then(c => c.put(req, clone));
        }
        return r;
      }).catch(() => null);

      // Se c'è cache: servi e aggiorna silenziosamente
      if(cached) {
        networkFetch; // kick off background update (no await)
        return cached;
      }
      // Nessuna cache: attendi la rete o fallback a index
      return networkFetch || caches.match('./index_mobile.html');
    })
  );
});
