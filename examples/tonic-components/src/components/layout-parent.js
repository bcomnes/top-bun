import Tonic from '@socketsupply/tonic'

export class ParentComponent extends Tonic {
  render () {
    return this.html`
      <div class="parent">
          ${this.children}
      </div>
    `
  }
}
