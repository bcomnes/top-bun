---
title: Markdown-it Settings Example
layout: root
---

# Markdown-it Settings Example

This page demonstrates custom markdown-it plugins configured via `markdown-it.settings.js`.

## Custom Containers

### Warning Container

::: warning Security Notice
This is a custom warning container. It can be used to highlight important security information or other warnings.
:::

::: warning
This warning uses the default title.
:::

### Info Container

::: info Did you know?
Custom containers can make your documentation more expressive and easier to scan.
:::

::: info
Info boxes are great for tips and additional context.
:::

### Details Container

::: details Click to expand more information
This content is hidden by default and can be revealed by clicking the summary.

You can include any markdown content here:
- Lists
- **Bold text**
- `code snippets`
- And more!
:::

::: details Advanced Configuration
The `markdown-it.settings.js` file allows you to:
1. Add custom plugins
2. Modify existing renderers
3. Configure parser options
4. Create entirely new markdown syntaxes
:::

## Custom Code Block Styling

The code blocks below have custom classes applied:

```javascript
// This code block has a custom class
const greeting = "Hello from custom markdown-it settings!";
console.log(greeting);
```

```python
# Python code also gets the custom treatment
def greet(name):
    return f"Hello, {name}!"
```

## How It Works

The `markdown-it.settings.js` file exports a function that receives the default markdown-it instance and returns a modified version. This allows you to:

- Add third-party plugins
- Create custom containers
- Override default renderers
- Configure parsing options

Check out the `markdown-it.settings.js` file in this example to see how these customizations are implemented.