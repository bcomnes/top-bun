---
title: Markdown Page Example
---

# Markdown Page Example

## How Markdown Pages Work

A page folder with a `README.md` markdown file renders to an `index.html` file inside the corresponding output folder.

For example:

```
/md-page/README.md ---> /md-page/index.html
```

Links to other markdown files are automatically transformed to their HTML equivalents during the build process, making navigation seamless between source and output.

## Page-Scoped Resources

Each markdown page can utilize the following page-scoped files:

- [`client.js`](./client.js) - Client-side JavaScript specific to this page
- [`style.css`](./style.css) - CSS styles specific to this page
- [`page.vars.js`](./page.vars.js) - Variables and metadata for this page

## Asset Management

DOMStack copies all assets from the `src` directory to the output folder with a 1:1 mapping. This approach encourages:

- **Co-location of assets** - Keep images near the documents that use them
- **Logical organization** - Avoid a single overcrowded global assets folder
- **Simplified references** - Maintain the same relative paths in source and output

### Example Image Asset

Below is an example of an image asset referenced from the page's assets folder:

![Matrix Animation](./assets/matrix.gif)

## Navigation

- [Back to Home](../)
- [View Subpage](./sub-page/README.md)



