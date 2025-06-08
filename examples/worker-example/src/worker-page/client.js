// Web worker client-side script
// This file gets automatically loaded by DOMStack

// Initialize the workers
const counterWorker = new Worker(new URL('./counter.worker.js', import.meta.url), { type: 'module' })
const fibWorker = new Worker(new URL('./fibonacci.worker.js', import.meta.url), { type: 'module' })

// Counter example functionality
document.addEventListener('DOMContentLoaded', () => {
  // Counter example
  const counterElement = document.getElementById('counter')
  const lastOperationElement = document.getElementById('lastOperation')
  const incrementButton = document.getElementById('increment')
  const decrementButton = document.getElementById('decrement')
  const resetButton = document.getElementById('reset')
  const multiplyButton = document.getElementById('multiply')

  counterWorker.onmessage = (e) => {
    counterElement.textContent = e.data.count

    // Display last operation if available
    if (e.data.lastOperation) {
      const op = e.data.lastOperation
      lastOperationElement.textContent = `Last action: ${op.type} (${op.oldValue} → ${op.newValue})`
    }
  }

  incrementButton.addEventListener('click', () => {
    counterWorker.postMessage({ action: 'increment' })
  })

  decrementButton.addEventListener('click', () => {
    counterWorker.postMessage({ action: 'decrement' })
  })

  resetButton.addEventListener('click', () => {
    counterWorker.postMessage({ action: 'reset' })
  })

  multiplyButton.addEventListener('click', () => {
    counterWorker.postMessage({ action: 'multiply', value: 2 })
  })

  // Fibonacci example
  const fibInput = document.getElementById('fibInput')
  const calculateButton = document.getElementById('calculate')
  const resultElement = document.getElementById('fibResult')
  const computationTimeElement = document.getElementById('computationTime')

  let startTime

  fibWorker.onmessage = (e) => {
    const endTime = performance.now()
    const computationTime = endTime - startTime

    resultElement.textContent = e.data.result
    computationTimeElement.textContent =
      `Computation time: ${computationTime.toFixed(2)}ms`

    calculateButton.disabled = false
    fibInput.disabled = false
  }

  calculateButton.addEventListener('click', () => {
    const n = parseInt(fibInput.value, 10)
    if (n > 0) {
      startTime = performance.now()
      resultElement.textContent = 'Calculating...'
      computationTimeElement.textContent = ''
      calculateButton.disabled = true
      fibInput.disabled = true

      // Show the UI is still responsive during calculation
      const dots = ['', '.', '..', '...']
      let dotIndex = 0

      const dotAnimation = setInterval(() => {
        resultElement.textContent = 'Calculating' + dots[dotIndex]
        dotIndex = (dotIndex + 1) % dots.length
      }, 300)

      // Send message to worker
      fibWorker.postMessage({ n })

      // Cleanup animation when worker responds
      fibWorker.addEventListener('message', function clearAnimation () {
        clearInterval(dotAnimation)
        fibWorker.removeEventListener('message', clearAnimation)
      }, { once: true })
    }
  })
})
