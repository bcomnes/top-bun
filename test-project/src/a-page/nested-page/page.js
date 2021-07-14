import { html, render } from 'uhtml-ssr'
import { nav } from '../../nav.js'

export default async function nestedPage (vars) {
  return render(String, html`
    <div class='green-text'></div>
    ${nav(html)}
`)
}
