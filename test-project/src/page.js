import { html, render } from 'uhtml-ssr'
import { nav } from './nav.js'

export default async function rootPage ({
  foo
}) {
  return render(String, html`
    <div class='blue-text'>
      Hello world
    </div>
    <div>foo: ${foo}</div>
    ${nav(html)}
`)
}
