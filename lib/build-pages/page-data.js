import { resolveVars } from './resolve-vars.js'
import { pageBuilders } from './page-builders/index.js'
import pretty from 'pretty'

export class PageData {
  constructor ({
    page,
    globalVars,
    globalStyle,
    globalClient
  }) {
    this.page = page
    this.layout = null
    this.globalVars = globalVars
    this.pageVars = null
    this.builderVars = null
    this.styles = []
    this.scripts = []

    if (globalStyle) {
      this.styles.push(`/${globalStyle}`)
    }
    if (globalClient) {
      this.scripts.push(`/${globalClient}`)
    }

    this._intialized = false
  }

  get vars () {
    if (!this._intialized) throw new Error('Initialize PageData before accessing vars')
    const { globalVars, pageVars, builderVars } = this
    return {
      ...globalVars,
      ...pageVars,
      ...builderVars
    }
  }

  async init ({ layouts }) {
    if (this._intialized) return
    const { page, globalVars } = this
    const { pageVars, type } = page
    this.pageVars = await resolveVars(pageVars ? pageVars.filepath : null)
    const builder = pageBuilders[type]
    const { vars: builderVars } = await builder({ page })
    this.builderVars = builderVars

    const finalVars = {
      ...globalVars,
      ...pageVars,
      ...builderVars
    }

    this.layout = layouts[finalVars.layout]

    if (this.layout.layoutStylePath) {
      this.styles.push(this.layout.layoutStylePath)
    }

    if (this.layout.layoutClientPath) {
      this.scripts.push(this.layout.layoutClientPath)
    }

    if (this.page.pageStyle) {
      this.styles.push(`./${this.page.pageStyle.outputName}`)
    }
    if (this.page.clientBundle) {
      this.scripts.push(`./${this.page.clientBundle.outputName}`)
    }

    this._intialized = true
  }

  async renderInnerPage ({ pages }) {
    const { page, styles, scripts, vars } = this
    const builder = pageBuilders[page.type]
    const { pageLayout } = await builder({ page })
    return pretty(await pageLayout({ vars, styles, scripts, pages }))
  }

  async renderFullPage ({ pages }) {
    const { page, layout, vars, styles, scripts } = this
    const innerPage = await this.renderInnerPage({ pages })

    return pretty(
      await layout.render({
        vars,
        styles,
        scripts,
        page,
        pages,
        children: innerPage
      })
    )
  }
}
