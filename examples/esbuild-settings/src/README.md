# ESBuild Settings Example

## Overview

This example demonstrates how to customize the bundling process in DOMStack by configuring ESBuild options. Specifically, it shows how to use Node.js built-in modules in browser-side JavaScript by applying polyfills.

## What This Example Shows

- How to create and use an `esbuild.settings.js` file
- How to configure ESBuild plugins (in this case, for Node.js polyfills)
- How browser code can use Node.js modules safely

## Esbuild build options

The settings file export defaults an async function that receives BuildOptions for esbuild.
The function should modify, extend or replace this BuildOptions object and return it as the return value of the function.
These options are used to build the CSS and client bundles in all of the pages.

- [ESbuild BuildOptions API Docs](https://esbuild.github.io/api/#build)

This is a powerful hook that you can use to modify almost anything about the build with.
However, modifying certain parts of the build options can also break the DOMSTack build.
Proceed with caution!

## How It Works

1. The `client.js` file imports a Node.js built-in module (`os`)
2. The `esbuild.settings.js` file configures the `esbuild-plugin-polyfill-node` plugin
3. During the build process, DOMStack uses these settings to polyfill Node.js modules
4. The result is browser-compatible JavaScript that simulates Node.js APIs

Open your developer tools to see something like this:

![](./img/dev.png)

## Key Files

- `esbuild.settings.js`: Contains the ESBuild configuration
- `client.js`: Demonstrates importing a Node.js module
