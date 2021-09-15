# Nested Markdown

A page folder with a `README.md` markdown file renders to an `index.html` file inside the parent folder.

For example:

```
/md-page/README.md ---> /md-page/index.html
```

They can link to other markdown files, and the links are correctly built to their html equivalent.

Page folder markdown file can utilize the following page scoped files:

- [`client.js`](./client.js)
- [`style.css`](./style.css)
- [`page.vars.js`](./page.vars.js)

All assets in the `src` directory are copied over to the `dist` folder, 1:1.
It's a good idea to co-locate images near the document they live in, otherwise
you end up with a jumble of files in one global images folder.
It's worth the overhead of copying static assets into a build directory in order to gain a simple approach to organzing assets.
In the future, asset serving may be virtualized during development.

![](./assets/matrix.gif)


