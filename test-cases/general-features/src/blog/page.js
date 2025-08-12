import { html } from 'htm/preact'
import { dirname, basename } from 'node:path'

/**
 * @type {import('../../../../index.js').LayoutFunction<{}>}
 */
export default async function blogIndex ({
  pages
}) {
  const yearPages = pages.filter(page => dirname(page.pageInfo.path) === 'blog')

  const children = html`
    <div>
      <ul>
        ${yearPages.map(yearPage => html`
          <li>
            <a href="${`/${yearPage.pageInfo.path}/`}">
              ${basename(yearPage.pageInfo.path)}
            </a>
          </li>
        `)}
      </ul>
    </div>
  `

  // @ts-ignore
  return children
}

export const vars = {
  somePageScopled: 'vars',
}
