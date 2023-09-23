/// <reference lib="webworker" />

const self = /** @type {ServiceWorkerGlobalScope} */ (
  /** @type {unknown} */ (globalThis.self)
);

const CACHE_NAME = "jlpt-audio-srs-pages";
const CACHED_FILES = [
  "/favicon.ico",
  "/jlpt1.txt",
  "/jlpt2.txt",
  "/jlpt3.txt",
  "/jlpt4.txt",
  "/jlpt5.txt",

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

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(CACHED_FILES);
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const response = await cache.match(event.request.url, {
        ignoreSearch: true,
      });
      if (!response) {
        console.log("Uncached response for request", event.request);
        return fetch(event.request);
      }
      return response;
    })(),
  );
});
