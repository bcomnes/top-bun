# String Layouts Example

This example demonstrates how to create layouts using simple string templates in DOMStack while maintaining compatibility with the Preact rendering approach.

## Overview

String layouts provide a straightforward approach to creating HTML templates without requiring a full component library. This example shows how to:

- Create a layout using template literals
- Properly handle variables, scripts, and styles
- Use the recommended structure for DOMStack layouts
- Integrate with Preact's rendering system for consistency

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
├── README.md        # Main content (becomes index.html)
└── root.layout.js   # String-based layout template
```

## How It Works

The `root.layout.js` file demonstrates:

1. Using template literals to create the page structure
2. Rendering head and body sections with Preact for consistency
3. Properly handling dynamic content, scripts, and styles
4. Supporting both string and component-based children

## Key Features

### Simple and Readable

String templates are easy to read and understand, making them a good choice for simpler projects or for developers who prefer working directly with HTML.

### Preact Integration

While using string templates, this example maintains compatibility with Preact by:
- Using the same structure as Preact-based layouts
- Properly handling HTML escaping and variable insertion
- Supporting the same props and rendering pattern

## Learn More

For more advanced component-based layouts, check out the other examples in the DOMStack repository, particularly:
- basic
- preact

For complete documentation, visit the [DOMStack GitHub repository](https://github.com/bcomnes/domstack).