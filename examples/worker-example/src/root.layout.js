/**
 * Root layout for the worker example
 */
export default function rootLayout ({ vars, children, styles = [], scripts = [] }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${vars.title || 'Web Worker Example'}</title>
  ${styles.map(style => `<link rel="stylesheet" href="${style}">`).join('\n  ')}
</head>
<body>
  ${children}
  ${scripts.map(script => `<script type="module" src="${script}"></script>`).join('\n  ')}
</body>
</html>`
}
