import fs from 'fs'
import path from 'path'

export const serviceWorkerPlugin = {
  name: 'service-worker',
  setup (build) {
    build.onEnd(result => {
      const outPrefix = path.basename(build.initialOptions.outdir)
      const assetsArray = Object.keys(result?.metafile?.outputs ?? {}).map(path => removePrefix(path, outPrefix))

      const serviceWorkerContent = `
/* eslint-env serviceworker */
const CURRENT_ASSETS = ${JSON.stringify(assetsArray)};


self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open('siteup')
      .then((cache) => {
        return cache.addAll(CURRENT_ASSETS);
      })
      .catch((error) => {
        console.error("Failed to install the service worker:", error);
        self.registration.unregister(); // Unregister the service worker
        throw error; // Rethrow to make sure the installation fails
      })
  );
});

self.addEventListener('fetch', (event) => {
  let requestURL = new URL(event.request.url);
  if (requestURL.origin === location.origin && CURRENT_ASSETS.includes(requestURL.pathname)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
  // Note: If the condition isn't met, we just let the browser handle the request.
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.claim().then(() => {
      return caches.keys();
    }).then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName === 'siteup') {
            return caches.open(cacheName).then((cache) => {
              return cache.keys().then((requests) => {
                return Promise.all(
                  requests.map((request) => {
                    if (!CURRENT_ASSETS.includes(new URL(request.url).pathname)) {
                      return cache.delete(request);
                    }
                  })
                );
              });
            });
          }
        })
      );
    })
  );
});
`

      const outdir = build.initialOptions.outdir || path.dirname(build.initialOptions.outfile)
      const serviceWorkerPath = path.join(outdir, 'service-worker.js')
      fs.writeFileSync(serviceWorkerPath, serviceWorkerContent)
    })
  }
}

function removePrefix (str, prefix) {
  if (str.startsWith(prefix)) {
    return str.slice(prefix.length)
  }
  return str
}
