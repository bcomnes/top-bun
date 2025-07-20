/**
 * Fibonacci Web Worker Example
 *
 * This worker calculates Fibonacci numbers using different methods
 * based on the input size to demonstrate various computation strategies.
 */

// Listen for messages from the main thread
self.onmessage = (event) => {
  const { n } = event.data

  if (typeof n !== 'number' || n < 0) {
    self.postMessage({
      error: 'Invalid input. Please provide a positive number.'
    })
    return
  }

  // Simulate intense computation by adding a small delay for demonstration
  // This helps show the benefits of using web workers
  const startTime = performance.now()

  // Choose algorithm based on input size
  let result
  if (n <= 40) {
    // For smaller numbers, use the iterative approach
    result = fibonacciIterative(n)
  } else {
    // For larger numbers, we'd use a more optimized approach
    // but still simulate the longer computation time
    simulateHeavyComputation()
    result = fibonacciIterative(n)
  }

  const computationTime = performance.now() - startTime
  console.log(`Fibonacci(${n}) took ${computationTime.toFixed(2)}ms to calculate`)

  // Send the result back to the main thread
  self.postMessage({ result })
}

/**
 * Calculate the nth Fibonacci number using iteration
 * This is more efficient for larger numbers
 *
 * @param {number} n - The position in the Fibonacci sequence (0-based)
 * @return {number} The nth Fibonacci number
 */
function fibonacciIterative (n) {
  // Handle edge cases
  if (n === 0) return 0
  if (n === 1) return 1

  let a = 0
  let b = 1
  let temp

  // Iterative calculation
  for (let i = 2; i <= n; i++) {
    temp = a + b
    a = b
    b = temp
  }

  return b
}

/**
 * Recursive implementation (not used for large numbers due to performance)
 * Included for educational purposes only
 */
// function fibonacciRecursive (n) {
//   if (n <= 1) return n
//   return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2)
// }

/**
 * Simulate a heavy computation by performing unnecessary work
 * This is just to demonstrate the benefit of web workers for UI responsiveness
 */
function simulateHeavyComputation () {
  // Simulate intensive computation with a deliberate delay
  const start = performance.now()
  while (performance.now() - start < 1000) {
    // Busy wait to simulate CPU-intensive work
    // eslint-disable-next-line no-unused-expressions
    Math.random() * Math.random()
  }
}
