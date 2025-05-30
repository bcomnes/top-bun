// @ts-ignore
import { html } from 'uhtml-isomorphic'
import { dirname, basename } from 'node:path'

/**
 * @type {import('../../../../index.js').LayoutFunction<{}>}
 */
export default async function blogIndex ({
  /** vars */
  pages,
}) {
  const yearPages = pages.filter(page => dirname(page.pageInfo.path) === 'blog')
  return html`<div>
    <ul>
      ${yearPages.map(yearPage => html`<li><a href="${`/${yearPage.pageInfo.path}/`}">${basename(yearPage.pageInfo.path)}</a></li>`)}
    </ul>
  </div>`
}

export const vars = {
  somePageScopled: 'vars',
}
