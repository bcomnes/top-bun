import { html } from 'uhtml-isomorphic'

export default () => {
  return html`
    <div class="isomorphic-example">
      <h1>uhtml-isomorphic Example</h1>
      <p>This page is rendered using uhtml-isomorphic, which provides isomorphic rendering capabilities.</p>
      <p>The client-side JavaScript will hydrate this component.</p>
      <div class="counter-container">
        <h2>Interactive Counter</h2>
        <p>Counter value: <span class="counter-value">0</span></p>
        <button class="increment-button">Increment</button>
        <button class="decrement-button">Decrement</button>
      </div>
    </div>
  `
}
