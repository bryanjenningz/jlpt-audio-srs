console.log("service worker running");

self.addEventListener("install", () => {
  console.log("service worker installing");
});

self.addEventListener("activate", () => {
  console.log("service worker activating");
});
