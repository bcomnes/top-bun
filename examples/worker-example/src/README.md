# DOMStack Web Workers Example

This example demonstrates how to use web workers in a DOMStack project.

## Features

- **Counter Worker**: A simple worker that maintains state and responds to messages
- **Fibonacci Worker**: A worker that performs computationally intensive operations
- **Integration with DOMStack**: Shows how workers are bundled and made available to pages

## [Worker Page Example](/worker-page/)

Visit the [Worker Example page](/worker-page/) to see the web workers in action. The page demonstrates:

1. How to create and structure web workers in DOMStack
2. How to communicate with workers using messages
3. How to handle responses from workers

## How It Works

DOMStack supports web workers through a special naming convention:

- Create files with the pattern `{name}.worker.js` in your page directories
- Initialize them directly in your client.js files

For example, with a file structure like:

```
page-directory/
  ├── page.js
  ├── client.js
  ├── counter.worker.js
  └── fibonacci.worker.js
```

You can initialize the workers in your client.js:

```js
// In client.js
const counterWorker = new Worker(
  new URL('./counter.worker.js', import.meta.url), 
  { type: 'module' }
);

// Send messages to the worker
counterWorker.postMessage({ action: 'increment' });

// Receive messages from the worker
counterWorker.onmessage = (e) => {
  console.log(e.data.count);
};
```

## Technical Details

- Workers are bundled using esbuild during the build process
- Each worker gets its own bundle with proper hashing for cache busting
- Workers are loaded as ES modules by default