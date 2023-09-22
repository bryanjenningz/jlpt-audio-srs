// @ts-check
/// <reference no-default-lib="false"/>
/// <reference lib="ES2015" />
/// <reference lib="webworker" />

// Using IIFE to provide closure to redefine `self`
(() => {
  // This is a little messy, but necessary to force type assertion
  // Same issue as in TS -> https://github.com/microsoft/TypeScript/issues/14877
  // prettier-ignore
  const self = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (globalThis.self));

  console.log("Running service worker");

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
    console.log("Installing service worker");
    event.waitUntil(
      (async () => {
        console.log("Opening caches");
        const cache = await caches.open(CACHE_NAME);
        console.log("Adding cached files");
        await cache.addAll(CACHED_FILES);
        console.log("Added all cached files");
      })(),
    );
  });

  self.addEventListener("activate", () => {
    console.log("Activating service worker");
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
        }
        return response ?? fetch(event.request);
      })(),
    );
  });
})();
