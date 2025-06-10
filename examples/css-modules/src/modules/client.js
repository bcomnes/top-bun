import { html, Component } from 'htm/preact'
import { render } from 'preact'
import { useCallback } from 'preact/hooks'
import { useSignal, useComputed } from '@preact/signals'
import { outerShell } from './app.module.css'

const Header = ({ name }) => html`<h1>${name} List</h1>`

const Footer = props => {
  const count = useSignal(0)
  const double = useComputed(() => count.value * 2)

  const handleClick = useCallback(() => {
    count.value++
  }, [count])

  return html`<footer ...${props}>
    ${count}
    ${double}
    ${props.children}
    <button onClick=${handleClick}>Click</button>
  </footer>`
}

class App extends Component {
  addTodo () {
    const { todos = [] } = this.state
    this.setState({ todos: todos.concat(`Item ${todos.length}`) })
  }

  render ({ page }, { todos = [] }) {
    return html`
          <div class="${`app ${outerShell}`}">
            <${Header} name="ToDo's (${page})" />
            <ul>
              ${todos.map(todo => html`
                <li key=${todo}>${todo}</li>
              `)}
            </ul>
            <button onClick=${() => this.addTodo()}>Add Todo</button>
            <${Footer}>footer content here<//>
          </div>
        `
  }
}

export const page = () => html`
    <${App} page="Isomorphic"/>
    <${Footer}>footer content here<//>
    <${Footer}>footer content here<//>
  `

if (typeof window !== 'undefined') {
  const renderTarget = document.querySelector('.app-main')
  render(page(), renderTarget)
}
