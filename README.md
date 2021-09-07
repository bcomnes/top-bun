# xiteup
[![Actions Status](https://github.com/bcomnes/xiteup/workflows/tests/badge.svg)](https://github.com/bcomnes/xiteup/actions)

`xiteup` builds websites with html, md, css and javascript.

Still a WIP, but you can look at [test-project](./test-project/) and `xiteup` dependents for some examples how `xiteup` can work.


`xiteup` means "siteup", which is sort of like "markup", which is related to "markdown", which inspired the project [`sitedown`](https://ghub.io/sitedown) which is the spiritual successor to this tool.

```console
npm install xiteup
```

## Usage

``` console
$ xiteup --help
Usage: xiteup [options]

    Example: xiteup --src website --dest public

    --src, -s             path to source directory (default: "src")
    --dest, -d            path to build destination directory (default: "public")
    --watch, -w           build and watch the src folder for additional changes
    --help, -h            show help
    --version, -v         show version information
xiteup (v0.0.11)
```

`xiteup` builds a `src` directory into a `dest` directory (default: `public`).

`xiteup` builds 'pages', which can either be `md`, `html` or `js` pages.

### Pages

- `md` pages are commonmark markdown pages.
- `html` pages are static, inner-html fragments that get inserted as-is into the page layout.
- `js` pages are a js file that exports an async function that resolves into an inner-html fragment that is inerted into the page layout. It is the only page that can access variables during rendering.

#### Page Files

All pages can have a `client.js` and a `style.css` file inside of their associated folder.
These are uniquely built and loaded on their associated page.
The `client.js` page bundles are bundle split with every other client side javascript entry-point.
The `style.css` page is not de-duplicated or split with other style files.

Each page can also have a `page.vars.js` file that exports a `default` function that contains page specific variables.

#### `md` pages

- `md` pages have two types: a `README.md` in a folder, or a loose `whatever-name-you-want.md` file.
- `md` pages can have yaml frontmatter, with variables that are accessible to the page layout when building.
- Frontmatter variables have higher precedence over `page.vars.js` or `global.vars.js`variables.
- You can include html in markdown files, so long as you adhere to the allowable markdown syntax around html tags.


#### `html` pages

`html` pages are named `page.html` inside an associated page folder.
`html` pages are the simplest page type in `xiteup`. They let you build with raw html for when you don't want that page to have access to markdown features. Some pages are better off with just raw `html`.

#### `js` pages

`js` pages are files inside a page folder called `page.js`.

...WIP

## License

MIT
