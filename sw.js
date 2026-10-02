const CACHE="minha-escala-v5";
const OFFLINE_ASSETS=["./style.css","./app-v2.js","./manifest.webmanifest","./91847304-3414-4dcc-b49f-7d3225ae632f.png"];

self.addEventListener("install",event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(OFFLINE_ASSETS)));
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  const req=event.request;
  if(req.mode==="navigate"){
    event.respondWith(
      fetch(req,{cache:"no-store"})
        .catch(()=>caches.match("./"))
    );
    return;
  }
  event.respondWith(
    fetch(req,{cache:"no-store"})
      .then(response=>{
        if(response && response.ok){
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(req,copy));
        }
        return response;
      })
      .catch(()=>caches.match(req))
  );
});