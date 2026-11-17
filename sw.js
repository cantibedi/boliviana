const V='plan-v1',CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!=='tiles').map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
if(u.hostname==='tile.openstreetmap.org'){e.respondWith(caches.open('tiles').then(async c=>{const m=await c.match(r);if(m)return m;try{const n=await fetch(r);if(n.ok)c.put(r,n.clone());return n}catch(x){return Response.error()}}));return}
if(r.mode==='navigate'){e.respondWith(fetch(r).then(n=>{const k=n.clone();caches.open(V).then(c=>c.put('./index.html',k));return n}).catch(()=>caches.match('./index.html')));return}
if(u.origin===location.origin||/unpkg\.com|fonts\.(googleapis|gstatic)\.com/.test(u.hostname)){e.respondWith(caches.match(r).then(m=>{const f=fetch(r).then(n=>{if(n.ok||n.type==='opaque'){const k=n.clone();caches.open(V).then(c=>c.put(r,k))}return n}).catch(()=>m);return m||f}))}});
