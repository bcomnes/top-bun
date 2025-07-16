/**
 * Client code for worker test page
 */

// Initialize the worker
const counterWorker = new Worker(new URL('./counter.worker.js', import.meta.url), { type: 'module' })

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const counterElement = document.getElementById('counter')
  const incrementButton = document.getElementById('increment')
  const resetButton = document.getElementById('reset')

  // Handle messages from worker
  counterWorker.onmessage = (e) => {
    if (counterElement) {
      counterElement.textContent = e.data.count
    }
  }

  // Add event listeners to buttons
  if (incrementButton) {
    incrementButton.addEventListener('click', () => {
      counterWorker.postMessage({ action: 'increment' })
    })
  }

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      counterWorker.postMessage({ action: 'reset' })
    })
  }
})
