# top-bun
[![npm version](https://img.shields.io/npm/v/top-bun.svg)](https://npmjs.org/package/top-bun)
[![Actions Status](https://github.com/bcomnes/top-bun/workflows/tests/badge.svg)](https://github.com/bcomnes/top-bun/actions)
[![Coverage Status](https://coveralls.io/repos/github/bcomnes/top-bun/badge.svg?branch=master)](https://coveralls.io/github/bcomnes/top-bun?branch=master)
[![Types in JS](https://img.shields.io/badge/types_in_js-yes-brightgreen)](https://github.com/voxpelli/types-in-js)
[![Neocities][neocities-img]](https://top-bun.neocities.org)

`top-bun`: a traditional web bakery made with html, md, css and js.

<small>(A bakery themed static site generator that's as fun as making bread.)</small>

```console
npm install top-bun
```

## Usage

``` console
$ top-bun --help
Usage: top-bun [options]

    Example: top-bun --src website --dest public

    --src, -s             path to source directory (default: "src")
    --dest, -d            path to build destination directory (default: "public")
    --ignore, -i          comma separated gitignore style ignore string
    --watch, -w           build, watch and serve the site build
    --watch-only          watch and build the src directory without serving
    --help, -h            show help
    --version, -v         show version information
top-bun (v7.0.0)
```

`top-bun` builds a `src` directory into a `dest` directory (default: `public`). `top-bun` is also aliased to a `tb` bin.

- Running `top-bun` will result in a `build` by default.
- Running `top-bun --watch` will build the site and start an auto-reloading development web-server that watches for changes.

`top-bun` is primarily a unix `bin` written for the Node.js runtime that is intended to be installed from `npm` as a `devDependency` inside a `package.json` is committed to of a `git` repository. It can be used outside of this context, but it works best within it so your website can easily incorporate anything on the `npm` registry.

## Concepts

`top-bun` builds a website from "pages" in a `src` directory, 1:1 into a `dest` directory.
A `src` directory tree might look something like this:

```bash
src % tree
.
├── md-page
│        ├── README.md # directories with README.md in them turn into /md-page/index.html.
│        ├── client.js # Every page can define its own client.js script that loads only with it.
│        ├── style.css # Every page can define its own style.css style that loads only with it.
│        ├── loose-md-page.md # loose markdown get built in place, but lacks some page features.
│        └── nested-page # pages are built in place and can nest.
│               ├── README.md # This page is accessed at /md-page/nested-page/.
│               ├── client.js # nested pages are just pages, so they also can have a page scoped client and style.
│               └── style.css
├── html-page
│        ├── client.js
│        ├── page.html # Raw html pages are also supported. They support handlebars template blocks.
│        ├── page.vars.js # pages can define page variables in a page.vars.js.
│        └── style.css
├── feeds
│        └── feeds.template.js # Templates let you generate any file you want from variables and page data.
├── layouts # layouts can live anywhere. The inner content of your page is slotted into your layout.
│        ├── blog.layout.js # pages specify which layout they want by setting a `layout` page variable.
│        ├── blog.layout.css # layouts can define an additional layout style.
│        ├── blog.layout.client.js # layouts can also define a layout client.
│        ├── article.layout.js # layouts can extend other layouts, since they are just functions.
│        └── root.layout.js # the defult layout is called root.
├── globals # global assets can live anywhere. Here they are in a folder called globals.
│        ├── global.client.js # you can define a global js client that loads on every page.
│        ├── global.css # you can define a global css file that loads on every page.
│        └── global.vars.js # site wide variables get defined in global.vars.js.
├── README.md # This is just a top level page built from a README.md file.
├── client.js # the top level page can define a page scoped js client.
├── style.js # the top level page can define a page scoped Css style.
└── favicon-16x16.png # static assets can live anywhere. Anything other than JS, CSS and HTML get copied over automatically.
```

The core idea of `top-bun` is that a `src` directory of markdown, html and js documents will be transformed into html documents in the `dest` directory, along with page scoped js and css bundles, as well as a global stylesheet and global js bundle.

It ships with sane defaults, so that you can point `top-bun` at a standard markdown documented repository and have it build a website with near zero preparation.

### Pages

Pages are a named directories inside of `src`, with **one of** the following page files inside of it.

- `md` pages are [CommonMark](https://commonmark.org) markdown pages, with an optional yaml front-matter block.
- `html` pages are an inner [html](https://developer.mozilla.org/en-US/docs/Web/HTML) fragment that get inserted as-is into the page layout.
- `js` pages are a [js](https://developer.mozilla.org/en-US/docs/Web/JavaScript) file that exports an async function that resolves into an inner-html fragment that is inserted into the page layout.

Variables are available in all pages. `md` and `html` pages support variable access via [handlebars][hb] template blocks. `js` pages receive variables as part of the argument passed to them. See the [Variables](#Variables) section for more info.

A special variable called `layout` determines which layout the page is rendered into.

Because pages are just directories, they nest and structure naturally. Directories in the `src` folder that lack one of these special page files can exist along side page directories and can be used to store co-located code or static assets without conflict.

#### `md` pages

A `md` page looks like this:

```
src/page-name/README.md

or

src/page-name/loose-md.md
```

- `md` pages have two types: a `README.md` in a folder, or a loose `whatever-name-you-want.md` file.
- `md` pages can have yaml frontmatter, with variables that are accessible to the page layout and handlebars template blocks when building.
- You can include html in markdown files, so long as you adhere to the allowable markdown syntax around html tags.
- `md` pages support [handlebars][hb] template placeholders.
- `md` pages support many [github flavored markdown features](https://github.com/bcomnes/siteup/blob/6481bd01e59e5d8a4bfcb33008f44a1405bf622b/lib/build-pages/page-builders/md/get-md.js#L25-L36).

An example of a `md` page:

```md
---
title: A title for my markdown
favoriteBread: 'Baguette'
---

Just writing about baking.

## Favorite breads

My favorite bread is \{{ vars.favoriteBread }}.
```

#### `html` pages

A `html` page looks like this:

```
src/page-name/page.html
```

- `html` pages are named `page.html` inside an associated page folder.
- `html` pages are the simplest page type in `top-bun`. They let you build with raw html for when you don't want that page to have access to markdown features. Some pages are better off with just raw `html`.
- `html` page variables can only be set in a `page.vars.js` file inside the page directory.
- `html` pages support [handlebars][hb] template placeholders.

An example `html` page:

```html
<h2>Favorite breads</h2>
<ul>
  <li>French</li>
  <li>Sour dough</li>
  <li>Dutch crunch</li>
  <!-- favoriteBread defined in page.vars.js -->
  <li>\{{ vars.favoriteBread }}</li>
</ul>
```

#### `js` pages

A `js` page looks like this:

```
src/page-name/page.js
```

- `js` pages consist of a named directory with a `page.js` inside of it, that exports a default function that returns the contents of the inner page.
- a `js` page needs to `export default` a function (async or sync) that accepts a variables argument and returns a string of the inner html of the page, or any other type that your layout can accept.
- A `js` page can export a `vars` object or function (async or sync) that takes highest variable precedence when rendering the page. `export vars` is similar to a `md` page's front matter.
- A `js` page receives the standard `top-bun` [Variables](#Variables) set.
- There is no built in handlebars support in `js` pages, however you are free to use any template library that you can import.
- `js` pages are run in a Node.js context only.

An example `js` page:

```js
export default async ({
  vars
}) => {
  return /* html */`<div>
    <p>This is just some html.</p>
    <p>My favorite cookie: ${vars.favoriteCookie}</p>
  </div>`
}

export const vars = {
  favoriteCookie: 'Chocolate Chip with Sea Salt'
}
```

It is it's recommended to use some level of template processing over raw string templates so that html is well formed and you default escape variable values. Here is a more realistic `js` example that uses [`uhtml`](https://github.com/WebReflection/uhtml) and [types-in-js](https://github.com/voxpelli/types-in-js) and `top-bun` page introspection.


```js
// @ts-ignore
import { html } from 'uhtml-isomorphic'
import { dirname, basename } from 'node:path'

/**
 * @template T
 * @typedef {import('top-bub').LayoutFunction<T>} LayoutFunction
 */

/**
 * @type {LayoutFunction<{
 *   favoriteCake: string
 * }>}
 */
export default async function blogIndex ({
  vars: {
    favoriteCake
  },
  pages
}) {
  const yearPages = pages.filter(page => dirname(page.pageInfo.path) === 'blog')
  return html`<div>
    <p>I love ${favoriteCake}!!</p>
    <ul>
      ${yearPages.map(yearPage => html`<li><a href="${`/${yearPage.pageInfo.path}/`}">${basename(yearPage.pageInfo.path)}</a></li>`)}
    </ul>
  </div>`
}

export const vars = {
  favoriteCake: 'Chocolate Cloud Cake'
}
```

### Page Styles

You can create a `style.css` file in any page folder.
Page styles are loaded on just that one page.
You can import common use styles into a `style.css` page style to re-use common css.
You can import library css by referencing the `npm` short name of the module.

An example of a page `style.css` file:

```css
/* /some-page/style.css */
@import "../common-styles/button.css";

.some-page-class {
  color: blue;

  & .button {
    color: purple;
  }
}
```

### Page JS Bundles

You can create a `client.js` file in any page folder.
Page bundles are loaded on that one page.
You can import common code and modules from relative paths, or `npm` modules.
The `client.js` page bundles are bundle-split with every other client-side js entry-point, so importing common chunks of code are loaded in a maximally efficient way.
Page bundles are run in a browser context only.

An example of a page `client.js` file:

```js
/* /some-page/client.js */
import { funnyLibrary } from 'funny-library'
import { someHelper } from '../helpers/foo.js'

await someHelper()
await funnyLibrary()
```

### Page variable files

Each page can also have a `page.vars.js` file that exports a `default` function or object that contains page specific variables.

```js
// export an object
export default {
  my: 'vars'
}

// OR export a default function
export default () => {
  return { my: 'vars' }
}

// OR export a default async function
export default async () => {
  return { my: 'vars' }
}
```

### Layouts

Layouts are "outer page templates" that pages get rendered into.
You can define as many as you want, and they can live anywhere in the `src` directory.
Layouts are named `${layout-name}.layout.js` where '${layout-name}' becomes the name of the layout.
Layouts should have a unique name, and layouts with duplicate name will result in a build error.
At a minimum, your site requires a `root` layout (a file named `root.layout.js`), though `top-bun` ships a default `root` layout so defining one in your `src` directory is optional, though recommended.

All pages have a `layout` variable that defaults to `root`. If you set the `layout` variable to a different name, pages will build with a layout matching the name you set to that variable. e.g. If you set a page variable to `article`, then that page will build with the `article.layout.js` file. A page referencing a layout name that doesn't have a matching layout file will result in a build error.

The best way to understand layouts is to look at an example.

#### The default `root.layout.js`

A layout is a js file that `export default`'s an async or sync function that implements an outer-wrapper html template that will house the inner content from the page (`children`) being rendered. Think of the bread in a sandwich. That's a layout.

It is always passed a single object argument with the following entries:

- `vars`: An object of global, page folder, and page variables merged together. Pages can customize layouts by providing or overriding global defaults.
- `scripts`: array of paths that should be included onto the page in a script tag src with type `module`.
- `styles`: array of paths that should be included onto the page in a `link rel="stylesheet"` tag with the href pointing to the paths in the array.
- `children`: A string of the inner content of the page, or whatever type your js page functions returns. `md` and `html` page types always return strings.
- `pages`: An array of page data that you can use to generate index pages with, or any other page-introspection based content that you desire.
- `page`: An object with metadata and other facts about the current page being rendered into the template. This will also be found somewhere in the `pages` array.

The default `root.layout.js` is featured below, and is implemented with [`uhtml`][uhtml], though it could just be done with a template literal or any other template system.

`root.layout.js` can live anywhere in the `src` directory.

```js
// @ts-ignore
import { html, render } from 'uhtml-isomorphic'

/**
 * @template T extends object
 * @typedef {import('top-bun').LayoutFunction<T>} LayoutFunction
 */

/**
 * Build all of the bundles using esbuild.
 *
 * @type {LayoutFunction<{
 *   title: string,
 *   siteName: string,
 *   defaultStyle: boolean
 * }>}
 */
export default function defaultRootLayout ({
  vars: {
    title,
    siteName = 'TopBun'
    /* defaultStyle = true  Set this to false in global or page vars to disable the default style in the default layout */
  },
  scripts,
  styles,
  children
  /* pages */
  /* page */
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

If your `src` folder doesn't have a `root.layout.js` file somewhere in it, `top-bun` will use the default [`default.root.layout.js`](./lib/defaults/default.root.layout.js) file it ships. The default `root` layout includes a special boolean variable called `defaultStyle` that lets you disable a default page style (provided by [mine.css](http://github.com/bcomnes/mine.css)) that it ships with.

#### Nested layouts

Since layouts are just functions™️, they nest naturally. If you define the majority of your html page meta detritus in a `root.layout.js`, you can define additional layouts that act as child wrappers, and inherent from the `root.layout.js`.

For example, you could define a `blog.layout.js` that re-uses the `root.layout.js`:

```js
import defaultRootLayout from './root.layout.js'
// @ts-ignore
import { html } from 'uhtml-isomorphic'

/**
 * @template T extends object
 * @typedef {import('top-bun').LayoutFunction<T>} LayoutFunction
 */

/**
 * @typedef {import('./root.layout.js').SiteVars} SiteVars
 */

/** @type {LayoutFunction<SiteVars>} */
export default function blogLayout (layoutVars) {
  const { children: innerChildren, ...rest } = layoutVars
  const vars = layoutVars.vars

  const children = html`
    <article class="article-layout h-entry" itemscope itemtype="http://schema.org/NewsArticle">
      <header class="article-header">
        <h1 class="p-name article-title" itemprop="headline">${vars.title}</h1>
        <div class="metadata">
          <address class="author-info" itemprop="author" itemscope itemtype="http://schema.org/Person">
            ${vars.authorImgUrl
              ? html`<img height="40" width="40"  src="${vars.authorImgUrl}" alt="${vars.authorImgAlt}" class="u-photo" itemprop="image">`
              : null
            }
            ${vars.authorName && vars.authorUrl
              ? html`
                  <a href="${vars.authorUrl}" class="p-author h-card" itemprop="url">
                    <span itemprop="name">${vars.authorName}</span>
                  </a>`
              : null
            }
          </address>
          ${vars.publishDate
            ? html`
              <time class="dt-published" itemprop="datePublished" datetime="${vars.publishDate}">
                <a href="#" class="u-url">
                  ${(new Date(vars.publishDate)).toLocaleString()}
                </a>
              </time>`
            : null
          }
          ${vars.updatedDate
            ? html`<time class="dt-updated" itemprop="dateModified" datetime="${vars.updatedDate}">Updated ${(new Date(vars.updatedDate)).toLocaleString()}</time>`
            : null
          }
        </div>
      </header>

      <section class="e-content" itemprop="articleBody">
        ${typeof innerChildren === 'string'
          ? html([innerChildren])
          : innerChildren /* Support both uhtml and string children. Optional. */
        }
      </section>

      <!--
        <footer>
            <p>Footer notes or related info here...</p>
        </footer>
      -->
    </article>
  `

  const rootArgs = { ...rest, children }
  return defaultRootLayout(rootArgs)
}
```

Now the `blog.layout.js` becomes a nested layout of `root.layout.js`. No magic, just functions.

#### Layout styles

You can create a `${layout-name}.layout.css` next to any layout file.
For example, you can add a layout style to the `root.layout.js` layout by creating a file next to it called `root.layout.css`.
Layout styles are loaded on all pages that use that layout.
Layout styles work the exact same way as page styles, except they load on all pages that use that layout.
You can import library css by referencing the `npm` short name of the module containing css, as well as relative paths to other css files.

#### Layout JS Bundles

You can create a `${layout-name}.layout.client.js` next to any layout file.
For example, you can add a layout js bundle to the `root.layout.js` layout by creating a file next to it called `root.layout.client.js`.
Layout js bundles are loaded on all pages that use that layout.
Layout js bundles work the exact same way as page `client.js` files, except they load on all pages that use that layout.

#### Nested layout JS bundles and styles

If you create a nested layout that imports another layout file, **and** that imported layout has a layout style and/or layout js bundle, there is no magic that will include those layout styles and clients into the importing layout. To include those layout styles and clients into an additional layout, just import them into the additional layout client and style. For example:

```css
/* blog.layout.css  */
@import "./root.layout.css";
```

```js
/* blog.layout.client.js  */
import './root.layout.client.js'
```

These imports will include the `root.layout.js` layout assets into the `blog.layout.js` asset files.


### Global Assets

There are a few important (and optional) global assets that live anywhere in the `src` directory. If duplicate named files that match the global asset file name pattern are found, a build error will occur until the duplicate file is removed.

#### `global.vars.js`

The `global.vars.js` file should `export default` a variables object or a (sync or async) function that returns a variable object.
The variables in this file are available to all pages, unless the page sets a variable with the same key, taking a higher precedence.

```js
export default {
  siteName: 'The name of my website',
  authorName: 'Mr. Wallace'
}
```

#### `global.client.js`

This is a script bundle that is included on every page. It provides an easy way to inject analytics, or other small scripts that every page should have. Try to minimize what you put in here.

```js
console.log('I run on every page in the site!')
```

#### `global.css`

This is a global stylesheet that every page will use.
Any styles that need to be on every single page should live here.
Importing css from `npm` modules work well here.

### Static assets

All static assets in the `src` directory are copied 1:1 to the `public` directory. Any file in the `src` directory that doesn't end in `.js`, `.css`, `.html`, or `.md` is copied to the `dest` directory.

### Design constraints

- Convention over configuration. All configuration should be optional, and at most it should be minimal.
- Align with the `index.html`/`README.md` pattern.
- The HTML is the source of truth.
- Don't re-implement what the browser already provides!
  - No magic `<link>` or `<a>` tag magic.
  - Don't facilitate client side routing. The browser supports routing by default.s
  - Accept the nature of the medium. Browsers browse html documents. Don't facilitate shared state between pages.
- Library agnostic. Strings are the interchange format.
- Just a program. `js` pages and layouts are just javascript programs. This provides an escape hatch to do anything. Use any template language want, but probably just use tagged template literals.
- Steps remain orthogonal. Static file copying, css and js bundling, are mere optimizations on top of the `src` folder. The `src` folder should essentially run in the browser. Each step in a `top-bun` build should work independent of the others. This allows for maximal parallelism when building.
- Standardized entrypoints. Every page in a `top-bun` site has a natural and obvious entrypoint. There is no magic redirection to learn about.
- Pages build into `index.html` files inside of named directories. This allows for naturally colocated assets next to the page, pretty urls and full support for relative URLs.
- Markdown entrypoints are named README.md. This allows for the `src` folder to be fully navigable in GitHub and other git repo hosting providing a natural hosted CMS UI.
- Real Node.js esm from the start.
- Garbage in, garbage out. Don't over-correct bad input.

### Examples

Look at [examples](./examples/) and `top-bun` [dependents](https://github.com/bcomnes/top-bun/network/dependents) for some examples how `top-bun` can work.

## Implementation

`top-bun` bundles the best tools for every technology in the stack:

- `js` and `css` is bundled with [`esbuild`](https://github.com/evanw/esbuild).
- `md` is processed with [markdown-it](https://github.com/markdown-it/markdown-it).
- static files are processed with [cpx2](https://github.com/bcomnes/cpx2).

These tools are treated as implementation details, but they may be exposed more in the future. The idea is that they can be swapped out for better tools in the future if they don't make it.

## Roadmap

`top-bun` works and has a rudimentary watch command, but hasn't been battle tested yet.
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
- [x] Nested site dest (`src` = `.`, `dest` = `public`)
- [x] Default layouts/styles with 0 config starting point
- [x] More examples and ideas.
- [x] Hardened error handling w/ tests
- [x] Multiple layout files
- [x] Nested layout files
- [x] Layout styles
- [x] Layout scripts
- [x] Template files
- [x] Page data available to pages, layouts and template files.
- [x] Handlebars template support in `md` and `html`
- ...[See roadmap](https://github.com/users/bcomnes/projects/3/)

## History

`top-bun` used to be called `siteup` which is sort of like "markup", which is related to "markdown", which inspired the project [`sitedown`](https://ghub.io/sitedown) to which `top-bun` is a spiritual offshot of. Put a folder of web documents in your `top-bun` oven, and bake a website.

## Links

- [CHANGELOG](CHANGELOG.md)
- [CONTRIBUTING](CONTRIBUTING.md)
- [Dependencies](dependencygraph.svg)

## License

[MIT](LICENSE)

[uhtml]: https://github.com/WebReflection/uhtml
[hb]: https://handlebarsjs.com
[neocities-img]: https://img.shields.io/website/https/top-bun.neocities.org?label=neocities&logo=data:image/png;base64,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
