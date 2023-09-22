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

  self.addEventListener("install", () => {
    console.log("Installing service worker");
  });

  self.addEventListener("activate", () => {
    console.log("Activating service worker");
  });
})();
