import { html, Component } from 'htm/preact'
import { render } from 'preact'
import { useCallback } from 'preact/hooks'
import { useSignal, useComputed } from '@preact/signals'

const Header = ({ name }) => html`
  <h1 class="text-3xl font-bold text-gray-800 mb-4">${name} List</h1>
`

const Footer = props => {
  const count = useSignal(0)
  const double = useComputed(() => count.value * 2)

  const handleClick = useCallback(() => {
    count.value++
  }, [count])

  return html`
    <footer class="mt-8 p-4 bg-gray-100 rounded shadow flex flex-col gap-2" ...${props}>
      <div class="text-gray-600">Count: ${count}</div>
      <div class="text-gray-600">Double: ${double}</div>
      <div>${props.children}</div>
      <button
        onClick=${handleClick}
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Click
      </button>
    </footer>
  `
}

class App extends Component {
  addTodo () {
    const { todos = [] } = this.state
    this.setState({ todos: todos.concat(`Item ${todos.length}`) })
  }

  render ({ page }, { todos = [] }) {
    return html`
      <div class="app max-w-xl mx-auto p-6 bg-white rounded shadow">
        <${Header} name="ToDo's (${page})" />
        <ul class="space-y-2 mb-4">
          ${todos.map(todo => html`
            <li key=${todo} class="p-2 bg-gray-50 rounded shadow">${todo}</li>
          `)}
        </ul>
        <button
          onClick=${() => this.addTodo()}
          class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Add Todo
        </button>
        <${Footer}>footer content here<//>
      </div>
    `
  }
}

export const page = () => html`
  <div class="space-y-6">
    <${App} page="Isomorphic"/>
    <${Footer}>footer content here<//>
    <${Footer}>footer content here<//>
  </div>
`

if (typeof window !== 'undefined') {
  const renderTarget = document.querySelector('.app-main')
  render(page(), renderTarget)
}
