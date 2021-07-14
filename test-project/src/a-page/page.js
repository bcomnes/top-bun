import { html, render } from 'uhtml-ssr'
import { foo as lib } from './libs/a-lib.js'
import { nav } from '../nav.js'

export default async function aPage ({
  foo
}) {
  return render(String, html`
    <div class='blue-text'>
      Hello world
    </div>
    <div class='red-text'>
      foo: ${foo}
    </div>
    <div>
      lib: ${JSON.stringify(lib, null, ' ')}
    </div>
    ${nav(html)}
`)
}
