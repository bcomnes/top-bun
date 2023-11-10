# @siteup/cli
[![Actions Status](https://github.com/bcomnes/siteup-cli/workflows/tests/badge.svg)](https://github.com/bcomnes/siteup-cli/actions)
[![Coverage Status](https://coveralls.io/repos/github/bcomnes/siteup/badge.svg?branch=master)](https://coveralls.io/github/bcomnes/siteup?branch=master)
[![Types in JS](https://img.shields.io/badge/types_in_js-yes-brightgreen)](https://github.com/voxpelli/types-in-js)
[![Neocities][neocities-img]](https://siteup.neocities.org)

`siteup` builds websites with html, md, css and js.

Look at [examples](./examples/) and `siteup` [dependents](https://github.com/bcomnes/siteup-cli/network/dependents) for some examples how `siteup` can work.


`siteup` is sort of like "markup", which is related to "markdown", which inspired the project [`sitedown`](https://ghub.io/sitedown) to which `siteup` is a spiritual offshot of. Point `siteup` at a folder of page documents, and get a website.

```console
npm install @siteup/cli
```

## Usage

``` console
$ siteup --help
Usage: siteup [options]

    Example: siteup --src website --dest public

    --src, -s             path to source directory (default: "src")
    --dest, -d            path to build destination directory (default: "public")
    --ignore, -i          comma separated gitignore style ignore string
    --watch, -w           build, watch and serve the site build
    --watch-only          watch and build the src folder without serving
    --help, -h            show help
    --version, -v         show version information
siteup (v5.0.0)
```

`siteup` builds a `src` directory into a `dest` directory (default: `public`).

## Concepts

Siteup builds a website from "pages" in a `src` directory, 1:1 into a `dest` directory.
A `src` directory tree might look something like this:

```bash
src % tree
.
├── a-page
│        ├── README.md # folders with README.md in them turn into /a-page/index.htnl
│        ├── client.js # Every page can define its own client.js script that loads only with it.
│        ├── style.css # Every page can define its own style.css style that loads only with it.
│        └── nested-js-page # pages are built in place and can nest. This page is accessed at /a-page/nested-js-page/
│               ├── client.js
│               ├── page.js # You can build a page with a js function too.
│               └── style.css
├── html-page
│        ├── client.js
│        ├── page.html # Raw html pages are also supported
│        ├── page.vars.js # pages can define page variables in a page.vars.js. Markdown also supports frontmatter vars
│        └── style.css
├── md-page
│        ├── README.md
│        ├── client.js
│        ├── loose-md-page.md # loose markdown get built in place, but lacks some page features.
│        └── style.css
├── feeds
│        └── feeds.template.js # Templates let you generate any file you want from variables and page data
├── layouts # layouts can live anywhere. The inner content of your page is slotted into your layout
│        ├── blog.layout.js # pages specify which layout they want by setting a layout page variable
│        ├── blog.layout.css # layouts can define an additional layout style
│        ├── blog.layout.client.js # layouts can also define a layout client
│        ├── article.layout.js # layouts can extend other layouts, since they are just functions.
│        └── root.layout.js # the defult layout is called root
├── global.client.js # you can define a global js client that loads on every page.
├── global.css # you can define a global css file
├── global.vars.js # site wide variables get defined in global.vars.js
├── README.md # This is just a top level page built from a README.md file
├── client.js # the top level page can define a page scoped js client
├── style.js # the top level page can define a page scoped Css style
└── favicon-16x16.png # static assets can live anywhere. Anything other than JS, CSS and HTML get copied over automatically
```

A folder of markdown, html and js documents in the `src` directory gets transformed into html documents in the `dest` directory, along with page scoped js and css bundles, as well as a global stylesheet and global js bundle.

### Global Assets

There are a few important (and optional) global assets that live at the root of the `src` directory:

#### `root.layout.js`

The root layout is a js file that `export default` an async function that implements an outer-wrapper html of the inner content from the page (`children`) being rendered.

It is always passed the following variables:

- `vars`: An object of global and page variables merged together.
- `scripts`: array of paths that should be included onto the page in a script tag src with type `module`.
- `styles`: array of paths that should be included onto the page in a `link rel="stylesheet"` tag with the href pointing to the paths in the array.
- `children`: A string of the inner content of the page, or whatever type your js page functions returns.
- `pages`: An array of page data that you can use to generate index pages with.

The default `root.layout.js` is featured below, and is implemented with [`uhtml`][uhtml], though it could just be done with a template literal.

Variables are primarily consumed in the page layout, and you can implement many features with this simple concept.

`root.layout.js` can live anywhere.

```js
import { html, render } from 'uhtml-isomorphic'

export default function defaultRootLayout ({
  vars: {
    title,
    siteName = 'Siteup',
    defaultStyle = true
  },
  scripts,
  styles,
  children
  /* pages */
}) {
  return render(String, html`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title ? `${title}` : ''}${title && siteName ? ' | ' : ''}${siteName}</title>
      <meta name="viewport" content="width=device-width, user-scalable=no" />
      ${scripts
        ? scripts.map(script => html`<script type='module' src="${script}"></script>`)
        : null}
      ${styles
        ? styles.map(style => html`<link rel="stylesheet" href=${style} />`)
        : null}
      ${defaultStyle
        ? html`
            <link rel="stylesheet" href="https://unpkg.com/mine.css/dist/mine.css" />
            <link rel="stylesheet" href="https://unpkg.com/mine.css/dist/layout.css" />
            <link rel="stylesheet" href="https://unpkg.com/highlight.js/styles/github-dark-dimmed.css" />
            <script type="module">
              import { toggleTheme } from 'https://unpkg.com/mine.css?module';
              window.toggleTheme = toggleTheme
            </script>
            `
        : null}
    </head>
    <body class="safe-area-inset">
      <main class="mine-layout">
        ${typeof children === 'string' ? html([children]) : children /* Support both uhtml and string children. Optional. */}
      </main>
    </body>
    </html>
`)
}
```

#### `global.vars.js`

The `global.vars.js` file should `export default` a variables object or a (sync or async) function that returns a variable object.
The variables in this file are available to all pages, unless the page sets a variable with the same key, taking a higher precedence.

#### `global.client.js`

This is a script bundle that is included on every page. It provides an easy way to inject analytics, or other small scripts that every page should have. Try to minimize what you put in here.

#### `global.css`

This is a global stylesheet that every page will use.
Any styles that need to be on every single page should live here.

### Pages

Pages are a named folder inside of `src`, with one of the following page files inside of it.

- `md` pages are commonmark markdown pages.
- `html` pages are static, inner-html fragments that get inserted as-is into the page layout.
- `js` pages are a js file that exports an async function that resolves into an inner-html fragment that is inherited into the page layout. It is the only page that can access variables during rendering.

#### `md` pages

A `md` page looks like this:

```
src/page-name/README.md

or

src/page-name/loose-md.md
```

- `md` pages have two types: a `README.md` in a folder, or a loose `whatever-name-you-want.md` file.
- `md` pages can have yaml frontmatter, with variables that are accessible to the page layout when building.
- Frontmatter variables have higher precedence over `page.vars.js` or `global.vars.js`variables.
- You can include html in markdown files, so long as you adhere to the allowable markdown syntax around html tags.

#### `html` pages

A `html` page looks like this:

```
src/page-name/page.html
```

- `html` pages are named `page.html` inside an associated page folder.
- `html` pages are the simplest page type in `siteup`. They let you build with raw html for when you don't want that page to have access to markdown features. Some pages are better off with just raw `html`.

#### `js` pages

A `js` page looks like this:

```
src/page-name/page.js
```

- `js` pages are files inside a page folder called `page.js`.
- a `js` page needs to `export default` a function (async or sync) that accepts a variables argument and returns a string of the inner html of the page, or any other type that your layout can accept.
- A `js` page is the only page type that can render with page and global variables.
- A `js` page can export a `vars` object or function (async or sync) that takes highest variable precedence when rendering the page. It works similarly to markdown frontmatter variables.

### Page Files

All pages can have a `client.js` and a `style.css` file inside of their associated folder.
These are uniquely built and loaded on their associated page.
The `client.js` page bundles are bundle split with every other client side js entry-point.
The `style.css` page is not de-duplicated or split with other style files.

Each page can also have a `page.vars.js` file that exports a `default` function that contains page specific variables.

Pages can define which layout they are built with by defining a `layout` page variable and referencing one of the defined layouts anywhere in the `src` tree.

### Static assets

All static assets in the `src` directory are copied 1:1 to the `public` directory.

## Implementation

`siteup` bundles the best tools for every technology in the stack:

- `js` and `css` is bundled with [`esbuild`](https://github.com/evanw/esbuild).
- `md` is processed with [markdown-it](https://github.com/markdown-it/markdown-it).
- static files are processed with [cpx2](https://github.com/bcomnes/cpx2).

These tools are treated as implementation details, but they may be exposed more in the future. The idea is that they can be swapped out for better tools in the future if they don't make it. 

## Roadmap

`siteup` works and has a rudimentary watch command, but hasn't been battle tested yet.
If you end up trying it out, please open any issues or ideas that you have, and feel free to share what you build.

Some noteable features are included below, see the [roadmap](https://github.com/users/bcomnes/projects/3/) for a more in depth view of whats planned.

- [x] `md` pages
- [x] `js` pages
- [x] `html` pages
- [x] `client.js` page bundles
- [x] `style.css` page stylesheets
- [x] `page.vars.js` page variables
- [x] `loose-markdown-pages.md`
- [x] Static asset copying.
- [x] CLI build command
- [x] CLI watch command
- [x] Ignore globbing
- [x] Nested site dest
- [x] Default layouts/styles with 0 config starting point
- [x] More examples and ideas.
- [x] Hardened error handling w/ tests
- [x] Multiple layout files
- [x] Nested layout files
- [x] Layout styles
- [x] Layout scripts
- [x] Template files
- [x] Page data available to pages, layouts and template files.
- ...[See roadmap](https://github.com/users/bcomnes/projects/3/)

## License

MIT

[uhtml]: https://github.com/WebReflection/uhtml
[neocities-img]: https://img.shields.io/website/https/siteup.neocities.org?label=neocities&logo=data:image/png;base64,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
