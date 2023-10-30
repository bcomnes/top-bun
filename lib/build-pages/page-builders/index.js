import { mdBuilder } from './md/index.js'
import { jsBuilder } from './js/index.js'
import { htmlBuilder } from './html/index.js'
export { templateBuilder } from './template-builder.js'

export const pageBuilders = {
  md: mdBuilder,
  js: jsBuilder,
  html: htmlBuilder
}
