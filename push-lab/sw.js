const VERSION="click-test-20261008-b";
const DEST="https://rutefranca-tech.github.io/onevet-minha-escala/?view=week&date=2026-10-12";
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("message",e=>{if(e.data?.type==="GET_VERSION")e.source?.postMessage({type:"SW_VERSION",version:VERSION});if(e.data?.type==="SKIP_WAITING")self.skipWaiting()});
self.addEventListener("notificationclick",event=>{
  const target=event.notification.data?.url||DEST;
  event.notification.close();
  event.waitUntil((async()=>{
    const windows=await self.clients.matchAll({type:"window",includeUncontrolled:true});
    for(const windowClient of windows){windowClient.postMessage({type:"PUSH_CLICK",version:VERSION,target});}
    await self.clients.openWindow(target);
  })());
});
self.addEventListener("push",event=>{
  let data={};
  try{data=event.data?event.data.json():{}}catch(e){data={body:event.data?.text()||"Nova notificação"}}
  event.waitUntil(self.registration.showNotification(data.title||"🐾 Minha Escala",{
    body:data.body||"Tens uma nova mensagem.",
    tag:data.tag||"onevet-remote-test",
    icon:"../91847304-3414-4dcc-b49f-7d3225ae632f.png",
    data:{url:DEST}
  }));
});
