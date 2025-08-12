/**
 * Counter Web Worker Example
 *
 * This worker maintains a counter state and responds to various actions:
 * - increment: Adds 1 to the counter
 * - decrement: Subtracts 1 from the counter
 * - reset: Sets the counter back to zero
 * - set: Sets the counter to a specific value
 * - multiply: Multiplies the counter by a value
 */

// Initialize counter state
let count = 0
const operationHistory = []
const MAX_HISTORY = 10

// Listen for messages from the main thread
self.onmessage = (event) => {
  const { action, value } = event.data
  const oldCount = count
  const timestamp = new Date().toISOString()

  switch (action) {
    case 'increment':
      // Increment the counter
      count++
      recordOperation('increment', oldCount, count, timestamp)
      break

    case 'decrement':
      // Decrement the counter
      count = Math.max(0, count - 1) // Prevent negative values
      recordOperation('decrement', oldCount, count, timestamp)
      break

    case 'reset':
      // Reset the counter to zero
      count = 0
      recordOperation('reset', oldCount, count, timestamp)
      break

    case 'set':
      // Set the counter to a specific value
      if (typeof value === 'number' && !isNaN(value)) {
        count = Math.max(0, value) // Ensure non-negative
        recordOperation('set', oldCount, count, timestamp)
      }
      break

    case 'multiply':
      // Multiply the counter by a value
      if (typeof value === 'number' && !isNaN(value)) {
        count = Math.floor(count * value)
        recordOperation('multiply', oldCount, count, timestamp, value)
      }
      break

    case 'getHistory':
      // Return operation history
      self.postMessage({ count, history: operationHistory })
      return

    default:
      // Unknown action
      console.warn(`Unknown action: ${action}`)
  }

  // Send the current count back to the main thread
  self.postMessage({ count, lastOperation: operationHistory[0] })
}

/**
 * Records an operation in the history
 *
 * @param {string} type - The type of operation
 * @param {number} oldValue - The value before the operation
 * @param {number} newValue - The value after the operation
 * @param {string} timestamp - When the operation occurred
 * @param {number} [param] - Optional parameter for the operation
 */
function recordOperation (type, oldValue, newValue, timestamp, param) {
  const operation = {
    type,
    oldValue,
    newValue,
    timestamp,
    param
  }

  // Add to the beginning of the array
  operationHistory.unshift(operation)

  // Trim history to maximum size
  if (operationHistory.length > MAX_HISTORY) {
    operationHistory.pop()
  }
}

// Send initial count on startup
self.postMessage({ count, history: operationHistory })
