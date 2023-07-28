import Tonic from '@socketsupply/tonic'

export class TimeStamp extends Tonic {
  render () {
    return this.html`
      <time>
        Tue Jan 26 22:18:05 CET 2021
      </time>
    `
  }
}
