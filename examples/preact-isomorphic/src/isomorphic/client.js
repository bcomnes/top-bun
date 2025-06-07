/**
 * Preact Isomorphic Example
 * 
 * This file demonstrates a todo application that works with both:
 * 1. Server-side rendering (when imported by page.js)
 * 2. Client-side hydration (when loaded in the browser)
 * 
 * It uses the same component code for both environments.
 */
import { html, Component } from 'htm/preact'
import { render } from 'preact'
import { useCallback, useState } from 'preact/hooks'
import { useSignal, useComputed } from '@preact/signals'

/**
 * App Header Component
 * Displays the title of the application
 */
const Header = ({ name, subtitle }) => html`
  <header class="app-header">
    <h1>${name}</h1>
    ${subtitle && html`<p class="subtitle">${subtitle}</p>`}
  </header>
`

/**
 * Todo Item Component
 * Renders a single todo item with completion toggle
 */
const TodoItem = ({ text, completed, onToggle, onDelete }) => html`
  <li class="todo-item ${completed ? 'completed' : ''}">
    <label class="todo-label">
      <input 
        type="checkbox" 
        checked=${completed} 
        onChange=${onToggle}
      />
      <span class="todo-text">${text}</span>
    </label>
    <button class="delete-btn" onClick=${onDelete}>Delete</button>
  </li>
`

/**
 * Counter Component using Signals
 * Demonstrates Preact Signals for reactive state management
 */
const Counter = () => {
  // Create a signal for the count value
  const count = useSignal(0)
  
  // Derived state that automatically updates when count changes
  const doubled = useComputed(() => count.value * 2)
  const isEven = useComputed(() => count.value % 2 === 0)
  
  // Event handlers
  const increment = useCallback(() => { count.value++ }, [])
  const decrement = useCallback(() => { count.value > 0 && count.value-- }, [])
  const reset = useCallback(() => { count.value = 0 }, [])
  
  return html`
    <div class="counter-widget">
      <h3>Signal-based Counter</h3>
      <div class="counter-display ${isEven.value ? 'even' : 'odd'}">
        <span>Count: <strong>${count}</strong></span>
        <span>Doubled: <strong>${doubled}</strong></span>
      </div>
      <div class="counter-controls">
        <button onClick=${decrement}>-</button>
        <button onClick=${reset}>Reset</button>
        <button onClick=${increment}>+</button>
      </div>
    </div>
  `
}

/**
 * Todo Application Component
 * Manages a list of todos with add/toggle/delete functionality
 */
class TodoApp extends Component {
  constructor(props) {
    super(props)
    // Initialize with example todos
    this.state = {
      todos: [
        { id: 1, text: 'Learn about SSR', completed: true },
        { id: 2, text: 'Build isomorphic apps', completed: false },
        { id: 3, text: 'Deploy to production', completed: false }
      ],
      newTodo: ''
    }
  }
  
  // Update the new todo input value
  updateNewTodo = (e) => {
    this.setState({ newTodo: e.target.value })
  }
  
  // Add a new todo item
  addTodo = (e) => {
    e.preventDefault()
    const { todos, newTodo } = this.state
    
    if (newTodo.trim()) {
      this.setState({ 
        todos: [
          ...todos, 
          { 
            id: Date.now(), 
            text: newTodo, 
            completed: false 
          }
        ],
        newTodo: ''
      })
    }
  }
  
  // Toggle a todo's completion status
  toggleTodo = (id) => {
    const { todos } = this.state
    this.setState({
      todos: todos.map(todo => 
        todo.id === id 
          ? { ...todo, completed: !todo.completed } 
          : todo
      )
    })
  }
  
  // Delete a todo item
  deleteTodo = (id) => {
    const { todos } = this.state
    this.setState({
      todos: todos.filter(todo => todo.id !== id)
    })
  }

  render({ title }, { todos, newTodo }) {
    const remaining = todos.filter(todo => !todo.completed).length
    
    return html`
      <div class="todo-app">
        <${Header} 
          name=${title || "Todo App"} 
          subtitle="Server + Client Rendering Example"
        />
        
        <form class="todo-form" onSubmit=${this.addTodo}>
          <input
            type="text"
            value=${newTodo}
            onInput=${this.updateNewTodo}
            placeholder="Add a new task..."
          />
          <button type="submit">Add</button>
        </form>
        
        <ul class="todo-list">
          ${todos.map(todo => html`
            <${TodoItem}
              key=${todo.id}
              text=${todo.text}
              completed=${todo.completed}
              onToggle=${() => this.toggleTodo(todo.id)}
              onDelete=${() => this.deleteTodo(todo.id)}
            />
          `)}
        </ul>
        
        <div class="todo-stats">
          <span>${remaining} item${remaining !== 1 ? 's' : ''} remaining</span>
        </div>
        
        <${Counter} />
      </div>
    `
  }
}

/**
 * Main page export for both server and client rendering
 * This is what gets rendered in both environments
 */
export const page = () => html`
  <div class="isomorphic-container">
    <${TodoApp} title="Isomorphic Todo App" />
    
    <div class="info-panel">
      <h2>How This Works</h2>
      <p>
        This page is rendered on the server first, then hydrated on the client.
        The same component code runs in both environments.
      </p>
      <p>
        Try adding todos and toggling them. These interactions are handled
        by client-side JavaScript, but the initial HTML comes from the server.
      </p>
    </div>
  </div>
`

/**
 * Client-side only code
 * This code only runs in the browser, not during server rendering
 */
if (typeof window !== 'undefined') {
  // Find the container that was server-rendered
  const renderTarget = document.querySelector('.app-main')
  
  // Hydrate the existing HTML with interactive components
  if (renderTarget) {
    render(page(), renderTarget)
    console.log('✅ Preact isomorphic app successfully hydrated')
  }
}
