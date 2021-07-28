import { html, render } from 'uhtml-ssr'
import { foo as lib } from './libs/a-lib.js'
import { nav } from '../nav.js'

export default async function aPage ({
  foo
}) {
  return html`
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
`
}

export const vars = {
  page: 'level vars'
}
