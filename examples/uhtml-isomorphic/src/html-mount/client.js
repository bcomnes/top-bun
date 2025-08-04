import { html, render } from 'uhtml-isomorphic'

export const page = () => {
  return html`
    <div>
      look ma, client side uhtml-isomorphic!
    </div>
  `
}

const renderTarget = document.querySelector('.uhtml-app')
render(renderTarget, page())
