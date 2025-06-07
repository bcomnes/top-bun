// The root.layout.js file must return the rendered page.
// It must implement the following variables:
//
// - children: the string or type that the page returns that represents the inner-content of the page
// - scripts: an array of urls that should be injected into the page as script tags, type module
// - styles: an array of urls that should be injected into the page as link rel="stylesheet" tags.
//
// All other variables are set on a page level basis, either by hand or by data extraction from the page type.

import { html } from 'htm/preact'
import { render } from 'preact-render-to-string'

export default async function RootLayout ({
  vars: {
    title,
    siteName,
  },
  scripts,
  styles,
  children,
}) {
  return /* html */`
    <!DOCTYPE html>
    <html>
      ${render(html`
        <head>
          <meta charset="utf-8">
          <title>${siteName}${title ? ` | ${title}` : ''}</title>
          <meta name="viewport" content="width=device-width, user-scalable=no" />
          ${scripts
            ? scripts.map(script => html`<script src="${script}" type='module'></script>`)
            : null}
          ${styles
            ? styles.map(style => html`<link rel="stylesheet" href="${style}" />`)
            : null}
        </head>
      `)}
      ${render(html`
        <body>
          <div class="mine-layout">
            ${typeof children === 'string'
              ? html`<div dangerouslySetInnerHTML=${{ __html: children }}></div>`
              : children /* Support both preact and string children */}
          </div>
        </body>
      `)}
    </html>
  `
}
