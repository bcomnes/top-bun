# Markdown-it Settings Example

This example demonstrates how to customize the markdown-it instance used for rendering Markdown content in DOMStack using the `markdown-it.settings.js` file.

## Features

- Custom containers for warnings, info boxes, and collapsible sections
- Custom styling for code blocks
- Example of how to add and configure markdown-it plugins

## How it Works

DOMStack now supports a `markdown-it.settings.js` file that allows you to customize the markdown-it instance. This file should export a default function that receives the default markdown-it instance and returns a modified instance.

```js
export default async function markdownItSettingsOverride (md) {
  // Add plugins
  md.use(somePlugin)
  
  // Customize renderers
  md.renderer.rules.someRule = function (tokens, idx, options, env, renderer) {
    // Custom rendering logic
  }
  
  return md
}
```

## Running the Example

1. Clone the repository
2. Run `npm install` from the project root
3. Navigate to this example directory: `cd examples/markdown-settings`
4. Run `npm run build` to build the site
5. Open `dist/index.html` in your browser to see the results

## What to Look For

- `src/markdown-it.settings.js` - This file customizes the markdown-it instance with custom containers
- `src/page.md` - This file demonstrates the custom markdown syntax
- `src/style.css` - Contains styles for the custom containers

## Custom Container Examples

The example includes three custom containers:

### Warning Container

```markdown
::: warning Security Notice
This is a custom warning container.
:::
```

### Info Container

```markdown
::: info Did you know?
This is a custom info container.
:::
```

### Details Container (Collapsible)

```markdown
::: details Click to expand
This content is hidden by default.
:::
```

## Further Customization

You can add any markdown-it plugin or customize the rendering of any markdown element by modifying the `markdown-it.settings.js` file. This provides a powerful way to extend the markdown capabilities of your DOMStack site.