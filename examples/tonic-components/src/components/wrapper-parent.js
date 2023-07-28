import { Tonic } from '@socketsupply/tonic'

export class WrapperParent extends Tonic {
  render () {
    return this.html`
      <div class="wrapper">
          ${this.children}
      </div>
    `
  }
}
