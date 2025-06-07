import { html, Component } from 'htm/preact'
import { render } from 'preact'
import { useCallback } from 'preact/hooks'
import { useSignal, useComputed } from '@preact/signals'

// Type definitions demonstrate TypeScript features
interface HeaderProps {
  name: string;
  subtitle?: string;
}

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

interface FooterProps {
  theme?: 'light' | 'dark';
  children?: any;
  onReset?: () => void;
}

interface AppProps {
  page: string;
  maxItems?: number;
}

interface AppState {
  todos: TodoItem[];
  filter: 'all' | 'active' | 'completed';
}

// Component with typed props
const Header = ({ name, subtitle }: HeaderProps): any => 
  html`<header>
    <h1>${name} List</h1>
    ${subtitle ? html`<p>${subtitle}</p>` : null}
  </header>`

// Functional component with TypeScript hooks
const Footer = (props: FooterProps) => {
  const count = useSignal<number>(0)
  const double = useComputed<number>(() => count.value * 2)

  const handleClick = useCallback((): void => {
    count.value++
  }, [count])

  return html`<footer ...${props}>
    <div>Count: ${count}</div>
    <div>Double: ${double}</div>
    ${props.children}
    <button onClick=${handleClick}>Click</button>
    ${props.onReset ? html`<button onClick=${props.onReset}>Reset</button>` : null}
  </footer>`
}

// Class component with typed props and state
class App extends Component<AppProps, AppState> {
  // Type the state initialization
  state: AppState = {
    todos: [],
    filter: 'all'
  }

  // Typed methods
  addTodo(): void {
    const { todos } = this.state
    const { maxItems = 10 } = this.props
    
    if (todos.length < maxItems) {
      this.setState({ 
        todos: [
          ...todos, 
          {
            id: Date.now(),
            text: `Item ${todos.length}`,
            completed: false
          }
        ] 
      })
    }
  }

  toggleTodo(id: number): void {
    this.setState({
      todos: this.state.todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    })
  }

  // Generic utility method with type parameter
  filterItems<T extends { completed: boolean }>(items: T[], status: AppState['filter']): T[] {
    if (status === 'active') return items.filter(i => !i.completed)
    if (status === 'completed') return items.filter(i => i.completed)
    return items
  }

  render({ page }: AppProps, { todos, filter }: AppState) {
    // Use our generic method
    const filteredTodos = this.filterItems(todos, filter)
    
    return html`
          <div class="app">
            <${Header} name="ToDo's (${page})" subtitle="TypeScript Example" />
            
            <div class="filters">
              <button onClick=${() => this.setState({ filter: 'all' })}>All</button>
              <button onClick=${() => this.setState({ filter: 'active' })}>Active</button>
              <button onClick=${() => this.setState({ filter: 'completed' })}>Completed</button>
            </div>
            
            <ul>
              ${filteredTodos.map(todo => html`
                <li key=${todo.id} 
                    class=${todo.completed ? 'completed' : ''}
                    onClick=${() => this.toggleTodo(todo.id)}>
                  ${todo.text}
                </li>
              `)}
            </ul>
            <button onClick=${() => this.addTodo()}>Add Todo</button>
            <${Footer} 
              theme="light"
              onReset=${() => this.setState({ todos: [] })}>
              footer content here
            <//>
          </div>
        `
  }
}

// Export with proper return type annotation
export const page = (): any => html`
    <${App} page="Isomorphic" maxItems=${15} />
    <${Footer} theme="light">footer content here<//>
    <${Footer} theme="dark">footer content here<//>
  `

if (typeof window !== 'undefined') {
  const renderTarget = document.querySelector('.app-main')
  if (renderTarget) {
    render(page(), renderTarget)
  }
}
