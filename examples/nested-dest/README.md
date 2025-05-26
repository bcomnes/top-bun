# Nested dest

One of the design goals of `domstack` was to allow you to point `domstack` at a generic
library repository, and render out all of the markdown inside of it, into a `dest` folder.

The issue with this is that `dest` folder essentially lives inside of the `src` folder,
so it was important to support sane ignore patterns by default so you don't fall into a recursive render
loop, or try to render out `node_modules` etc.

This example site points `domstack` at the root of the example `/`, and builds into `/public`.

boop beep
