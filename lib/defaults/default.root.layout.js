import { html, render } from 'uhtml-isomorphic'

export default function defaultRootLayout ({
  title,
  siteName = 'Siteup',
  defaultStyle = true,
  scripts,
  styles,
  children
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
      ${defaultStyle
        ? html`
            <link rel="stylesheet" href="https://unpkg.com/mine.css/dist/mine.css" />
            <link rel="stylesheet" href="https://unpkg.com/mine.css/dist/layout.css" />
            <link rel="stylesheet" href="https://unpkg.com/highlight.js/styles/github-dark-dimmed.css" />
            <script type="module">
              import { toggleTheme } from 'https://unpkg.com/mine.css?module';
              window.toggleTheme = toggleTheme
            </script>
            `
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
