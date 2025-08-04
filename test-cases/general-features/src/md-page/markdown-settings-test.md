---
title: Markdown Settings Test
layout: root
---

# Markdown Settings Test Page

This page tests custom markdown-it settings.

## Custom Container Test

The following is a custom container that should be rendered with a special class:

:::test-box
This content should be inside a div with class="test-box".
The custom container was added through markdown-it.settings.js.
:::

## Regular Markdown

Here's some regular markdown that should still work:

- List item 1
- List item 2
  - Nested item

**Bold text** and *italic text* should work too.

```javascript
// Code blocks should work
console.log('Hello, world!');
```

> Blockquotes should also render normally.