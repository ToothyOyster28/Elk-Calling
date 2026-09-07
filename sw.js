const SHELL='elk-coach-shell-v21', AUDIO='elk-audio-v2';
const BASE='/Elk-Calling/';
const ASSETS=[BASE,BASE+'index.html',BASE+'manifest.json',BASE+'icons/icon-192.png',BASE+'icons/icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(SHELL).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>e.waitUntil(Promise.all([
 self.clients.claim(),
 caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('elk-coach-shell-')&&k!==SHELL).map(k=>caches.delete(k))))
])));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(e.request.destination==='audio'||/\.(ogg|mp3|wav)$/i.test(u.pathname)){
  e.respondWith(caches.open(AUDIO).then(async c=>{
   const hit=await c.match(e.request);if(hit)return hit;
   try{const r=await fetch(e.request);if(r.ok)await c.put(e.request,r.clone());return r}catch(err){return new Response('',{status:503})}
  }));return;
 }
 e.respondWith(caches.match(e.request).then(async hit=>{
  if(hit)return hit;
  try{const r=await fetch(e.request);if(r.ok){const c=await caches.open(SHELL);c.put(e.request,r.clone())}return r}
  catch(err){return caches.match(BASE+'index.html')}
 }));
});