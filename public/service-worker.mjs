/// <reference lib="webworker" />

const self = /** @type {ServiceWorkerGlobalScope} */ (
  /** @type {unknown} */ (globalThis.self)
);

const CACHE_NAME = "jlpt-audio-srs-pages";
const CACHED_FILES = [
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/app.webmanifest",
  "/apple-touch-icon.png",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/favicon.ico",

  "/jlpt1.txt",
  "/jlpt2.txt",
  "/jlpt3.txt",
  "/jlpt4.txt",
  "/jlpt5.txt",

  "/service-worker.mjs",

  "/",

  "/learn/5",
  "/learn/4",
  "/learn/3",
  "/learn/2",
  "/learn/1",

  "/words/5",
  "/words/4",
  "/words/3",
  "/words/2",
  "/words/1",

  "/settings",
];
const EXTRA_CACHE_NAME = "jlpt-audio-srs-extra";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(CACHED_FILES);
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.delete(EXTRA_CACHE_NAME));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      try {
        const response = await fetch(event.request);
        if (!(await caches.has(event.request.url))) {
          const cache = await caches.open(EXTRA_CACHE_NAME);
          void cache.add(event.request.url);
        }
        return response;
      } catch {
        const response = await caches.match(event.request.url, {
          ignoreSearch: true,
        });
        if (!response) {
          console.log(
            "Uncached response for request, retrying fetch...",
            event.request,
          );
          return fetch(event.request);
        }
        return response;
      }
    })(),
  );
});
