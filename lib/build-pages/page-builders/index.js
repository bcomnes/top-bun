import { mdBuilder } from './md/index.js'
import { jsBuilder } from './js/index.js'
import { htmlBuilder } from './html/index.js'
import { createPageBuilder } from './create-page-builder.js'

export const pageBuilders = {
  md: createPageBuilder(mdBuilder),
  js: createPageBuilder(jsBuilder),
  html: createPageBuilder(htmlBuilder)
}
