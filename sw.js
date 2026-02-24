// SERVICE WORKER DESACTIVADO TEMPORALMENTE
self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  self.clients.claim();
});