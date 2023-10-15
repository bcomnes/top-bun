import { html } from 'uhtml-isomorphic'
import { dirname, basename } from 'node:path'

export default async ({
  vars,
  pages
}) => {
  const yearPages = pages.filter(page => dirname(page.page.path) === 'blog')
  return html`<div>
    <ul>
      ${yearPages.map(yearPage => html`<li><a href="${`/${yearPage.page.path}/`}">${basename(yearPage.page.path)}</a></li>`)}
    </ul>
  </div>`
}

export const vars = {
  somePageScopled: 'vars'
}
