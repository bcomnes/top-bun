# DomStack with Fastify Example

This example demonstrates how to use DomStack as a Fastify plugin to combine static site generation with dynamic server routes.

## Features

- ✅ Built-in static file serving with Fastify
- ✅ DomStack layouts, styles, and client-side JS
- ✅ Auto-rebuilding in development mode
- ✅ Server-side routes integrated with DomStack layouts

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
cd examples/fastify-server
npm install
```

### Development Mode

```bash
npm run dev
```

This will start the server in development mode with automatic rebuilding when files change.

### Production Build

```bash
npm run build
```

This will generate a static build in the `dist` directory.

### Production Server

```bash
npm start
```

This will start the server in production mode without watch mode.

## Project Structure

```
fastify-server/
├── index.js             # Main server file
├── build.js             # Static build script
├── package.json         # Project dependencies
└── src/                 # Source files for DomStack
    ├── README.md        # Home page (markdown)
    ├── global.css       # Global styles
    ├── root.layout.js   # Root layout
    ├── api/             # API routes
    │   ├── server.js    # Dynamic server route
    │   └── style.css    # Styles for API page
    └── pages/           # Static pages
        ├── page.js      # JavaScript page example
        ├── client.js    # Client-side JS for pages
        └── style.css    # Styles for pages
```

## How It Works

1. The Fastify server starts up and registers the `fastify-domstack` plugin
2. DomStack builds the static site from the `src` directory to the `dist` directory
3. Fastify serves static files from the `dist` directory
4. DomStack watches for file changes and rebuilds when needed (in development mode)
5. Dynamic server routes are processed on each request, with access to the Fastify request and reply objects

## Adding New Pages

### Static Pages

Add any of these file types to any directory under `src/`:
- `README.md` - Markdown page that will be built to `index.html`
- `page.html` - HTML page that will be built to `index.html`
- `page.js` - JavaScript function that returns HTML, built to `index.html`
- `*.md` - Any markdown file will be built to a corresponding HTML file

### Dynamic Server Routes

Create a `server.js` file in any directory:

```js
export const vars = {
  title: 'My Server Route',
  layout: 'root' // Use the root layout
}

export default async function(request, reply) {
  return `<h1>Dynamic Content</h1>
  <p>Generated at ${new Date().toLocaleString()}</p>`;
}
```

The server route will be available at the path corresponding to its location in the `src` directory.

## License

MIT