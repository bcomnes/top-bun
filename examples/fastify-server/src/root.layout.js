export default function rootLayout({ title, content, vars }) {
  const siteTitle = 'DomStack Fastify Example'
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title ? `${title} | ${siteTitle}` : siteTitle}</title>
  <link rel="stylesheet" href="/index.css">
  ${vars.script ? `<script src="${vars.script}" type="module"></script>` : ''}
</head>
<body>
  <header>
    <h1>${siteTitle}</h1>
    <nav>
      <ul style="display: flex; list-style: none; gap: 1rem; margin: 0; padding: 0;">
        <li><a href="/">Home</a></li>
        <li><a href="/pages">Pages</a></li>
        <li><a href="/api/hello">API Example</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    ${content}
  </main>
  
  <footer>
    <p>Built with DomStack and Fastify - ${new Date().getFullYear()}</p>
  </footer>
</body>
</html>`
}