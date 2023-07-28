import Tonic from '@socketsupply/tonic'

export class ChildComponent extends Tonic {
  render () {
    return this.html`
      <div class="child">
        ${this.props.value}
      </div>
    `
  }
}
