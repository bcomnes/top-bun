# React with TypeScript in DOMStack

This example demonstrates how to use React with TypeScript in DOMStack for client-side rendering. Unlike the Preact examples that come with DOMStack by default, this example shows how to override the default JSX configuration to use React with TypeScript instead.

## What This Example Shows

- How to configure ESBuild to use React instead of Preact for TSX
- Client-side rendering with React components written in TypeScript
- Type-safe React hooks for state management
- TypeScript interfaces and type definitions
- Integration with DOMStack's build system

## Key Components

1. **ESBuild Configuration**: Custom `esbuild.settings.ts` that overrides the default Preact JSX settings
2. **React Components**: Client-side components with typed hooks and state
3. **Static HTML Mount Points**: HTML pages with mount points for React components
4. **TypeScript Interfaces**: Type definitions for props, state, and functions

## Example Structure

- `globals/esbuild.settings.ts` - Configuration to use React instead of Preact
- `react-page/` - Client-side React component example with TypeScript
- `layouts/` - Basic layout structure

## How It Works

Unlike isomorphic examples with Preact, this example focuses on client-side rendering only. The workflow is:

1. The HTML is served with empty containers
2. React components are loaded and mounted to these containers
3. All rendering happens in the browser

## Getting Started

Run the following commands:

```bash
npm install
npm run build
```

To watch for changes during development:

```bash
npm run watch
```

## React with TypeScript vs. Preact in DOMStack

DOMStack uses Preact by default because it's smaller and has a compatible API with React. This example shows how to use React with TypeScript instead if you prefer or need specific React features with type safety.

The key difference is in the `esbuild.settings.ts` file, which configures ESBuild to use React's TSX transformer and runtime, along with TypeScript support.