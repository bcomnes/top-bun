import { html } from 'uhtml-isomorphic'

export default async function JSPage ({
  siteName,
  title
}) {
  return html`
  <p>The js page is the only page type that can render the body with the set varibles.</p>

  <p>
    All you have to do is export a default function (async or sync) that returns a string, or any
    type that your layout can handle.
    In this case, we are using <a href="https://ghub.io/uhtml-isomorphic"><pre>uhtml-isomorphic</pre></a>.
  </p>

  <p>Here we access the <pre>siteName</pre> and <pre>title</pre> variables inside the page</p>

  <p>${siteName}</p>
  <p>${title}</p>

  <p>JS pages can also have a page scoped <pre>client.js</pre> and <pre>style.css</pre>. It
   is an incredibly flexible page type.
  </p>
  `
}

export const vars = {
  title: 'JS Page'
}
