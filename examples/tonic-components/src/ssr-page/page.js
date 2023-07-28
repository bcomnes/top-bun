import 'tonic-ssr'
import { MainComponent } from './client.js'
import jsdom from 'jsdom'

const { JSDOM } = jsdom

const page = await (new MainComponent({
  timestamp: 1611695921286
})).preRender()

console.log({ page })

const dom = new JSDOM(`<!DOCTYPE html>${page}`)

const body = dom.window.document.querySelector('body')
const head = dom.window.document.querySelector('head')

export default () => `<main-component>${body.innerHTML}</main-component>`

export const vars = {
  head: head.innerHTML
}
