import { html } from 'uhtml-ssr'
import { nav } from '../../nav.js'

export default async function nestedPage (vars) {
  return html`
    <div class='green-text'></div>
    ${nav(html)}
`
}
