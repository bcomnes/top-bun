import { html, render } from 'uhtml-ssr'

export default async function RootLayout ({
  title,
  scripts,
  styles,
  children
}) {
  return render(String, html`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <meta name="viewport" content="width=device-width, user-scalable=no" />
      ${scripts
        ? scripts.map(script => html`<script src="${script}" type='module'></script>`)
        : null}
      ${styles
        ? styles.map(style => html`<link rel="stylesheet" href=${style} />`)
        : null}
      <link rel="stylesheet" href="/global.css" />
    </head>
    <body>
      ${children}
    </body>
    </html>
`)
}
