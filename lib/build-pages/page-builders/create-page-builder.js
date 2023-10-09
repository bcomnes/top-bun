import { join } from 'path'
import pretty from 'pretty'
import { writeFile, mkdir } from 'fs/promises'

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
  return async ({
    src,
    dest,
    page,
    layouts,
    siteData,
    defaultVars,
    globalVars
  }) => {
    const pageVars = await resolveVars(page.pageVars ? page.pageVars.filepath : null)
    const { vars: builderVars, pageLayout } = await builder({ page })

    const pageDir = join(dest, page.path)
    const pageFile = join(pageDir, page.outputName)

    const finalVars = {
      siteData,
      page,
      ...defaultVars,
      ...globalVars,
      ...pageVars,
      ...builderVars
    }

    Object.assign({}, globalVars, pageVars, builderVars)

    const output = await pageLayout(finalVars)

    const layout = layouts[finalVars.layout]

    if (layout.layoutStylePath) {
      finalVars.styles.push(layout.layoutStylePath)
    }

    if (layout.layoutClientPath) {
      finalVars.scripts.push(layout.layoutClientPath)
    }

    if (page.pageStyle) {
      finalVars.styles.push(`./${page.pageStyle.outputName ?? page.pageStyle.basename}`)
    }
    if (page.clientBundle) {
      finalVars.scripts.push(`./${page.clientBundle.outputName ?? page.clientBundle.basename}`)
    }

    const pageOutput = await layout.render({
      ...finalVars,
      children: output
    })

    const formattedPageOutput = pretty(pageOutput)

    await mkdir(pageDir, { recursive: true })
    await writeFile(pageFile, formattedPageOutput)

    return { page: pageFile }
  }
}
