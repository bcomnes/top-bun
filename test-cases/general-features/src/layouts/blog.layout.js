import defaultRootLayout from './root.layout.js'
import { html } from 'uhtml-isomorphic'

export default function blogLayout (vars) {
  const { children: innerChildren, ...rest } = vars

  const children = html`
    <article>
      ${typeof innerChildren === 'string' ? html([innerChildren]) : innerChildren /* Support both uhtml and string children. Optional. */}
    </article>
  `
  return defaultRootLayout({ ...rest, children })
}
