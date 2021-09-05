import { join } from 'node:path'
import pretty from 'pretty'
import { writeFile, mkdir } from 'node:fs/promises'

import { resolveVars } from '../resolve-vars.js'

export function createPageBuilder (builder) {
  /**
   * Page builder
   * @param  {[type]} options.src        [description]
   * @param  {[type]} options.dest       [description]
   * @param  {[type]} options.page       [description]
   * @param  {[type]} options.globalVars [description]
   * @param  {[type]} options.rootLayout [description]
   * @return {[type]}                    [description]
   */
  return async ({ src, dest, page, globalVars, rootLayout }) => {
    const pageVars = await resolveVars(page.pageVars ? page.pageVars.filepath : null)
    const { vars, pageLayout } = await builder({ page })

    const pageDir = join(dest, page.path)
    const pageFile = join(pageDir, page.outputName)

    const finalVars = Object.assign({}, globalVars, pageVars, vars)

    if (page.pageStyle) finalVars.styles.push('./style.css')
    if (page.clientBundle) finalVars.scripts.push('./client.js')

    const output = await pageLayout(finalVars)

    const pageOutput = await rootLayout({
      ...finalVars,
      children: output
    })

    const formattedPageOutput = pretty(pageOutput)

    await mkdir(pageDir, { recursive: true })
    await writeFile(pageFile, formattedPageOutput)

    return { page: pageFile }
  }
}
