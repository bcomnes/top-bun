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
- Access them in your pages through the `workers.{name}` property

## Implementation Details

### 1. Worker Files

The example includes two web worker files:

- `counter.worker.js` - A worker that maintains a counter state and supports multiple operations
- `fibonacci.worker.js` - A worker that performs CPU-intensive Fibonacci calculations

### 2. Using Workers in Pages

The worker code is separated into dedicated client-side files (`client.js`):

```js
// Initialize the workers in client.js
const counterWorker = new Worker(new URL('./counter.worker.js', import.meta.url), { type: 'module' });
const fibWorker = new Worker(new URL('./fibonacci.worker.js', import.meta.url), { type: 'module' });

// Send messages to workers
counterWorker.postMessage({ action: 'increment' });

// Receive messages from workers
counterWorker.onmessage = (e) => {
  counterElement.textContent = e.data.count;
};
```

## What You'll Learn

- How to create web worker files in DOMStack
- How web workers are automatically bundled by the build system
- How to access worker paths in your page templates
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

## Benefits of Web Workers

- **Performance** - Run CPU-intensive tasks without blocking the UI
- **Responsiveness** - Keep your app responsive during heavy computations
- **Isolation** - Workers run in a separate context with their own memory

## Learn More

- [MDN Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)