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
      ${scripts}
      ${styles}
      <link rel="stylesheet" href="/global.css" />
    </head>
    <body>
      ${children}
    </body>
    </html>
`)
}
