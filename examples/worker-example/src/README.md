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
- DOMStack generates a `workers.json` file with worker filename mappings during build
- Use this metadata to initialize workers in your client.js files

For example, with a file structure like:

```
page-directory/
  ├── page.js
  ├── client.js
  ├── counter.worker.js
  └── fibonacci.worker.js
```

After building, DOMStack generates:

```
page-directory/
  ├── index.html
  ├── client-XXXX.js
  ├── counter.worker-XXXX.js
  ├── fibonacci.worker-XXXX.js
  └── workers.json      # Contains worker path mappings
```

You can initialize the workers in your client.js:

```js
// In client.js
async function initializeWorkers() {
  // Fetch the workers.json to get the hashed worker filenames
  const response = await fetch('./workers.json');
  const workersData = await response.json();
  
  // Initialize workers with the correct hashed filenames
  const counterWorker = new Worker(
    new URL(`./${workersData.counter}`, import.meta.url),
    { type: 'module' }
  );
  
  // Send messages to the worker
  counterWorker.postMessage({ action: 'increment' });
  
  // Receive messages from the worker
  counterWorker.onmessage = (e) => {
    console.log(e.data.count);
  };
  
  return counterWorker;
}

// Initialize workers when the page loads
const counterWorker = await initializeWorkers();
```

## Technical Details

- Workers are bundled using esbuild during the build process
- Each worker gets its own bundle with proper hashing for cache busting
- Workers are loaded as ES modules by default
- The `workers.json` file helps client code find the correct hashed worker files