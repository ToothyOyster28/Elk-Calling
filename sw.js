const SHELL='elk-coach-shell-v20', AUDIO='elk-audio-v1';
const ASSETS=['./','./index.html','./manifest.json'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(SHELL).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(e.request.destination==='audio'||u.pathname.endsWith('.ogg')||u.pathname.endsWith('.mp3')){
   e.respondWith(caches.open(AUDIO).then(async c=>{
     const hit=await c.match(e.request); if(hit)return hit;
     try{const r=await fetch(e.request);if(r.ok)await c.put(e.request,r.clone());return r}catch(err){return new Response('',{status:503})}
   })); return;
 }
 e.respondWith(caches.match(e.request).then(async hit=>{
   if(hit)return hit;
   try{const r=await fetch(e.request);if(r.ok&&e.request.method==='GET'){const c=await caches.open(SHELL);c.put(e.request,r.clone())}return r}
   catch(err){return caches.match('./index.html')}
 }));
});