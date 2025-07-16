# uhtml-isomorphic Example

This example demonstrates using [uhtml-isomorphic](https://github.com/WebReflection/uhtml-isomorphic) for building isomorphic components with DOMStack.

## Features

- Server-side rendering with the same syntax as client-side code
- Hydration of server-rendered components
- Pure JavaScript approach (no JSX required)
- Lightweight and efficient DOM updates

## Examples

- [Isomorphic Component Rendering](./isomorphic/) - Full isomorphic rendering with hydration
- [HTML Mount Example](./html-mount/) - Client-side mounting to HTML pages

## How It Works

uhtml-isomorphic provides a unified API for both server and client rendering, allowing you to write components once and use them everywhere. This example shows how to:

1. Create components using tagged template literals
2. Render on the server with DOMStack
3. Hydrate in the browser for interactivity
4. Use the same component code in both environments
