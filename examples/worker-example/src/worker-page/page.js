/**
 * A DOMStack page that demonstrates using web workers
 *
 * This example shows how to:
 * 1. Web workers are automatically loaded from {name}.worker.js files
 * 2. Client-side code interacts with workers in client.js
 * 3. No need to manually load or instantiate workers in the page
 */
export default function workerExamplePage ({ vars }) {
  return `
    <div class="worker-example">
      <h1>${vars.title}</h1>
      <p>
        This page demonstrates how to use web workers in DOMStack for offloading 
        tasks from the main thread to maintain a responsive user interface.
      </p>
      
      <section class="explanation">
        <h2>About Web Workers</h2>
        <p>
          Web Workers run JavaScript in background threads, allowing you to perform
          computations without blocking the main UI thread. This example shows two
          worker implementations:
        </p>
        <ul>
          <li><strong>Counter Worker:</strong> A simple worker that maintains state</li>
          <li><strong>Fibonacci Worker:</strong> A computationally intensive worker</li>
        </ul>
      </section>
      
      <section class="demo-section counter">
        <h2>Counter Worker Example</h2>
        <p>This worker maintains a state and updates it based on messages:</p>
        <div class="demo-container">
          <div class="counter-display">
              <p>Counter value: <span id="counter">0</span></p>
              <p class="last-operation" id="lastOperation"></p>
            </div>
            <div class="controls">
              <button id="increment">Increment</button>
              <button id="decrement">Decrement</button>
              <button id="reset">Reset</button>
              <button id="multiply">Multiply by 2</button>
            </div>
        </div>
      </section>
      
      <section class="demo-section fibonacci">
        <h2>Fibonacci Calculator Worker</h2>
        <p>
          This worker performs CPU-intensive calculations in a background thread.
          Try entering a large number (30-45) to see how the worker prevents UI blocking.
        </p>
        <div class="demo-container">
          <div class="input-group">
            <label for="fibInput">Calculate Fibonacci number:</label>
            <input type="number" id="fibInput" min="1" max="50" value="30">
          </div>
          <div class="controls">
            <button id="calculate">Calculate</button>
          </div>
          <div class="result">
            <p>Result: <span id="fibResult">-</span></p>
            <p id="computationTime" class="computation-time"></p>
          </div>
        </div>
      </section>

      <section class="code-example">
        <h2>Implementation</h2>
        <p>Worker files use the <code>{name}.worker.js</code> naming convention. They're bundled separately and accessible in client.js:</p>
        <pre><code>// Initialize the workers in client.js
const counterWorker = new Worker(new URL('./counter.worker.js', import.meta.url), { type: 'module' });
const fibWorker = new Worker(new URL('./fibonacci.worker.js', import.meta.url), { type: 'module' });</code></pre>
        <p>Each worker has its own dedicated file that gets bundled separately.</p>
        <p>Send messages to workers:</p>
        <pre><code>// Send data to the worker
counterWorker.postMessage({ action: 'increment' });
fibWorker.postMessage({ n: 42 });</code></pre>
        <p>Receive responses from workers:</p>
        <pre><code>// Listen for worker responses
counterWorker.onmessage = (e) => {
  console.log('New count:', e.data.count);
};</code></pre>
      </section>
    </div>
  `
}

export const vars = {
  title: 'Web Worker Example',
  description: 'Learn how to use web workers in DOMStack for background processing',
  layout: 'root'
}
