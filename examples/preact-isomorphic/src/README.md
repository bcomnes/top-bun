# Preact Isomorphic Rendering Example

This example demonstrates how to implement isomorphic rendering with Preact in DOMStack. Isomorphic rendering means the same components can be rendered on both the server and client, providing benefits of server-side rendering (SSR) with client-side interactivity.

## What is Isomorphic Rendering?

Isomorphic (or universal) rendering combines:

1. **Server-side rendering** - Components are rendered to HTML on the server first
2. **Client-side hydration** - JavaScript takes over in the browser to add interactivity
3. **Shared component code** - The same components work in both environments

## Benefits

- **Performance**: Faster initial page loads and time-to-content
- **SEO**: Search engines see fully rendered content
- **Accessibility**: Content is available without JavaScript
- **User Experience**: No flash of unstyled content or layout shifts

## Examples in This Project

- [Isomorphic Component Rendering](./isomorphic/) - Complete todo app rendered both server and client-side
- [JSX Client Mounting](./jsx-page/) - Example of client-side JSX rendering into static HTML

## Implementation Approach

This example uses:

- **Preact** - A lightweight alternative to React
- **HTM** - JSX alternative using tagged template literals
- **Signals** - For reactive state management
- **preact-render-to-string** - For server-side rendering

## How It Works

1. The server renders components to HTML using `preact-render-to-string`
2. The HTML is sent to the browser with linked JavaScript
3. In the browser, the same components hydrate the existing HTML
4. Interactivity is enabled without replacing the DOM structure

Learn more about these techniques in the examples!
