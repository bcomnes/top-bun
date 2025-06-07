# Nested Destination Example

## Overview

This example demonstrates one of DOMStack's key features: the ability to build a documentation site from an existing repository structure without reorganizing it.

## How It Works

DOMStack can use any directory as its source, including the root of your project. This allows you to:

1. Generate documentation directly from your project's existing markdown files
2. Keep source files in their original locations
3. Build the site into a separate destination directory

## Key Concepts

### Source and Destination Paths

In this example:
- Source: The root directory (`/`)
- Destination: A subdirectory (`/public`)

### Avoiding Recursive Processing

When your destination folder is inside your source tree, DOMStack needs to avoid:
- Processing files in the destination folder (recursive loop)
- Processing unwanted directories like `node_modules`

This is handled through intelligent ignore patterns:
- Default ignore patterns for common directories
- Custom ignore patterns through the `--ignore` flag

## Example Configuration

The build command in this example uses:

```bash
domstack --src . --ignore ignore
```

This tells DOMStack to:
- Use the current directory (`.`) as the source
- Explicitly ignore the `ignore` directory
- Apply default ignore patterns for `node_modules`, etc.

## Try It Yourself

1. Examine this project's structure - notice how files are in the root
2. Look at the built output in `/public` to see how files are processed
3. Check `package.json` to see how the build command is configured
