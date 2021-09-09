# @siteup/cli
[![Actions Status](https://github.com/bcomnes/siteup-cli/workflows/tests/badge.svg)](https://github.com/bcomnes/siteup-cli/actions)

`siteup` builds websites with html, md, css and javascript.

Still a WIP, but you can look at [test-project](./test-project/) and `siteup` dependents for some examples how `siteup` can work.


`siteup`, which is sort of like "markup", which is related to "markdown", which inspired the project [`sitedown`](https://ghub.io/sitedown) which is the spiritual successor to this tool. Point `siteup` at a folder of page documents, and get a website.

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
    --watch, -w           build and watch the src folder for additional changes
    --help, -h            show help
    --version, -v         show version information
siteup (v0.0.11)
```

`siteup` builds a `src` directory into a `dest` directory (default: `public`).

## Concepts

Siteup builds a website from "pages" in a `src` directory, 1:1 into a `dest` directory.
A `src` directory tree might look something like this:

```
src % tree
.
├── a-page
│        ├── README.md
│        ├── client.js
│        ├── libs
│        │      └── a-lib.js
│        ├── nested-page
│        │      ├── client.js
│        │      ├── page.js
│        │      └── style.css
│        ├── page.js
│        └── style.css
├── client.js
├── conflict-page
│        ├── README.md
│        ├── page.html
│        └── page.js
├── favicon-16x16.png
├── global.client.js
├── global.css
├── global.vars.js
├── html-page
│        ├── client.js
│        ├── page.html
│        ├── page.vars.js
│        └── style.css
├── md-page
│        ├── README.md
│        ├── client.js
│        ├── loose-md-page.md
│        └── style.css
├── md-two
│        └── README.md
├── nav.js
├── page.js
├── root.layout.js
├── some-css.css
└── style.css

7 directories, 30 files
```

The above src directory would transform into something like this in the `dest` dir:

```
.
├── a-page
│        ├── client.js
│        ├── client.js.map
│        ├── index.html
│        ├── nested-page
│        │             ├── client.js
│        │             ├── client.js.map
│        │             ├── index.html
│        │             └── style.css
│        └── style.css
├── chunk-HC4Q5QIB.js
├── chunk-HC4Q5QIB.js.map
├── chunk-WZ7JV6GS.js
├── chunk-WZ7JV6GS.js.map
├── client.js
├── client.js.map
├── favicon-16x16.png
├── global.client.js
├── global.client.js.map
├── global.css
├── global.css.map
├── html-page
│           ├── client.js
│           ├── client.js.map
│           ├── index.html
│           └── style.css
├── index.html
├── md-page
│          ├── client.js
│          ├── client.js.map
│          ├── index.html
│          ├── loose-md-page.html
│          └── style.css
├── md-two
│        └── index.html
└── style.css
```

A folder of markdown, html and js documents in the `src` directory gets transformed into html documents in the `dest` directory, along with page scoped javascript and css bundles, as well as a global stylesheet and global js bundle.

### Global Assets

There are a few important (and optional) global assets that live at the root of the `src` directory:

#### `root.layout.js`

The root layout is a js file that `export default` an async function that implements an outer-wrapper html of the inner content from the page (`children`) being rendered.

It is always passed the following variables:

- `scripts`: array of paths that should be included onto the page in a script tag src with type `module`.
- `styles`: array of paths that should be included onto the page in a `link rel="stylesheet"` tag with the href pointing to the paths in the array.
- `children`: A string of the inner content of the page, or whatever type your js page functions returns.

The default `root.layout.js` is featured below, and is implemented with [`uhtml`][uhtml], though it could just be done with a template literal.

All other variables set in the page being rendered and `global.vars.js` are passed in as well.
Variables are primarily consumed in the page layout, and you can implement many features with this simple concept.

```js
import { html, render } from 'uhtml-isomorphic'

export default async function RootLayout ({
  title,
  siteName,
  scripts,
  styles,
  children
}) {
  return render(String, html`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${siteName}${title ? ` | ${title}` : ''}</title>
      <meta name="viewport" content="width=device-width, user-scalable=no" />
      ${scripts
        ? scripts.map(script => html`<script src="${script}" type='module'></script>`)
        : null}
      ${styles
        ? styles.map(style => html`<link rel="stylesheet" href=${style} />`)
        : null}
    </head>
    <body>
      ${typeof children === 'string' ? html([children]) : children /* Support both uhtml and string children. Optional. */}
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
The `client.js` page bundles are bundle split with every other client side javascript entry-point.
The `style.css` page is not de-duplicated or split with other style files.

Each page can also have a `page.vars.js` file that exports a `default` function that contains page specific variables.

### Static assets

All static assets in the `src` directory are copied 1:1 to the `public` directory.

## Implementation

`siteup` bundles the best tools for every technology in the stack:

- `js` is bundled with [`esbuild`](https://github.com/evanw/esbuild).
- `css` is processed with [`postcss`](https://github.com/postcss/postcss).
- `md` is processed with [markdown-it](https://github.com/markdown-it/markdown-it).
- static files are processed with [cpx2](https://github.com/bcomnes/cpx2).

These tools are treated as implementation details, but they may be exposed more in the future. The idea is that they can be swapped out for better tools in the future if they don't make it. 

## Roadmap

`siteup` works and has a rudimentary watch command, but hasn't been battle tested yet.
If you end up trying it out, please open any issues or ideas that you have, and feel free to share what you build. 

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
- [ ] More robust error handling
- [ ] More efficient watch rebuilding
- [ ] Pluggable page types
- [ ] Better build and watch output (progress)
- [ ] Ignore globbing
- [ ] Website built with `siteup`
- [ ] More examples and ideas.
- [ ] Page variable introspection (show the merge cascade)
- [ ] Page introspection (list pages discovered)
- [ ] Build stats

## License

MIT
