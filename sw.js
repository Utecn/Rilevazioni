const CACHE = 'rilevazioni-v1';
const ASSETS = [
  './index.html',
  './index_mobile.html',
  './index_desktop.html',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// Installa: mette in cache i file principali
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{}))
  );
  self.skipWaiting();
});

// Attiva: elimina cache vecchie
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: serve dalla cache, fallback alla rete
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Le chiamate a Supabase non vengono mai intercettate
  if(url.hostname.includes('supabase.co')) return;

  // Font Google: cache-first
  if(url.hostname.includes('fonts.')) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(r => {
        const clone = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return r;
      }))
    );
    return;
  }

  // App shell: cache-first, poi aggiorna in background
  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request).then(r => {
        if(r.ok && e.request.method === 'GET'){
          const clone = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return r;
      }).catch(()=>null);
      return cached || network || caches.match('./index_mobile.html');
    })
  );
});
