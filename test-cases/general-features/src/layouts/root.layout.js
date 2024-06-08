// @ts-ignore
import { html, render } from 'uhtml-isomorphic'

/**
 * @template T extends object
 * @typedef {import('../../../../index.js').LayoutFunction<T>} LayoutFunction
 */

/**
 * @typedef {{
 * title: string
 * siteName: string,
 * authorImgUrl: string
 * authorName: string,
 * authorUrl: string,
 * authorImgAlt: string,
 * publishDate: string,
 * updatedDate?: string
 * }} SiteVars
 */

/** @type {LayoutFunction<SiteVars>} */
export default function defaultRootLayout ({
  vars: {
    title,
    siteName = 'TopBun',
  },
  scripts,
  styles,
  children,
  /* pages */
}) {
  return render(String, html`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title ? `${title}` : ''}${title && siteName ? ' | ' : ''}${siteName}</title>
      <meta name="viewport" content="width=device-width, user-scalable=no" />
      <meta itemprop="publisher" content="${siteName}">
      <meta property="og:site_name" content="${siteName}">
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
