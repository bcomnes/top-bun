---
title: Basic DOMStack Example
md-files: support yaml frontmatter!
---

# Basic DOMStack Example

This example demonstrates a complete basic website built with DOMStack, showcasing the core features without advanced customization.

## Features Demonstrated

- Multiple page types (Markdown, HTML, JavaScript)
- Page layouts and nesting
- Asset handling
- Client-side JavaScript
- CSS styling (global and page-specific)
- Frontmatter variables

## Project Structure

```
src/
├── layouts/         # Layout templates
├── md-page/         # Markdown page examples
├── js-page/         # JavaScript page examples
├── html-page/       # HTML page examples
├── global.css       # Global styles
├── global.client.js # Global client-side JavaScript
├── global.vars.js   # Global variables
└── README.md        # This file (becomes index.html)
```

## Page Examples

Navigate through different page types:

- [Loose Markdown File](./loose-file.md)
- [Markdown Page Example](./md-page/README.md)
- [Nested Markdown Page](./md-page/sub-page/README.md)
- [JavaScript Page Example](./js-page/)
- [HTML Page Example](./html-page/page.html)

## How It Works

- **Markdown Pages**: The title of this document (`h1`) becomes the `title` variable for the page and renders in the `<title>` tag.
- **Layouts**: Pages use layouts defined in the `layouts` directory.
- **Assets**: Static assets are copied to the output directory.
- **Styling**: Both global and page-specific CSS is processed and included.
- **Client JS**: JavaScript bundles are created for enhanced functionality.

## Building the Example

Run the following commands:

```bash
npm install
npm run build
```

To watch for changes during development:

```bash
npm run watch
```
