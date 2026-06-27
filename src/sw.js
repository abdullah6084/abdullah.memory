const CACHE = "abdullah-memory-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./main.js",
  "./state.js",
  "./sounds.js",
  "./router.js",
  "./manifest.webmanifest",
  "./components/button.js",
  "./components/backButton.js",
  "./screens/menu.js",
  "./screens/settings.js",
  "./screens/round1.js",
  "./screens/round2.js",
  "./screens/round3.js",
  "./screens/result.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then((hit) => hit || fetch(event.request)));
});
