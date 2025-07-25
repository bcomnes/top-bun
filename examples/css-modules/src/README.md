# CSS Modules Example

This example demonstrates how to use CSS modules with DOMStack, providing component-scoped styling that avoids global namespace conflicts.

CSS module support is provided by esbuild, so for more information on what is and isn't supported read the esbuild CSS module docs:

- [esbuild.github.io/content-types/#local-css](https://esbuild.github.io/content-types/#local-css)
- [github.com/css-modules/css-modules](https://github.com/css-modules/css-modules)

CSS modules are NOT supported in Node.js natively, so you need to import a loader to support them, or only reference them in client bundles.

## How It Works

1. Create a CSS file with the `.module.css` extension
2. Import the styles in your JavaScript components that get loaded in your client bundles.
3. Use the imported class names as object properties on the javascript side.

## Project Structure

```
src/
├── globals/         # Global styles and scripts
├── layouts/         # Layout templates
├── modules/         # Components with CSS modules
│   ├── app.module.css  # Module-scoped CSS
│   ├── client.js       # Client-side hydration
│   ├── page.js         # Server-side component
│   └── style.css       # Regular CSS
└── README.md        # This file (becomes index.html)
```

## Example

Check out the [CSS Modules in a Preact Component](./modules/) example to see CSS modules in action.
