import { resolveVars } from './resolve-vars.js'
import { pageBuilders } from './page-builders/index.js'
// @ts-ignore
import pretty from 'pretty'

/**
 * @typedef {import('../identify-pages.js').PageInfo} PageInfo
 * @typedef {import('../builder.js').SiteData} SiteData
 */

/**
 * @template T
 * @typedef {import('./index.js').ResolvedLayout<T>} ResolvedLayout
 */

/**
 * Represents the data for a page.
 * @template T extends object
 */
export class PageData {
  /** @type {PageInfo} */ pageInfo
  /** @type {ResolvedLayout<T> | null | undefined} */ layout
  /** @type {object} */ globalVars
  /** @type {object?} */ pageVars = null
  /** @type {object?} */ builderVars = null
  /** @type {string[]} */ styles = []
  /** @type {string[]} */ scripts = []
  /** @type {boolean} */ #initalized = false

  /**
   * Creates an instance of PageData.
   *
   * @param {object} options - The options object.
   * @param {PageInfo} options.pageInfo - Page-specific data.
   * @param {object} options.globalVars - Global variables available to all pages.
   * @param {string | undefined} options.globalStyle - Global style path.
   * @param {string | undefined} options.globalClient - Global client-side script path.
   */
  constructor ({
    pageInfo,
    globalVars,
    globalStyle,
    globalClient
  }) {
    this.pageInfo = pageInfo
    this.globalVars = globalVars

    if (globalStyle) {
      this.styles.push(`/${globalStyle}`)
    }
    if (globalClient) {
      this.scripts.push(`/${globalClient}`)
    }
  }

  /**
   * Returns the fully resolved variable set for the page. Requires initialization.
   * @return {T} globalVars, pageVars, and buildVars merged together
   */
  get vars () {
    if (!this.#initalized) throw new Error('Initialize PageData before accessing vars')
    const { globalVars, pageVars, builderVars } = this
    // @ts-ignore
    return {
      ...globalVars,
      ...pageVars,
      ...builderVars
    }
  }

  /**
   * [init description]
   * @param  {object} params - Parameters required to initialize
   * @param  {Record<string,ResolvedLayout<T>>} params.layouts - The array of ResolvedLayouts
   */
  async init ({ layouts }) {
    if (this.#initalized) return
    const { pageInfo, globalVars } = this
    if (!pageInfo) throw new Error('A page is required to initialize')
    const { pageVars, type } = pageInfo
    this.pageVars = await resolveVars(pageVars?.filepath)
    const builder = pageBuilders[type]
    const { vars: builderVars } = await builder({ pageInfo })
    this.builderVars = builderVars

    /** @type {object} */
    const finalVars = {
      ...globalVars,
      ...this.pageVars,
      ...builderVars
    }

    if (!('layout' in finalVars)) throw new Error('Page variables missing a layout var')
    if (typeof finalVars.layout !== 'string') throw new Error('Layout variable must be a string')

    this.layout = layouts[finalVars.layout]
    if (!this.layout) throw new Error('Unable to resolve a layout')

    if (this.layout.layoutStylePath) {
      this.styles.push(this.layout.layoutStylePath)
    }

    if (this.layout.layoutClientPath) {
      this.scripts.push(this.layout.layoutClientPath)
    }

    if (pageInfo.pageStyle) {
      this.styles.push(`./${pageInfo.pageStyle.outputName}`)
    }
    if (pageInfo.clientBundle) {
      this.scripts.push(`./${pageInfo.clientBundle.outputName}`)
    }

    this.#initalized = true
  }

  /**
   * Render the inner contents of a page.
   * @param  {object} params The params required to render the page
   * @param  {PageData<T>[]} params.pages An array of initialized PageDatas.
   */
  async renderInnerPage ({ pages }) {
    if (!this.#initalized) throw new Error('Must be initialized before rendering pages')
    const { pageInfo, styles, scripts, vars } = this
    if (!pageInfo) throw new Error('A page is required to render')
    const builder = pageBuilders[pageInfo.type]
    const { pageLayout } = await builder({ pageInfo })
    // @ts-ignore
    return await pageLayout({ vars, styles, scripts, pages, page: pageInfo })
  }

  /**
   * Render the full contents of a page with its layout
   * @param  {object} params The params required to render the page
   * @param  {PageData<T>[]} params.pages An array of initialized PageDatas.
   */
  async renderFullPage ({ pages }) {
    if (!this.#initalized) throw new Error('Must be initialized before rendering pages')
    const { pageInfo, layout, vars, styles, scripts } = this
    if (!pageInfo) throw new Error('A page is required to render')
    if (!layout) throw new Error('A layout is required to render')
    const innerPage = await this.renderInnerPage({ pages })

    return pretty(
      await layout.render({
        vars,
        styles,
        scripts,
        page: pageInfo,
        pages,
        children: innerPage
      })
    )
  }
}
