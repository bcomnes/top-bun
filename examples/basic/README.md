# Basic DOMStack Example

This example demonstrates a fundamental website built with DOMStack, showcasing core features without advanced customization.

## Overview

The basic example illustrates:
- Multiple page types (Markdown, HTML, JavaScript)
- Layout system and page nesting
- Asset handling
- Client-side JavaScript integration
- CSS styling (global and page-specific)
- Variables and metadata

## Getting Started

### Prerequisites

- Node.js 22.x or higher

### Installation

```bash
# Install dependencies
npm install
```

### Building the Example

```bash
# Build the site
npm run build

# Watch for changes during development
npm run watch
```

The built site will be in the `public` directory.

## Project Structure

```
src/
├── layouts/            # Layout templates
│   ├── root.layout.js  # Main layout
│   └── child.layout.js # Nested layout
├── md-page/            # Markdown page examples
├── js-page/            # JavaScript page examples
├── html-page/          # HTML page examples
├── global.css          # Global styles
├── global.client.js    # Global client-side JavaScript
├── global.vars.js      # Global variables
└── README.md           # Main content (becomes index.html)
```

## Key Features Demonstrated

### Page Types
- **Markdown pages** - Simple content authoring with frontmatter
- **JavaScript pages** - Dynamic content generation with full JS capabilities
- **HTML pages** - Direct HTML control for complex layouts

### Layouts
The example demonstrates DOMStack's layout system with nested layouts that wrap page content.

### Assets
Static assets like images are co-located with content and automatically copied to the output directory.

### Styling
Both global and page-specific CSS is demonstrated, showing how to scope styles appropriately.

## Learn More

This is one of several examples in the DOMStack repository. For more advanced features, check out the other examples like:
- css-modules
- preact
- tailwind
- and more...

For complete documentation, visit the [DOMStack GitHub repository](https://github.com/bcomnes/domstack).