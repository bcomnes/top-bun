---
title: String Layout Example
siteName: StringLayouts
---
# String Layout Example

This example demonstrates using pure JavaScript template literals for creating simple yet powerful layouts in DOMStack, without requiring a templating library.

## What Are String Layouts?

String layouts use JavaScript's built-in template literals to generate HTML structures. Unlike component-based layouts that use libraries like Preact or React, string layouts work directly with strings, making them:

- Lightweight (no library dependencies)
- Easy to understand (pure JavaScript)
- Highly performant (minimal processing overhead)

## How It Works

The `root.layout.js` file in this example:

1. Uses JavaScript template literals as the foundation
2. Works directly with strings rather than components
3. Properly handles dynamic content, scripts, and styles
4. Maintains the same structure as component-based layouts

## Benefits

String-based layouts provide several advantages:

- **Simplicity**: Easy to read and understand HTML structure
- **Flexibility**: Direct control over HTML output
- **Performance**: Minimal overhead compared to complex templating systems
- **Compatibility**: Works seamlessly with DOMStack's page system
- **No Dependencies**: Reduces bundle size by avoiding templating libraries

## Implementation

The string layout pattern is remarkably clean:

```js
// Template structure with tagged template literal
return /* html */`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>${siteName}${title ? ` | ${title}` : ''}</title>
      <!-- Other head elements -->
    </head>
    <body>
      <div class="container">
        ${children}
      </div>
    </body>
  </html>
`
```

### Key Techniques

1. **Dynamic Content**: Use `${variable}` syntax to insert dynamic content
2. **Conditional Content**: Use ternary expressions like `${condition ? 'yes' : ''}` 
3. **Repeating Elements**: Use `${array.map(item => `<li>${item}</li>`).join('')}`
4. **Comment Hints**: The `/* html */` comment helps editors provide syntax highlighting

## When to Use String Layouts

String layouts are ideal for:

- Simple websites with minimal dynamic content
- Projects where bundle size is critical
- Static site generation
- Beginners learning web development fundamentals

For more complex applications with extensive component reuse, consider using component-based layouts with Preact or other libraries.
