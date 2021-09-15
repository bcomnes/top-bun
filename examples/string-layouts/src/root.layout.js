// Layouts can be a simple as returning a template literal, though you can use
// libraries like uhtml-isomorphic for better DX.

export default async function RootLayout ({
  title,
  siteName,
  scripts,
  styles,
  children
}) {
  return /* html */`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${siteName || ''}${title ? ` | ${title}` : ''}</title>
      <meta name="viewport" content="width=device-width, user-scalable=no" />
      ${scripts
        ? scripts.map(script => /* html */`<script src="${script}" type='module'></script>`)
        : ''}
      ${styles
        ? styles.map(style => /* html */`<link rel="stylesheet" href=${style} />`)
        : ''}
    </head>
    <body>
      ${children}
    </body>
    </html>
`
}
