// 앱을 고친 뒤 올릴 때는 이 버전 숫자를 올려야 폰에 새 버전이 반영됩니다.
const VERSION = "v1";
const APP_CACHE = "quiz-app-" + VERSION;
const FONT_CACHE = "quiz-fonts";
const APP_FILES = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(APP_CACHE).then(c => c.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("quiz-app-") && k !== APP_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Google Fonts: 한 번 받은 뒤로는 저장본 사용
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(caches.open(FONT_CACHE).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      try { const res = await fetch(req); c.put(req, res.clone()); return res; }
      catch { return new Response("", { status: 504 }); }
    }));
    return;
  }

  if (url.origin !== location.origin) return;

  // 앱 파일: 인터넷이 되면 최신 버전, 안 되면 저장본
  e.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      caches.open(APP_CACHE).then(c => c.put(req, copy));
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
  );
});
