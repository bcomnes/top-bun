import 'tonic-ssr'
import { MainComponent } from './client.js'

export default () => {
  return (new MainComponent({
    timestamp: 1611695921286
  })).preRender()
}
