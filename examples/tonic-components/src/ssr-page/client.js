import { Tonic } from '@socketsupply/tonic'
import { TimeStamp } from '../components/time-stamp.js'
import { HelloWorld } from '../components/hello-world.js'

export class MainComponent extends Tonic {
  constructor (props) {
    super()
    this.props = props
  }

  render () {
    const greetings = { en: 'Hello' }

    return this.html`
      <header>
        ${String(this.props.timestamp)}
      </header>

      <main>
        <hello-world
          id="hello"
          lang="en"
          border="1px solid red"
          greetings="${greetings}"
        >
        </hello-world>
      </main>

      <footer>
      </footer>
    `
  }
}

Tonic.add(TimeStamp)
Tonic.add(HelloWorld)
Tonic.add(MainComponent)
