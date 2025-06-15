import { html, Component } from 'htm/preact'
import { render } from 'preact'
import { useCallback } from 'preact/hooks'
import { useSignal, useComputed } from '@preact/signals'
import { outerShell, button, dangerButton, card } from './app.module.css'

// Header component with CSS module class
const Header = ({ title }) => html`
  <header class=${outerShell}>
    <h1>${title}</h1>
    <p>This header uses the <code>outerShell</code> CSS module class</p>
  </header>
`

// Counter component demonstrating Preact Signals
const Counter = () => {
  const count = useSignal(0)
  const doubled = useComputed(() => count.value * 2)

  const handleIncrement = useCallback(() => {
    count.value++
  }, [count])

  const handleReset = useCallback(() => {
    count.value = 0
  }, [count])

  return html`
    <div class=${card}>
      <h3 class="title">Counter with Signals</h3>
      <div class="content">
        <p>Count: <strong>${count}</strong></p>
        <p>Doubled: <strong>${doubled}</strong></p>
        <button class=${button} onClick=${handleIncrement}>Increment</button>
        <button class=${dangerButton} onClick=${handleReset}>Reset</button>
      </div>
    </div>
  `
}

// TodoList component using class component style
class TodoList extends Component {
  constructor (props) {
    super(props)
    this.state = { todos: [], newTodo: '' }
  }

  addTodo () {
    const { todos, newTodo } = this.state
    if (newTodo.trim()) {
      this.setState({
        todos: [...todos, newTodo],
        newTodo: ''
      })
    }
  }

  updateNewTodo (e) {
    this.setState({ newTodo: e.target.value })
  }

  removeTodo (index) {
    const { todos } = this.state
    this.setState({
      todos: todos.filter((_, i) => i !== index)
    })
  }

  render () {
    const { todos, newTodo } = this.state

    return html`
      <div class=${card}>
        <h3 class="title">Todo List</h3>
        <div class="content">
          <div style="margin-bottom: 1rem;">
            <input
              type="text"
              value=${newTodo}
              onInput=${(e) => this.updateNewTodo(e)}
              placeholder="Add a new todo"
            />
            <button
              class=${button}
              onClick=${() => this.addTodo()}
            >
              Add
            </button>
          </div>

          ${todos.length === 0
            ? html`<p>No todos yet. Add some!</p>`
            : html`
              <ul style="padding-left: 1.5rem;">
                ${todos.map((todo, index) => html`
                  <li key=${index}>
                    ${todo}
                    <button
                      class=${dangerButton}
                      style="margin-left: 0.5rem; padding: 2px 6px;"
                      onClick=${() => this.removeTodo(index)}
                    >
                      ×
                    </button>
                  </li>
                `)}
              </ul>
            `
          }
        </div>
      </div>
    `
  }
}

// Footer component
const Footer = () => html`
  <footer style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee; text-align: center;">
    <p>CSS Modules Demo with Preact</p>
    <p><small>This demo shows how to use CSS Modules with Preact components</small></p>
  </footer>
`

// Main App component
const App = ({ title }) => {
  return html`
    <div style="max-width: 800px; margin: 0 auto; padding: 1rem;">
      <${Header} title=${title} />

      <div style="display: grid; grid-template-columns: 1fr; gap: 1rem; margin: 1rem 0;">
        <${Counter} />
        <${TodoList} />
      </div>

      <${Footer} />
    </div>
  `
}

// Page component for export
export const page = () => html`<${App} title="CSS Modules Demo" />`

// Client-side rendering
if (typeof window !== 'undefined') {
  const renderTarget = document.querySelector('.app-main')
  render(page(), renderTarget)
}
