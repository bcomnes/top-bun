export const vars = {
  title: 'Pages Example',
  script: '/pages/index.js'
}

export default function pagesPage() {
  return `
    <h1>Pages in DomStack</h1>
    
    <p>DomStack supports multiple page types:</p>
    
    <ul>
      <li><strong>HTML Pages</strong> - Simple HTML files with <code>page.html</code></li>
      <li><strong>Markdown Pages</strong> - Markdown files like <code>README.md</code></li>
      <li><strong>JS Pages</strong> - JavaScript functions that return HTML (like this page)</li>
    </ul>
    
    <p>This is a JS page which allows for dynamic content generation during the build process.</p>
    
    <div class="example">
      <h2>Example JS Page</h2>
      <pre><code>export const vars = {
  title: 'Pages Example',
  script: '/pages/index.js'
}

export default function pagesPage() {
  return \`
    <h1>Pages in DomStack</h1>
    // More HTML content...
  \`;
}</code></pre>
    </div>
    
    <p>
      <a href="/" class="button">Back to Home</a>
    </p>
  `;
}