export function loadServiceWorker () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          registration.onupdatefound = () => {
            const installingWorker = registration.installing
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('New content is available; please refresh.')
                  } else {
                    console.log('Content is cached for offline use.')
                  }
                }
              }
            }
          }
        })
        .catch((error) => {
          console.error('Service worker registration failed:', error)
        })
    })
  }
}
