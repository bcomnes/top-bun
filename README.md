# 🪢 DOMStack
[![npm version](https://img.shields.io/npm/v/@domstack/cli.svg)](https://npmjs.org/package/@domstack/cli)
[![Actions Status](https://github.com/bcomnes/domstack/workflows/tests/badge.svg)](https://github.com/bcomnes/domstack/actions)
[![Coverage Status](https://coveralls.io/repos/github/bcomnes/domstack/badge.svg?branch=master)](https://coveralls.io/github/bcomnes/domstack?branch=master)
[![Types in JS](https://img.shields.io/badge/types_in_js-yes-brightgreen)](https://github.com/voxpelli/types-in-js)
[![Neocities][neocities-img]](https://domstack.net)

`domstack`: Cut the [gordian knot](https://en.wikipedia.org/wiki/Gordian_Knot) of modern web development and build websites with a stack of html, md, css, js, ts, jsx. DOMStack provides a few project based conventions around esbuild ande Node.js that lets you quickly, cleanly and easily build websites and web apps using all of your favorite technolgies without any framework specific impurities. It's also extreemly fast.

```console
npm install @domstack/cli
```

- 🌎 [domstack docs website](https://domstack.net)
- 💬 [Discord Chat](https://discord.gg/AVTsPRGeR9)
- 📢 [v11 - top-bun is now domstack](https://bret.io/blog/2023/top-bun-is-now-domstack/)
- 📢 [v7 Announcement](https://bret.io/blog/2023/reintroducing-top-bun/)
- 📘 [Full TypeScript Support](#typescript-support)

## Table of Contents

[[toc]]

## Usage

```console
$ domstack --help
Usage: domstack [options]

    Example: domstack --src website --dest public

    --src, -s             path to source directory (default: "src")
    --dest, -d            path to build destination directory (default: "public")
    --ignore, -i          comma separated gitignore style ignore string
    --drafts              Build draft pages with the `.draft.{md,js,html}` page suffix.
    --target, -t          comma separated target strings for esbuild
    --noEsbuildMeta       skip writing the esbuild metafile to disk
    --eject, -e           eject the DOMStack default layout, style and client into the src flag directory
    --watch, -w           build, watch and serve the site build
    --watch-only          watch and build the src folder without serving
    --copy                path to directories to copy into dist; can be used multiple times
    --help, -h            show help
    --version, -v         show version information
domstack (v11.0.0)
```

`domstack` builds a `src` directory into a `dest` directory (default: `public`).
`domstack` is also aliased to a `tb` bin.

- Running `domstack` will result in a `build` by default.
- Running `domstack --watch` or `domstack -w` will build the site and start an auto-reloading development web-server that watches for changes.
- Running `domstack --eject` or `domstack -e` will extract the default layout, global styles, and client-side JavaScript into your source directory and add the necessary dependencies to your package.json.

`domstack` is primarily a unix `bin` written for the [Node.js](https://nodejs.org) runtime that is intended to be installed from `npm` as a `devDependency` inside a `package.json` committed to a `git` repository.
It can be used outside of this context, but it works best within it.

## Core Concepts

`domstack` builds a website from "pages" in a `src` directory, nearly 1:1 into a `dest` directory.
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
│        ├── client.jsx # client bundles can also be written in .jsx/.tsx
│        ├── page.html # Raw html pages are also supported. They support handlebars template blocks.
│        ├── page.vars.js # pages can define page variables in a page.vars.js.
│        └── style.css
├── js-page
│        └── page.js # A page can also just be a plain javascript function that returns content
├── ts-page
│        ├── client.ts # client bundles can be written in typescript via type stripping
│        ├── page.vars.ts # pages can define page variables in a page.vars.js.
│        └── page.ts # Anywhere you can use js in domstack, you can also use typescript files. They compile via speedy type stripping.
├── feeds
│        └── feeds.template.js # Templates let you generate any file you want from variables and page data.
├── workers
│        ├── client.ts
│        └── page.ts
│        ├── counter.worker.js # Web workers use a .worker.js naming convention and are auto-bundled
│        └── analytics.worker.js
├── layouts # layouts can live anywhere. The inner content of your page is slotted into your layout.
│        ├── blog.layout.js # pages specify which layout they want by setting a `layout` page variable.
│        ├── blog.layout.css # layouts can define an additional layout style.
│        ├── blog.layout.client.js # layouts can also define a layout client.
│        ├── article.layout.js # layouts can extend other layouts, since they are just functions.
│        ├── typescript.layout.ts # layouts can also be written in typescript
│        └── root.layout.js # the default layout is called root.
├── globals # global assets can live anywhere. Here they are in a folder called globals.
│        ├── global.client.js # you can define a global js client that loads on every page.
│        ├── global.css # you can define a global css file that loads on every page.
│        ├── global.vars.js # site wide variables get defined in global.vars.js.
│        └── esbuild.settings.js # You can even customize the build settings passed to esbuild!
├── README.md # This is just a top level page built from a README.md file.
├── client.js # the top level page can define a page scoped js client.
├── style.js # the top level page can define a page scoped css style.
└── favicon-16x16.png # static assets can live anywhere. Anything other than JS, CSS and HTML get copied over automatically.
```

The core idea of `domstack` is that a `src` directory of markdown, html and js "inner" documents will be transformed into layout wrapped html documents in the `dest` directory, along with page scoped js and css bundles, as well as a global stylesheet and global js bundle.

It ships with sane defaults so that you can point `domstack` at a standard [markdown documented repository](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github) and have it build a website with near-zero preparation.

## Examples

A collection of examples can be found in the [`./examples`](./examples) folder.

To run examples:

```console
$ git clone git@github.com:bcomnes/domstack.git
$ cd domstack
$ npm i
$ npm run example:{example-name}
$ npm i
$ npm start
```

### Additional examples

Here are some additional external examples of larger domstack projects.
If you have a project that uses domstack and could act as a nice example, please PR it to the list!

- [Blog Example](https://github.com/bcomnes/bret.io/)
- [Isomorphic Static/Client App](https://github.com/hifiwi-fi/example-app/tree/master/packages/web/client)
- [Zero-Conf Markdown Docs](https://github.com/bcomnes/deploy-to-neocities/blob/70b264bcb37fca5b21e45d6cba9265f97f6bfa6f/package.json#L38)
- [Web Workers Example](https://github.com/domstack/domstack/tree/master/examples/worker-example)

## Pages

Pages are a named directories inside of `src`, with **one of** the following page files inside of it.

- `md` pages are [CommonMark](https://commonmark.org) markdown pages, with an optional [YAML](https://yaml.org) front-matter block.
- `html` pages are an inner [html](https://developer.mozilla.org/en-US/docs/Web/HTML) fragment that get inserted into the page layout.
- `js` pages are a [js](https://developer.mozilla.org/en-US/docs/Web/JavaScript) file that exports a default function that resolves into an inner-html fragment that is inserted into the page layout.

Variables are available in all pages. `md` and `html` pages support variable access via [handlebars][hb] template blocks. `js` pages receive variables as part of the argument passed to them. See the [Variables](#variables) section for more info.

A special variable called `layout` determines which layout the page is rendered into.

Because pages are just directories, they nest and structure naturally. Directories in the `src` folder that lack one of these special page files can exist along side page directories and can be used to store co-located code or static assets without conflict.

### `md` pages

A `md` page looks like this:

```bash
src/page-name/README.md
# or
src/page-name/loose-md.md
```

- `md` pages have two types: a `README.md` in a folder, or a loose `whatever-name-you-want.md` file.
- `README.md` files transform to an `index.html` at the same path, and `whatever-name-you-want.md` loose markdown files transform into `whatever-name-you-want.html` files at the same path in the `dest` directory.
- `md` pages can have YAML frontmatter, with variables that are accessible to the page layout and handlebars template blocks when building.
- You can include html in markdown files, so long as you adhere to the allowable markdown syntax around html tags.
- `md` pages support [handlebars][hb] template placeholders.
- You can disable `md` page [handlebars][hb] processing by setting the `handlebars` variable to `false`.
- `md` pages support many [github flavored markdown features](https://github.com/bcomnes/siteup/blob/6481bd01e59e5d8a4bfcb33008f44a1405bf622b/lib/build-pages/page-builders/md/get-md.js#L25-L36).

An example of a `md` page:

```md
---
title: A title for my markdown
favoriteColor: 'Blue'
---

Just writing about web development.

## Favorite colors

My favorite color is \{{ vars.favoriteColor }}.
```

### `html` pages

A `html` page looks like this:

```bash
src/page-name/page.html
```

- `html` pages are named `page.html` inside an associated page folder.
- `html` pages are the simplest page type in `domstack`. They let you build with raw html for when you don't want that page to have access to markdown features. Some pages are better off with just raw `html`.
- `html` page variables can only be set in a `page.vars.js` file inside the page directory.
- `html` pages support [handlebars][hb] template placeholders.
- You can disable `html` page [handlebars][hb] processing by setting the `handlebars` variable to `false`.

An example `html` page:

```html
<h2>Favorite frameworks</h2>
<ul>
  <li>React</li>
  <li>Vue</li>
  <li>Svelte</li>
  <!-- favoriteFramework defined in page.vars.js -->
  <li>\{{ vars.favoriteFramework }}</li>
</ul>
```

### `js` pages

A `js` page looks like this:

```bash
src/page-name/page.js
```

- `js` pages consist of a named directory with a `page.js` inside of it, that exports a default function that returns the contents of the inner page.
- a `js` page needs to `export default` a function (async or sync) that accepts a variables argument and returns a string of the inner html of the page, or any other type that your layout can accept.
- A `js` page can export a `vars` object or function (async or sync) that takes highest variable precedence when rendering the page. `export vars` is similar to a `md` page's front matter.
- A `js` page receives the standard `domstack` [Variables](#variables) set.
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

It is it's recommended to use some level of template processing over raw string templates so that html is well formed and you default escape variable values. Here is a more realistic `js` example that uses [`uhtml`](https://github.com/WebReflection/uhtml) and [types-in-js](https://github.com/voxpelli/types-in-js) and `domstack` page introspection.


```js
// @ts-ignore
import { html } from 'uhtml-isomorphic'
import { dirname, basename } from 'node:path'

/**
 * @template T
 * @typedef {import('domstack').LayoutFunction<T>} LayoutFunction
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
You can import common use styles into a `style.css` page style using css [`@import`](https://developer.mozilla.org/en-US/docs/Web/CSS/@import) statements to re-use common css.
You can `@import` paths to other css files, or out of `npm` modules you have installed in your projects `node_modues` folder.
`css` page bundles are bundled using [`esbuild`][esbuild].

An example of a page `style.css` file:

```css
/* /some-page/style.css */
@import "some-npm-module/style.css";
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
Page bundles are client side JS bundles that are loaded on that one page only.
You can import common code and modules from relative paths, or `npm` modules.
The `client.js` page bundles are bundle-split with every other client-side js entry-point, so importing common chunks of code are loaded in a maximally efficient way.
Page bundles are run in a browser context only, however they can share carefully crafted code that also runs in a Node.js or layout context.
`js` page bundles are bundled using [`esbuild`][esbuild].

An example of a page `client.js` file:

```js
/* /some-page/client.js */
import { funnyLibrary } from 'funny-library'
import { someHelper } from '../helpers/foo.js'

await someHelper()
await funnyLibrary()
```

#### .tsx/.jsx

Client bundles support .jsx and .tsx. They default to preact, so if you want mainlain recat, customize your esbuild settings to load that instead.

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

Page variable files have higher precedent than `global.vars.js` variables, but lower precedent than frontmatter or `vars` page exports.

### Draft pages

If you add a `.draft.{md,html,js}` to any of the page types, the page is considered a draft page.
Draft pages are not built by default.
If you pass the `--drafts` flag when building or watching, the draft pages will be built.
When draft pages are omitted, they are completely ignored.

Draft pages can be detected in layouts using the `page.draft === true` or `pages[n].draft === true` variable.
It is a good idea to display something indicating the page is a draft in your templates so you don't get confused when working with the `--drafts` flag.

Any static assets near draft pages will still be copied because static assets are processed in parallel from page generation (to keep things fast).
If you have an idea on how to relate static assets to a draft page for omission, please open a discussion issue.

## Web Workers

DOMStack supports web workers through a simple naming convention. Any file with the pattern `{name}.worker.js` is recognized as a web worker and automatically bundled by esbuild.

Web workers can be added to any page in your DOMStack project:

```
page-directory/
  ├── page.js
  ├── client.js
  ├── counter.worker.js  # Worker with counter functionality
  └── data.worker.js     # Worker for data processing
```

During the build process, DOMStack:

1. Bundles each worker file separately with proper cache-busting (hashed filenames)
2. Generates a `workers.json` file in each page directory that has workers
3. Maps the worker names directly to their hashed filenames in a flat structure

To use web workers in your client code:

```js
// First, fetch the workers.json to get worker paths
async function initializeWorkers() {
  const response = await fetch('./workers.json');
  const workersData = await response.json();

  // Initialize workers with the correct hashed filenames
  const counterWorker = new Worker(
    new URL(`./${workersData.counter}`, import.meta.url),
    { type: 'module' }
  );

  // Use the worker
  counterWorker.postMessage({ action: 'increment' });

  counterWorker.onmessage = (e) => {
    console.log(e.data);
  };

  return counterWorker;
}

// Initialize workers when the page loads
document.addEventListener('DOMContentLoaded', async () => {
  const worker = await initializeWorkers();
  // Use the worker in your page...
});
```

See the [Web Workers Example](https://github.com/domstack/domstack/tree/master/examples/worker-example) for a complete implementation.

## Layouts

Layouts are "outer page templates" that pages get rendered into.
You can define as many as you want, and they can live anywhere in the `src` directory.

Layouts are named `${layout-name}.layout.js` where `${layout-name}` becomes the name of the layout.
Layouts should have a unique name, and layouts with duplicate name will result in a build error.

Example layout file names:

```bash
src/layouts/root.layout.js # this layout is references as 'root'
src/other-layouts/article.layout.js # this layout is references as 'article'
```

At a minimum, your site requires a `root` layout (a file named `root.layout.js`), though `domstack` ships a default `root` layout so defining one in your `src` directory is optional, though recommended.

All pages have a `layout` variable that defaults to `root`. If you set the `layout` variable to a different name, pages will build with a layout matching the name you set to that variable.

The following markdown page would be rendered using the `article` layout.

```md
---
layout: 'article'
title: 'My Article Title'
---

Thanks for reading my article
```

A page referencing a layout name that doesn't have a matching layout file will result in a build error.

### The default `root.layout.js`

A layout is a js file that `export default`'s an async or sync function that implements an outer-wrapper html template that will house the inner content from the page (`children`) being rendered. Think of the frame around a picture. That's a layout. 🖼️

It is always passed a single object argument with the following entries:

- `vars`: An object of global, page folder, and page variables merged together. Pages can customize layouts by providing or overriding global defaults.
- `scripts`: array of paths that should be included onto the page in a script tag src with type `module`.
- `styles`: array of paths that should be included onto the page in a `link rel="stylesheet"` tag with the `href` pointing to the paths in the array.
- `children`: A string of the inner content of the page, or whatever type your js page functions returns. `md` and `html` page types always return strings.
- `pages`: An array of page data that you can use to generate index pages with, or any other page-introspection based content that you desire.
- `page`: An object with metadata and other facts about the current page being rendered into the template. This will also be found somewhere in the `pages` array.

The default `root.layout.js` is featured below, and is implemented with [`uhtml`][uhtml], though it could just be done with a template literal or any other template system.

`root.layout.js` can live anywhere in the `src` directory.

```js
// @ts-ignore
import { html, render } from 'uhtml-isomorphic'

/**
 * @template {Record<string, any>} T
 * @typedef {import('domstack').LayoutFunction<T>} LayoutFunction
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
    siteName = 'Domstack'
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

If your `src` folder doesn't have a `root.layout.js` file somewhere in it, `domstack` will use the default [`default.root.layout.js`](./lib/defaults/default.root.layout.js) file it ships. The default `root` layout includes a special boolean variable called `defaultStyle` that lets you disable a default page style (provided by [mine.css](http://github.com/bcomnes/mine.css)) that it ships with.

### Nested layouts

Since layouts are just functions™️, they nest naturally. If you define the majority of your html page meta detritus in a `root.layout.js`, you can define additional layouts that act as child wrappers, without having to re-define everything in `root.layout.js`.

For example, you could define a `blog.layout.js` that re-uses the `root.layout.js`:

```js
import defaultRootLayout from './root.layout.js'
// @ts-ignore
import { html } from 'uhtml-isomorphic'

/**
 * @template {Record<string, any>} T
 * @typedef {import('domstack').LayoutFunction<T>} LayoutFunction
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

Alternatively, you could compose your layouts from re-usable template functions and strings. If you find your layouts nesting more than one or two levels, perhaps composition would be a better strategy.

### Layout styles

You can create a `${layout-name}.layout.css` next to any layout file.

```css
/* /layouts/article.layout.css */
.layout-specific-class {
  color: blue;

  & .button {
    color: purple;
  }
}

/* This layout style is included in every page rendered with the 'article' layout */
```
Layout styles are loaded on all pages that use that layout.
Layout styles are bundled with [`esbuild`][esbuild] and can bundle relative and `npm` css using css `@import` statements.

### Layout JS Bundles

You can create a `${layout-name}.layout.client.js` next to any layout file.

```js
/* /layouts/article.layout.client.js */

console.log('I run on every page rendered with the \'article\' layout')

/* This layout client is included in every page rendered with the 'article' layout */
```

Layout js bundles are loaded on all pages that use that layout.
Layout js bundles are bundled with [`esbuild`][esbuild] and can bundle relative and `npm` modules using ESM `import` statements.

### Nested layout JS bundles and styles

If you create a nested layout that imports another layout file, **and** that imported layout has a layout style and/or layout js bundle, there is no magic that will include those layout styles and clients into the importing layout. To include those layout styles and clients into an additional layout, just import them into the additional layout client and style files. For example:

```css
/* article.layout.css  */
@import "./root.layout.css";
```

This will include the layout style from the `root` layout in the `article` layout style.

```js
/* article.layout.client.js  */
import './root.layout.client.js'
```

These imports will include the `root.layout.js` layout assets into the `blog.layout.js` asset files.

## Static assets

All static assets in the `src` directory are copied 1:1 to the `public` directory. Any file in the `src` directory that doesn't end in `.js`, `.css`, `.html`, or `.md` is copied to the `dest` directory.

### `--eject` flag

The `--eject` (or `-e`) flag extracts DOMStack's default layout, global CSS, and client-side JavaScript into your source directory. This allows you to fully customize these files while maintaining the same functionality.

When you run `domstack --eject`, it will:

1. Create a default root layout file at `layouts/root.layout.js` (or `.mjs` depending on your package.json type)
2. Create a default global CSS file at `globals/global.css`
3. Create a default client-side JavaScript file at `globals/global.client.js` (or `.mjs`)
4. Add the necessary dependencies to your package.json:
   - mine.css
   - uhtml-isomorphic
   - highlight.js

This is useful when you want to heavily customize the default theme or behavior while still leveraging DOMStack's core functionality.

### `--copy` directories

You can specify directories to copy into your `dest` directory using the `--copy` flag. Everything in those directories will be copied as-is into the destination, including js, css, html and markdown, preserving the internal directory structure. Conflicting files are not detected or reported and will cause undefined behavior.

Copy folders must live **outside** of the `dest` directory. Copy directories can be in the src directory allowing for nested builds. In this case they are added to the ignore glob and ignored by the rest of `domstack`.

This is useful when you have legacy or archived site content that you want to include in your site, but don't want `domstack` to process or modify it.
In general, static content should live in your primary `src` directory, however for merging in old static assets over your domstack build is sometimes easier to reason about when it's kept in a separate folder and isn't processed in any way.

For example:

```
src/...
oldsite/
├── client.js
├── hello.html
└── styles/
    └── globals.css
```

After build:

```
src/...
oldsite/...
public/
├── client.js
├── hello.html
└── styles/
    └── globals.css
```

## Templates

Template files let you write any kind of file type to the `dest` folder while customizing the contents of that file with access to the site [Variables](#variables) object, or inject any other kind of data fetched at build time. Template files can be located anywhere and look like:

```bash
name-of-template.txt.template.js

${name-portion}.template.js
```

Template files are a `js` file that default exports one of the following sync/async functions:

### Simple string template

A function that returns a string. The `name-of-template.txt` portion of the template file name becomes the file name of the output file.

```js
/**
 * @template T
 * @typedef {import('domstack').TemplateFunction<T>} TemplateFunction
 */

/**
 * @type {TemplateFunction<{
 * foo: string,
 * testVar: string
 * }>}
 */
export default async ({
  vars: {
    foo
  }
}) => {
  return `{Hello world

This is just a file with access to global vars: ${foo}
`
}
```

### Object template

A function that returns a single object with a `content` and `outputName` entries. The `outputName` overrides the name portion of the template file name.

```js
/**
 * @template T
 * @typedef {import('domstack').TemplateFunction<T>} TemplateFunction
 */

/**
 * @type {TemplateFunction<{
 * foo: string,
 * }>}
 */
export default async ({
  vars: { foo }
}) => ({
  content: `Hello world

This is just a file with access to global vars: ${foo}`,
  outputName: './single-object-override.txt'
})
```

### Object array template

A function that returns an array of objects with a `content` and `outputName` entries. This template file generates more than one file from a single template file.

```js
/**
 * @template T
 * @typedef {import('domstack').TemplateFunction<T>} TemplateFunction
 */

/**
 * @type {TemplateFunction<{
 * foo: string,
 * testVar: string
 * }>}
 */
export default async function objectArrayTemplate ({
  vars: {
    foo,
    testVar
  }
}) {
  return [
    {
      content: `Hello world

This is just a file with access to global vars: ${foo}`,
      outputName: 'object-array-1.txt'
    },
    {
      content: `Hello world again

This is just a file with access to global vars: ${testVar}`,
      outputName: 'object-array-2.txt'
    }
  ]
}
```

### AsyncIterator template

An [AsyncIterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncIterator) that `yields` objects with `content` and `outputName` entries.

```js
/**
 * @template T
 * @typedef {import('@domstack/cli').TemplateAsyncIterator<T>} TemplateAsyncIterator
 */

/** @type {TemplateAsyncIterator<{
 * foo: string,
 * testVar: string
 * }>} */
export default async function * ({
  vars: {
    foo,
    testVar
  }
}) {
  // First item
  yield {
    content: `Hello world

This is just a file with access to global vars: ${foo}`,
    outputName: 'async-iterator-1.txt'
  }

  // Second item
  yield {
    content: `Hello world again

This is just a file with access to global vars: ${testVar}`,
    outputName: 'async-iterator-2.txt'
  }
}
```

### RSS Feed Template Example

Templates receive the standard variables available to pages, so its possible to perform page introspection and generate RSS feeds of website content.

The following example shows how to generate an [RSS](https://www.rssboard.org) and [JSON feed](https://www.jsonfeed.org) of the last 10 date sorted pages with the `blog` layout using the AsyncIterator template type.

```js
import pMap from 'p-map'
// @ts-ignore
import jsonfeedToAtom from 'jsonfeed-to-atom'

/**
 * @template T
 * @typedef {import('domstack').TemplateAsyncIterator<T>} TemplateAsyncIterator
 */

/** @type {TemplateAsyncIterator<{
  *  title: string,
  *  layout: string,
  *  siteName: string,
  *  homePageUrl: string,
  *  authorName: string,
  *  authorUrl: string,
  *  authorImgUrl: string,
  *  publishDate: string,
  *  siteDescription: string
  * }>}
*/
export default async function * feedsTemplate ({
  vars: {
    siteName,
    homePageUrl,
    authorName,
    authorUrl,
    authorImgUrl,
    siteDescription
  },
  pages
}) {
  const blogPosts = pages
    // @ts-ignore
    .filter(page => page.pageInfo.path.startsWith('blog/') && page.vars['layout'] === 'blog')
    // @ts-ignore
    .sort((a, b) => new Date(b.vars.publishDate) - new Date(a.vars.publishDate))
    .slice(0, 10)

  const jsonFeed = {
    version: 'https://jsonfeed.org/version/1',
    title: siteName,
    home_page_url: homePageUrl,
    feed_url: `${homePageUrl}/feed.json`,
    description: siteDescription,
    author: {
      name: authorName,
      url: authorUrl,
      avatar: authorImgUrl
    },
    items: await pMap(blogPosts, async (page) => {
      return {
        date_published: page.vars['publishDate'],
        title: page.vars['title'],
        url: `${homePageUrl}/${page.pageInfo.path}/`,
        id: `${homePageUrl}/${page.pageInfo.path}/#${page.vars['publishDate']}`,
        content_html: await page.renderInnerPage({ pages })
      }
    }, { concurrency: 4 })
  }

  yield {
    content: JSON.stringify(jsonFeed, null, '  '),
    outputName: './feeds/feed.json'
  }

  yield {
    content: jsonfeedToAtom(jsonFeed),
    outputName: './feeds/feed.xml'
  }
}
```

## Global Assets

There are a few important (and optional) global assets that live anywhere in the `src` directory. If duplicate named files that match the global asset file name pattern are found, a build error will occur until the duplicate file is removed.

### `global.vars.js`

The `global.vars.js` file should `export default` a variables object or a (sync or async) function that returns a variable object.
The variables in this file are available to all pages, unless the page sets a variable with the same key, taking a higher precedence.

```js
export default {
  siteName: 'The name of my website',
  authorName: 'Mr. Wallace'
}
```

#### `browser` variable

`global.vars.js` can uniquely export a `browser` object. These object variables are made available in all js bundles. The `browser` export can be an object, or a sync/async function that returns an object.

```js
export const browser = {
  'process.env.TRANSPORT': transport,
  'process.env.HOST': host
}
```

The exported object is passed to esbuild's [`define`](https://esbuild.github.io/api/#define) options and is available to every js bundle.

### `global.client.js`

This is a script bundle that is included on every page. It provides an easy way to inject analytics, or other small scripts that every page should have. Try to minimize what you put in here.

```js
console.log('I run on every page in the site!')
```

### `global.css`

This is a global stylesheet that every page will use.
Any styles that need to be on every single page should live here.
Importing css from `npm` modules work well here.

### `esbuild.settings.js`

This is an optional file you can create anywhere.
It should export a default sync or async function that accepts a single argument (the esbuild settings object generated by domstack) and returns a modified build object.
Use this to customize the esbuild settings directly.
You can break domstack with this, so be careful.
Here is an example of using this file to polyfill node builtins in the browser bundle:

```js
import { polyfillNode } from 'esbuild-plugin-polyfill-node'

export default async function esbuildSettingsOverride (esbuildSettings) {
  esbuildSettings.plugins = [
    polyfillNode(),
  ]
  return esbuildSettings
}
```

### `markdown-it.settings.js`

This is an optional file you can create anywhere.
It should export a default sync or async function that accepts a single argument (the markdown-it instance configured by domstack) and returns a modified markdown-it instance.
Use this to add custom markdown-it plugins or modify the parser configuration.
Here are some examples:

```js
// Add custom plugins
import markdownItContainer from 'markdown-it-container'
import markdownItPlantuml from 'markdown-it-plantuml'

export default async function markdownItSettingsOverride (md) {
  // Add custom plugins
  md.use(markdownItContainer, 'spoiler', {
    validate: function(params) {
      return params.trim().match(/^spoiler\s+(.*)$/)
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/)
      if (tokens[idx].nesting === 1) {
        return '<details><summary>' + md.utils.escapeHtml(m[1]) + '</summary>\n'
      } else {
        return '</details>\n'
      }
    }
  })

  md.use(markdownItPlantuml)

  return md
}
```

```js
// Replace with a completely new instance
import markdownIt from 'markdown-it'

export default async function markdownItSettingsOverride (md) {
  // Create a new instance with different settings
  const newMd = markdownIt({
    html: false,        // Disable HTML tags in source
    breaks: true,       // Convert \n to <br>
    linkify: false,     // Disable auto-linking
  })

  // Add only the plugins you want
  newMd.use(myCustomPlugin)

  return newMd
}
```

By default, DOMStack ships with the following markdown-it plugins:

- ['markdown-it'](https://github.com/markdown-it/markdown-it)
- ['markdown-it-footnote'](https://github.com/markdown-it/markdown-it-footnote)
- ['markdown-it-highlightjs'](https://github.com/valeriangalliat/markdown-it-highlightjs)
- ['markdown-it-emoji'](https://github.com/markdown-it/markdown-it-emoji)
- ['markdown-it-sub'](https://github.com/markdown-it/markdown-it-sub)
- ['markdown-it-sup'](https://github.com/markdown-it/markdown-it-sup)
- ['markdown-it-deflist'](https://github.com/markdown-it/markdown-it-deflist)
- ['markdown-it-ins'](https://github.com/markdown-it/markdown-it-ins)
- ['markdown-it-mark'](https://github.com/markdown-it/markdown-it-mark)
- ['markdown-it-abbr'](https://github.com/markdown-it/markdown-it-abbr)
- ['markdown-it-task-lists'](https://github.com/revin/markdown-it-task-lists)
- ['markdown-it-anchor'](https://github.com/valeriangalliat/markdown-it-anchor)
- ['markdown-it-attrs'](https://github.com/arve0/markdown-it-attrs)
- ['markdown-it-table-of-contents'](https://github.com/cmaas/markdown-it-table-of-contents)

## Variables

Pages, Layouts, and `postVars` all receive an object with the following parameters:

- `vars`: An object with the variables of `global.vars.js`, `page.vars.js`, and any front-matter,`vars` exports and `postVars` from the page merged together.
- `pages`: An array of [`PageData`](https://github.com/bcomnes/domstack/blob/master/lib/build-pages/page-data.js) instances for every page in the site build. Use this array to introspect pages to generate feeds and index pages.
- `page`: An object of the page being rendered with the following parameters:
  - `type`: The type of page (`md`, `html`, or `js`)
  - `path`: The directory path for the page.
  - `outputName`: The output name of the final file.
  - `outputRelname`: The relative output name/path of the output file.
  - `pageFile`: Raw `src` path details of the page file
  - `pageStyle`: file info if the page has a page style
  - `clientBundle`: file info if the page has a page js bundle
  - `pageVars`: file info if the page has a page vars

Template files receive a similar set of variables:

- `vars`: An object with the variables of `global.vars.js`
- `pages`: An array of [`PageData`](https://github.com/bcomnes/domstack/blob/master/lib/build-pages/page-data.js) instances for every page in the site build. Use this array to introspect pages to generate feeds and index pages.
- `template`: An object of the template file data being rendered.

Where `T` is your set of variables in the `vars` object.

### `postVars` post processing variables (Advanced) {#postVars}

In `page.vars.js` files, you can export a `postVars` sync/async function that returns an object. This function receives the same variable set as pages and layouts. Whatever object is returned from the function is merged into the final `vars` object and is available in the page and layout. This is useful if you want to apply advanced rendering page introspection and insert it into a markdown document (for example, the last few blog posts on a markdown page.)

For example:

```js
// page.vars.js
import { html, render } from 'uhtml-isomorphic'

export async function postVars ({
  pages
}) {
  const blogPosts = pages
    .filter(page => page.vars.layout === 'article')
    .sort((a, b) => new Date(b.vars.publishDate) - new Date(a.vars.publishDate))
    .slice(0, 5)

  const blogpostsHtml = render(String, html`<ul class="blog-index-list">
      ${blogPosts.map(p => {
        const publishDate = p.vars.publishDate ? new Date(p.vars.publishDate) : null
        return html`
          <li class="blog-entry h-entry">
            <a class="blog-entry-link u-url u-uid p-name" href="/${p.pageInfo.path}/">${p.vars.title}</a>
            ${
              publishDate
                ? html`<time class="blog-entry-date dt-published" datetime="${publishDate.toISOString()}">
                    ${publishDate.toISOString().split('T')[0]}
                  </time>`
                : null
            }
          </li>`
        })}
    </ul>`)

  const pageVars = {
    blogPostsHtml: blogpostsHtml
  }

  return pageVars
}
```

This `postVars` renders some html from page introspection of the last 5 blog post titles. In the associated page markdown, this variable is available via a handlebars placeholder.

```md
<!-- README.md -->
## [Blog](./blog/)

\{{{ vars.blogPostsHtml }}}
```


## TypeScript Support

`domstack` now supports **TypeScript** via native type-stripping in Node.js.

- **Requires Node.js ≥23** *(built-in)* or **Node.js 22** with the `NODE_OPTIONS="--experimental-strip-types" domstack` env variable.
- Seamlessly mix `.ts`, `.mts`, `.cts` files alongside `.js`, `.mjs`, `.cjs`.
- No explicit compilation step needed—Node.js handles type stripping at runtime.
- Fully compatible with existing `domstack` file naming conventions.

### Supported File Types

Anywhere you can use  a `.js`, `.mjs` or `.cjs` file in domstack, you can now use `.ts`, `.mts`, `.cts`.
When running in a Node.js context, [type-stripping](https://nodejs.org/api/typescript.html#type-stripping) is used.
When running in a web client context, [esbuild](https://esbuild.github.io/content-types/#typescript) type stripping is used.
Type stripping provides 0 type checking, so be sure to set up `tsc` and `tsconfig.json` so you can catch type errors while editing or in CI.

### Recommended `tsconfig.json`

Install [@voxpelli/tsconfig](https://ghub.io/@voxpelli/tsconfig) which provides type checking in `.js` and `.ts` files and preconfigured for `--no-emit` and extend with type stripping friendly rules:

```json
{
  "extends": "@voxpelli/tsconfig/node20.json",
  "compilerOptions": {
    "skipLibCheck": true,
    "erasableSyntaxOnly": true,
    "allowImportingTsExtensions": true,
    "rewriteRelativeImportExtensions": true,
    "verbatimModuleSyntax": true
  },
  "include": [
    "**/*",
  ],
  "exclude": [
    "**/*.js",
    "node_modules",
    "coverage",
    ".github"
  ]
}
```

### Using TypeScript with domstack Types

You can use `domstack`'s built-in types to strongly type your layout, page, and template functions. The following types are available:

```ts
import type {
  LayoutFunction,
  PostVarsFunction,
  PageFunction,
  TemplateFunction,
  TemplateAsyncIterator
} from '@domstack/cli'
```

They are all generic and accept a variable template that you can develop and share between files.

### TypeScript Examples

#### Page Function

```typescript
// page.ts
import type { PageFunction } from '@domstack/cli'

export const vars = {
  message: 'TypeScript pages are easy!'
}

const page: PageFunction<typeof vars> = async ({ vars }) => {
  return `<h1>Hello from TypeScript!</h1><p>${vars.message}</p>`
}

export default page
```

#### Layout Function

```typescript
// root.layout.ts
import type { LayoutFunction } from '@domstack/cli'
import { html, render } from 'uhtml-isomorphic'

type Vars = {
  siteName: string,
  title?: string
}

const layout: LayoutFunction<Vars> = ({ vars, scripts, styles, children }) => {
  return render(String, html`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${vars.title ? `${vars.title} | ` : ''}${vars.siteName}</title>
      ${styles?.map(style => html`<link rel="stylesheet" href="${style}">`)}
      ${scripts?.map(script => html`<script type="module" src="${script}"></script>`)}
    </head>
    <body>
      ${children}
    </body>
    </html>
  `)
}

export default layout
```

## Design Goals

- Convention over configuration. All configuration should be optional, and at most it should be minimal.
- Align with the `index.html`/`README.md` pattern.
- The HTML is the source of truth.
- Don't re-implement what the browser already provides!
  - No magic `<link>` or `<a>` tag magic.
  - Don't facilitate client side routing. The browser supports routing by default.s
  - Accept the nature of the medium. Browsers browse html documents. Don't facilitate shared state between pages.
- Library agnostic. Strings are the interchange format.
- Pages are shallow apps. New page, new blank canvas.
- Just a program. `js` pages and layouts are just JavaScript programs. This provides an escape hatch to do anything. Use any template language want, but probably just use tagged template literals.
- Steps remain orthogonal. Static file copying, css and js bundling, are mere optimizations on top of the `src` folder. The `src` folder should essentially run in the browser. Each step in a `domstack` build should work independent of the others. This allows for maximal parallelism when building.
- Standardized entrypoints. Every page in a `domstack` site has a natural and obvious entrypoint. There is no magic redirection to learn about.
- Pages build into `index.html` files inside of named directories. This allows for naturally colocated assets next to the page, pretty URLs and full support for relative URLs.
- No parallel directory structures. You should never be forced to have two directories with identical layouts to put files next to each other. Everything should be colocatable.
- Markdown entrypoints are named README.md. This allows for the `src` folder to be fully navigable in GitHub and other git repo hosting providing a natural hosted CMS UI.
- Real TC39 ESM from the start.
- Garbage in, garbage out. Don't over-correct bad input.
- Conventions + standards. Vanilla file types. No new file extensions. No weird syntax to learn. Language tools should just work because you aren't doing anything weird or out of band.
- Encourage directly runnable source files. Direct run is an incredible, undervalued feature more people should learn to use.
- Support typescript, via ts-in-js and type stripping features. Leave type checking to tsc.
- Embrace the now. Limit support on features that let one pretend they are working with future ecosystem features e.g. pseudo esm (technology predictions nearly always are wrong!)

## FAQ

Why DOMStack?

:   DOMStack is named after the DOM (Document Object Model) and the concept of stacking technologies together to build websites. It represents the layering of HTML, CSS, and JavaScript in a cohesive build system.

How does `domstack` relate to [`sitedown`](https://ghub.io/sitedown)

:   `domstack` used to be called `siteup` which is sort of like "markup", which is related to "markdown", which inspired the project `sitedown` to which `domstack` is a spiritual off-shoot of. Put a folder of web documents in your `domstack` build system, and generate a website.

## Examples

Look at [examples](./examples/) and `domstack` [dependents](https://github.com/bcomnes/domstack/network/dependents) for some examples how `domstack` can work.

## Implementation

`domstack` bundles the best tools for every technology in the stack:

- `js` and `css` is bundled with [`esbuild`](https://github.com/evanw/esbuild).
- `md` is processed with [markdown-it](https://github.com/markdown-it/markdown-it).
- static files are processed with [cpx2](https://github.com/bcomnes/cpx2).
- web workers are supported via special naming conventions and automatic path resolution.

These tools are treated as implementation details, but they may be exposed more in the future. The idea is that they can be swapped out for better tools in the future if they don't make it.

### Build Process Flow

The following diagram illustrates the DomStack build process:

```
                    ┌─────────────┐
                    │    START    │
                    └──────┬──────┘
                           │
                           ▼
                 ┌──────────────────┐
                 │ identifyPages()  │
                 │                  │
                 │ • Find pages     │
                 │ • Find layouts   │
                 │ • Find templates │
                 │ • Find globals   │
                 │ • Find settings  │
                 └────────┬─────────┘
                          │
                          │
      ┌───────────────────┼───────────────────┐
      │                   │                   │
      ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ buildEsbuild()  │ │ buildStatic()   │ │  buildCopy()    │
│                 │ │                 │ │                 │
│ • Bundle JS/CSS │ │ • Copy static   │ │ • Copy extra    │
│ • Generate      │ │   files         │ │   directories   │
│   metafile      │ │ (if enabled)    │ │   from opts     │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  buildPages()    │
                    │                  │
                    │ • Process HTML   │
                    │ • Process MD     │
                    │ • Process JS     │
                    │ • Apply layouts  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Return Results  │
                    │                  │
                    │ • siteData       │
                    │ • esbuildResults │
                    │ • staticResults  │
                    │ • copyResults    │
                    │ • pageResults    │
                    │ • warnings       │
                    └──────────────────┘
```

The build process follows these key steps:

1. **Page identification** - Scans the source directory to identify all pages, layouts, templates, and global assets
2. **Destination preparation** - Ensures the destination directory is ready for the build output
3. **Parallel asset processing** - Three operations run concurrently:
   - JavaScript and CSS bundling via esbuild
   - Static file copying (when enabled)
   - Additional directory copying (from `--copy` options)
4. **Page building** - Processes all pages, applying layouts and generating final HTML

This architecture allows for efficient parallel processing of independent tasks while maintaining the correct build order dependencies.

#### buildPages() Detail

The `buildPages()` step processes pages in parallel with a concurrency limit:

```
                    ┌──────────────────┐
                    │  buildPages()    │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ Resolve Once:    │
                    │ • Global vars    │
                    │ • All layouts    │
                    └────────┬─────────┘
                             │
                ┌────────────▼───────────────┐
                │  Parallel Page Queue       │
                │(Concurrency: min(CPUs, 24))│
                └────────────┬───────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  MD Page Task   │    │ HTML Page Task  │    │  JS Page Task   │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │1. Read .md  │ │    │ │1. Read .html│ │    │ │1. Import .js│ │
│ │   file      │ │    │ │   file      │ │    │ │   module    │ │
│ └──────┬──────┘ │    │ └──────┬──────┘ │    │ └──────┬──────┘ │
│        ▼        │    │        ▼        │    │        ▼        │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │2. Extract   │ │    │ │2. Variable  │ │    │ │2. Variable  │ │
│ │ frontmatter │ │    │ │  Resolution │ │    │ │  Resolution │ │
│ └──────┬──────┘ │    │ └──────┬──────┘ │    │ └──────┬──────┘ │
│        ▼        │    │        ▼        │    │        ▼        │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ Frontmatter │ │    │ │page.vars.js │ │    │ │  Exported   │ │
│ │    vars     │ │    │ │             │ │    │ │    vars     │ │
│ └──────┬──────┘ │    │ └──────┬──────┘ │    │ └──────┬──────┘ │
│        ▼        │    │        ▼        │    │        ▼        │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │page.vars.js │ │    │ │  postVars   │ │    │ │page.vars.js │ │
│ │             │ │    │ │             │ │    │ │             │ │
│ └──────┬──────┘ │    │ └──────┬──────┘ │    │ └──────┬──────┘ │
│        ▼        │    │        ▼        │    │        ▼        │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │  postVars   │ │    │ │3. Handlebars│ │    │ │  postVars   │ │
│ │             │ │    │ │ (if enabled)│ │    │ │             │ │
│ └──────┬──────┘ │    │ └──────┬──────┘ │    │ └──────┬──────┘ │
│        ▼        │    │        ▼        │    │        ▼        │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │3. Render MD │ │    │ │4. Render    │ │    │ │3. Execute   │ │
│ │   to HTML   │ │    │ │  with layout│ │    │ │  page func  │ │
│ └──────┬──────┘ │    │ └──────┬──────┘ │    │ └──────┬──────┘ │
│        ▼        │    │        ▼        │    │        ▼        │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │4. Extract   │ │    │ │5. Write HTML│ │    │ │4. Render    │ │
│ │  title (h1) │ │    │ │             │ │    │ │  with layout│ │
│ └──────┬──────┘ │    │ └─────────────┘ │    │ └──────┬──────┘ │
│        ▼        │    │                 │    │        ▼        │
│ ┌─────────────┐ │    │                 │    │ ┌─────────────┐ │
│ │5. Render    │ │    │                 │    │ │5. Write HTML│ │
│ │  with layout│ │    │                 │    │ │             │ │
│ └──────┬──────┘ │    │                 │    │ └─────────────┘ │
│        ▼        │    │                 │    │                 │
│ ┌─────────────┐ │    │                 │    │                 │
│ │6. Write HTML│ │    │                 │    │                 │
│ └─────────────┘ │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                      │                      │
         └──────────────────────┼──────────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  Complete when   │
                       │  all pages done  │
                       └──────────────────┘
```

Variable Resolution Layers:
- **Global vars** - Site-wide variables from `global.vars.js` (resolved once)
- **Layout vars** - Layout-specific variables from layout functions (resolved once)
- **Page-specific vars** vary by type:
  - **MD pages**: frontmatter → page.vars.js → postVars
  - **HTML pages**: page.vars.js → postVars
  - **JS pages**: exported vars → page.vars.js → postVars
- **postVars** - Post-processing function that can modify variables based on all resolved data

## Roadmap

`domstack` works and has a rudimentary watch command, but hasn't been battle tested yet.
If you end up trying it out, please open any issues or ideas that you have, and feel free to share what you build.

Some notable features are included below, see the [roadmap](https://github.com/users/bcomnes/projects/3/) for a more in depth view of whats planned.

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
- [x] `mjs` and `cjs` file extension support
- [x] Improved watch log output
- [x] Docs website built with `domstack`: https://domstack.net
- [x] `--eject` cli flag
- [x] Global assets can live anywhere
- [x] Built in browsersync dev server
- [x] Real default layout style builds
- [x] Esbuild settings escape hatch
- [x] Copy folders
- [x] Full Typescript support via native type stripping
- [x] JSX+TSX support in client bundles
- [x] Rename to domstack
- ...[See roadmap](https://github.com/users/bcomnes/projects/3/)

## History

DOMStack started its life as `top-bun` in 2023, named after the bakery from Wallace and Gromit. The project was created to provide a simple, fast, and flexible static site generator that could handle modern web development needs while staying true to web standards.

The project was renamed to DOMStack in version 11 to better reflect its purpose and avoid confusion with the Bun JavaScript runtime. The name DOMStack represents the layering of web technologies (HTML, CSS, JavaScript) that the tool helps developers stack together efficiently.

Key milestones:
- **v7 (2023)**: Major rewrite and reintroduction as top-bun
- **v11 (2023)**: Renamed from top-bun to DOMStack
- **v12+**: Added full TypeScript support and improved performance
- **Current**: Added Web Workers support with automatic path resolution

## Links

- [CHANGELOG](CHANGELOG.md)
- [CONTRIBUTING](CONTRIBUTING.md)
- [Dependencies](dependencygraph.svg)

## License

[MIT](LICENSE)

[uhtml]: https://github.com/WebReflection/uhtml
[hb]: https://handlebarsjs.com
[esbuild]: http://esbuild.github.io
[neocities-img]: https://img.shields.io/website/https/domstack.neocities.org?label=neocities&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAGhlWElmTU0AKgAAAAgABAEGAAMAAAABAAIAAAESAAMAAAABAAEAAAEoAAMAAAABAAIAAIdpAAQAAAABAAAAPgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIKADAAQAAAABAAAAIAAAAAAueefIAAACC2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8dGlmZjpDb21wcmVzc2lvbj4xPC90aWZmOkNvbXByZXNzaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4Kpl32MAAABzBJREFUWAnFVwtwnFUV/v5//31ks5tsE9I8moS0iWETSNKUVpBKDKFQxtrCUIpacHQEGYk16FQHaZ3ajjqjOGWqOKUyMCl2xFoKhQJDBQftpOnAmDZoOyRNjCS1SdO8H5vXPv7rd/7NZvIipQjjmfn23Me555x77rnnv6sppTT8H0n/tG1rmlZIVBG+eW1JBD4t0GA8cYZQcS7ncXL7bFuYPfBJ9mlwtxg3bJoSTvx0tn7LAU48IJNE3GyBj9unrlJC2XRt4vGvLFGGrkXYDxEl03WyDyfRRoiHrxOfiBPU85bovPezi5pHnlmhHq5IsaLAXHhltgPXi+A0VE8X+Dht6lov+uw2rf/8nmIlDjQ+fp1yO/SYnaKYXoOC5QSu8trgddnND7rHv0EvOymwTcbnI867OZ5PLCOKiUIijQgS54nPE3hsfXog2WNY2Z+V5MDXVifjd3/ths/jquL0QyIj9EdC3V6UoLr25KurU73D0ieOEIniKbkc063EduLPRDcR2828/DOpzrbBp0ut3UsEBMe3X2PJuhw2sWHplgjkEViyyBGM93gcf3kkxVP2hNZ1sWfoLg7/jbttJC8jMgiLHHYj4EuIb81I9gQLM92O0iyH+9pUlZSdGDHCJjA0biI/zZ3NxIstsfjKpfFYmROHutYxDwduIo6JAxI6LIq3cSmtpCSg9jF3UsXuix2tHb3L7YZevHRx/FBZvrNzTaEnLTfFQHaSna6CSrghjbVMJzRbtC1KFqC1xT5xAFdnZdxPMcsBS1wpDLHhEoWpiXbj3R8mZ1zoT0Caz677PE4fdDunJYIzd2UtvoKfWwq9+PnRiwgMDd5RX/PGVRIBixLjbNNKpQaP1wO/NzYb47ON0yEzAhUJQjOYJhKFy9DybDcyk+y40DeSdOz5J+5h7CBAxDQdl1k7d5rGHWW74Cz/GdM0gQGSWrMwxTl0VBRSlnSmoblMjIel0zkgN+gKSDFl7G7YMm+C4d8Ix4pvQ4XGPpKC8snQ/vPfvYXiwPuy6tylK3RAFokTpuU/NF8u08dAzbkA/nCylyVeBOanJawJQpcGxjMkB04QdzS0j5ujQVNntZK5BSkwYaIvEEZmQgjm4AeweTOguRah4ZKJdbubeZwKaYl23HptNNQxZeMhE0fqBrDthXZraHTCtKydlF73cFhv67l8FGRnm55sQcGjZ/GTI50IN75kKdMTsywnzMmtj4XmhuDRP13Ag8+2YnA0GrVgWDFmwFld10dN03TXNg2jIMNlKfywn//0BXGyKWBNv904isj5GqjhdmjeJSjMzUDttmUYChpYnS+1ZiY9+IUUrCvxIS/Nic/tbAiOBBkBltoeGn9PRA+c6Jm5Yp5edrIDlWsWw09Ht23IgBrvQ+i9Zy1JcaKE1+zmZTp0c240i7LiwJIPXdPACMnmw9ZriOV2Czu/ES3v7izAdZlx0rw8SQLy/jtu/AEmstfhTP3fcUPRUkS6ziB0eh/M/hZovCkx6ugP4ccvtuO1+gGMMI9IfbGM289j6JSRY/8YEIbmSxM4enoA+2t60MuEm0NyA2xOuL5UDaPgXjQ0NODmW27DgVeOw5a3Dq6Nh2DLWcMnyOjU0v6RME63jloJOjnYZ0VAOozCb8kq4506fG4bOgZCU1fphe/m4osliZNrokwFA3Cs/A7sq6qsgU0bN+LwS9GE9Pv9cLvd8Ofn4Zl7wlC9zXRWSnmUnqvpDVY+1yZ38WgsAjKzX34kNF1DYeQtduLOFT4ceSRvjnFEQrClFMK2/FsIBALYu3evZfw2mxe/Yj1obGzExY4OfPmr98Hu38QCOSGqp+j3tT3RLAZek0SwiMlYxyjIFu6WgX3fzMGNufKonYd49kNGOspLrkdTUxMikQhS4r34tZGDZObEHkccdu3chQ0bNiDc/OoMBQdqe/HOv0aSONhBHJ5yYFLqR+QVoYjyPcT7+mJVLsZ5n988O4gTvHrfX5uKMimjzOJEewhbt25FZ2cnWlpaUF1djdcTR1A6NoH24BiC/E4IKSaiyMuX9OVT/Xh4f5tkn0R+Czc9MOdZzokHLGmuiLPr8qqViqKchqYObcmNvnCeLlajz9+uzGCAOpTiNVabN2+25ETWMAxVV1enzPEBS254X5GqWpsmHwqRkfP4OpdF8y/WmM4psJ3HIVuYMr7n/qwZz6uRp/xq4uQvuSxK4sTBgwfVjh07VH19veInWnW9+j11uDJdlebEj0zqaiC/gSum/gxN3QJOzCA6sIIDv2D0KlhdrWS9Jt2F9aU+FKQ7eeYKi3kaSaur4C29j98lE4P9XWg59z5OnXgDb7/1pvlOY7c5EbYKjug+RFTSeJ90pmi6N/O1KbiKeIqOtJFPhXl6m87OGae8hPoU8SSxaj7dMvahEeCiGUQjcm/LiHLCT8hbUsaGCKk2wqWWNxHykD1LA13kC9JHdmBBLf/D5H8By9d+IkwR5NMAAAAASUVORK5CYII=
