import Tonic from '@socketsupply/tonic'

const sleep = t => new Promise(resolve => setTimeout(resolve, t))

export class HelloWorld extends Tonic {
  stylesheet () {
    return `
      hello-world {
        border: ${this.props.border};
      }
    `
  }

  async click () {
    //
    // Won't do anything on the server,
    // will work if rendered in the browser.
    //
  }

  async render () {
    await sleep(200)

    const {
      greetings,
      lang
    } = this.props

    return this.html`
      <h1>
        ${greetings[lang]}
        <time-stamp></time-stamp>
      </h1>
    `
  }
}
