/**
 * Counter worker for testing web worker support
 */

let count = 0

self.onmessage = (event) => {
  const { action } = event.data

  switch (action) {
    case 'increment':
      count++
      break
    case 'reset':
      count = 0
      break
    default:
      // Ignore unknown actions
  }

  // Send the current count back to the main thread
  self.postMessage({ count })
}

// Send initial count on startup
self.postMessage({ count })
