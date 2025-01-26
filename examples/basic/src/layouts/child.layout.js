import { html } from 'uhtml-isomorphic'

import defaultRootLayout from './root.layout.js'

export default function articleLayout (args) {
  const { children, ...rest } = args
  const wrappedChildren = html`
    <article class="bc-article h-entry" itemscope itemtype="http://schema.org/NewsArticle">

      <h1>${rest.vars.title}</h1>

      <section class="e-content" itemprop="articleBody">
        ${typeof children === 'string'
          ? html([children])
          : children /* Support both uhtml and string children. Optional. */
        }
      </section>
    </article>
  `

  return defaultRootLayout({ children: wrappedChildren, ...rest })
}
