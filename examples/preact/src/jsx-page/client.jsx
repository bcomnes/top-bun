import { render } from 'preact'

export const page = () => {
  return (
    <div>
      look ma, client side jsx!
    </div>
  )
}

const renderTarget = document.querySelector('.jsx-app')
render(page(), renderTarget)
