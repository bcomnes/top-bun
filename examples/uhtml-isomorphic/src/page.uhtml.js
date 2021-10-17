import { html, useState, useEffect } from 'uland-isomorphic'

export default async function ulandIsomorphicPage ({
  siteName,
  title
}) {
  const [state, setState] = useState()

  useEffect(() => {
    setState('hydrated')

    return () => {
      setState('unmounted')
    }
  })

  return html`
    <div>
      This page should act as a static page build src, but also the client bundle.
    </div>

    <div>
      state: ${state}
    </div>
  `
}

export const vars = {
  title: 'JS Page'
}
