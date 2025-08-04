# DOMStack Web Workers Example

This example demonstrates how to use web workers in a DOMStack project.

## Overview

Web workers provide a way to run JavaScript in background threads, allowing for resource-intensive operations without blocking the main thread. In this example, we demonstrate:

1. A simple counter worker that maintains state
2. A Fibonacci calculator worker that performs computationally intensive operations

## Installation & Running

```bash
# Navigate to the example directory
cd examples/worker-example

# Install dependencies
npm install

# Build and serve
npm start
```

This will start a development server and open the example in your browser.

## How It Works

DOMStack supports web workers through a simple naming convention:

- Create files with the pattern `{name}.worker.js` in your page directories
- During build, DOMStack generates a `meta.json` file with worker filename mappings
- Access the workers in your client code using this metadata

## Implementation Details

### 1. Worker Files

The example includes two web worker files:

- `counter.worker.js` - A worker that maintains a counter state and supports multiple operations
- `fibonacci.worker.js` - A worker that performs CPU-intensive Fibonacci calculations

### 2. Using Workers in Pages

The worker code is separated into dedicated client-side files (`client.js`). DOMStack generates a `meta.json` file with hashed worker paths:

```js
// First, fetch the meta.json to get worker paths
async function initializeWorkers() {
  const response = await fetch('./meta.json');
  const meta = await response.json();
  
  // Initialize workers with the correct hashed filenames
  const counterWorker = new Worker(
    new URL(`./${meta.workers.counter}`, import.meta.url), 
    { type: 'module' }
  );
  
  // Use the workers
  counterWorker.postMessage({ action: 'increment' });
  
  counterWorker.onmessage = (e) => {
    counterElement.textContent = e.data.count;
  };
}
```

## What You'll Learn

- How to create web worker files in DOMStack
- How web workers are automatically bundled by the build system
- How to use the `meta.json` file to access worker paths
- Practical patterns for worker communication
- Keeping the UI responsive during heavy computations

## Project Structure

```
worker-example/
├── package.json        # Project dependencies and scripts
├── src/
│   ├── globals/        # Global styles and variables
│   ├── layouts/        # Page layouts
│   ├── README.md       # Home page content
│   └── worker-page/    # Web worker example page
│       ├── page.js           # Main page template
│       ├── client.js         # Client-side code for worker interaction
│       ├── counter.worker.js # Counter worker implementation
│       ├── fibonacci.worker.js # Fibonacci calculator worker
│       └── style.css         # Page-specific styles
```

## Build Output

When you build the project, DOMStack:

1. Bundles each worker file with a unique hash in the filename
2. Creates a `meta.json` file in each page directory that contains workers
3. Maps the original worker names to their hashed filenames

```
public/worker-page/
├── index.html
├── client-XXXX.js
├── counter.worker-XXXX.js    # Hashed worker filename
├── fibonacci.worker-XXXX.js  # Hashed worker filename
├── meta.json                 # Contains worker path mappings
└── style-XXXX.css
```

## Benefits of Web Workers

- **Performance** - Run CPU-intensive tasks without blocking the UI
- **Responsiveness** - Keep your app responsive during heavy computations
- **Isolation** - Workers run in a separate context with their own memory

## Learn More

- [MDN Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)