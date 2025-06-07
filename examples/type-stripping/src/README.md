# TypeScript Support in DOMStack

This example demonstrates how DOMStack handles TypeScript files by automatically stripping types during the build process, allowing you to use TypeScript without additional configuration.

## What is Type Stripping?

Type stripping is the process of removing TypeScript type annotations during compilation to produce standard JavaScript. DOMStack performs this automatically using ESBuild, giving you:

- Full TypeScript type checking during development
- Clean JavaScript output without runtime type overhead
- No need for separate TypeScript build steps

## Features Demonstrated

This example showcases:

- `.ts` files for standard TypeScript
- `.tsx` files for JSX with TypeScript
- Type imports and exports
- Interface definitions
- Automatic handling of type annotations

## Examples in This Project

- [Isomorphic Component Rendering](./isomorphic/) - TypeScript with Preact
- [TSX Client Example](./tsx-page/) - TypeScript JSX components

## How It Works

1. Write your code using full TypeScript syntax
2. DOMStack detects `.ts` and `.tsx` file extensions
3. ESBuild automatically strips type annotations during bundling
4. Your pages and components work exactly like JavaScript versions

## Benefits of TypeScript in DOMStack

- **Developer Experience**: Get IDE autocompletion and type checking
- **Error Prevention**: Catch type errors before runtime
- **Documentation**: Types serve as self-documenting code
- **Zero Runtime Cost**: All types are removed in the final output

## Getting Started with TypeScript

To use TypeScript in your DOMStack project:

1. Create files with `.ts` or `.tsx` extensions
2. Write TypeScript code normally
3. DOMStack will handle the rest automatically

No additional setup required!
