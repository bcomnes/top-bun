// The root.layout.js file must return the rendered page.
// It must implement the following variables:
//
// - children: the string or type that the page returns that represents the inner-content of the page
// - scripts: an array of urls that should be injected into the page as script tags, type module
// - styles: an array of urls that should be injected into the page as link rel="stylesheet" tags.
//
// All other variables are set on a page level basis, either by hand or by data extraction from the page type.

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
