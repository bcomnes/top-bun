import { join, sep } from 'node:path'
import desm from 'desm'
import { identifyPages } from './identify-pages.js'
import cpx from 'cpx2'
import { promisify } from 'node:util'
import { writeFile, mkdir, readFile } from 'node:fs/promises'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'
import postcssUrl from 'postcss-url'
import esbuild from 'esbuild'
import assert from 'webassert'
import yaml from 'js-yaml'
import pretty from 'pretty'

import markdownIt from 'markdown-it'
import markdownItSub from 'markdown-it-sub'
import markdownItSup from 'markdown-it-sup'
import markdownItFootnote from 'markdown-it-footnote'
import markdownItDeflist from 'markdown-it-deflist'
import markdownItEmoji from 'markdown-it-emoji'
import markdownItIns from 'markdown-it-ins'
import markdownItMark from 'markdown-it-mark'
import markdownItAbbr from 'markdown-it-abbr'
import markdownItHighlightjs from 'markdown-it-highlightjs'

const copy = promisify(cpx.copy)

const __dirname = desm(import.meta.url)

const projectDir = join(__dirname, '..', 'test-project')
const srcDir = join(projectDir, 'src')
const outDir = join(projectDir, 'public')

/**
 * Resolve vars imports a vars file
 * @param  {[type]} varsPath [description]
 * @return {[type]}          [description]
 */
async function resolveVars (varsPath) {
  if (!varsPath) return {}

  const { default: maybeVars } = await import(varsPath)

  if (typeof maybeVars === 'function') return maybeVars()
  return maybeVars
}

/**
 * Build the site
 * @param  {[type]} src  [description]
 * @param  {[type]} dest [description]
 * @return {[type]}      [description]
 */
async function build (src, dest) {
  const siteData = await identifyPages(src)

  // TODO: maybe formalize this in identify pages later
  siteData.pages = siteData.pages.filter(p => {
    if (builders[p.type]) return true
    else console.log(`skipping ${p.path}. unimplemented type ${p.type}`)
    return false
  })

  await ensureDest(src, dest, siteData)

  const [
    copyStaticAssetsResults,
    buildPagesResults,
    buildCssResults,
    buildJsResults
  ] = await Promise.all([
    copyStaticAssets(srcDir, outDir),
    buildPages(src, dest, siteData),
    buildCss(src, dest, siteData),
    buildJs(src, dest, siteData)
  ])

  console.log({
    copyStaticAssetsResults,
    buildPagesResults,
    buildCssResults,
    buildJsResults
  })
}

/**
 * Create folders for each page
 * @param  {[type]} src      [description]
 * @param  {[type]} dest     [description]
 * @param  {[type]} siteData [description]
 * @return {[type]}          [description]
 */
async function ensureDest (src, dest, siteData) {
  await mkdir(dest, { recursive: true })

  for (const page of siteData.pages) {
    await mkdir(join(dest, page.path), { recursive: true })
  }
}

/**
 * Build all of the CSS for every page and global CSS
 * @param  {[type]} src      [description]
 * @param  {[type]} dest     [description]
 * @param  {[type]} siteData [description]
 * @return {[type]}          [description]
 */
async function buildCss (src, dest, siteData) {
  const styles = [siteData.globalStyle]

  for (const page of siteData.pages) {
    if (page.pageStyle) styles.push(page.pageStyle)
  }

  const results = []
  for (const style of styles) {
    const css = await readFile(style.filepath)
    const targetPath = join(dest, style.relname)
    const result = await postcss([
      postcssImport,
      postcssUrl({
        url: 'copy',
        useHash: true,
        assetsPath: 'assets'
      }),
      autoprefixer
    ]).process(css, { from: style.relname, to: targetPath })
    await writeFile(targetPath, result.css)
    if (result.map) await writeFile(targetPath + '.map', result.map.toString())
    results.push(result)
  }
  return results
}

/**
 * Build all of the bundles
 * @param  {[type]} src      [description]
 * @param  {[type]} dest     [description]
 * @param  {[type]} siteData [description]
 * @return {[type]}          [description]
 */
async function buildJs (src, dest, siteData) {
  const entryPoints = []

  for (const page of siteData.pages) {
    if (page.clientBundle) entryPoints.push(join(src, page.clientBundle.relname))
  }

  const results = await esbuild.build({
    entryPoints: entryPoints,
    bundle: true,
    write: true,
    format: 'esm',
    splitting: true,
    outdir: dest,
    target: [
      'es2020'
    ]
  })

  return results
}

/**
 * run CPX2 on src folder
 * @param  {[type]} src  [description]
 * @param  {[type]} dest [description]
 * @return {[type]}      [description]
 */
function copyStaticAssets (src, dest) {
  const glob = `${src}/**/*.{png,svg,jpg,jpeg,pdf,mp4,mp3,json,gif}`
  return copy(glob, dest)
}

/**
 * layout resolve code
 * @param  {[type]} layoutPath [description]
 * @return {[type]}            [description]
 */
async function resolveLayout (layoutPath) {
  const { default: layout } = await import(layoutPath)

  return layout
}

/**
 * Page builder glue. Most of the magic happens in the builders
 * @param  {[type]} src      [description]
 * @param  {[type]} dest     [description]
 * @param  {[type]} siteData [description]
 * @return {[type]}          [description]
 */
async function buildPages (src, dest, siteData) {
  const [
    globalVars,
    rootLayout
  ] = await Promise.all([
    resolveVars(siteData.globalVars.filepath),
    resolveLayout(siteData.rootLayout.filepath)
  ])

  const results = []
  for (const page of siteData.pages) {
    const builder = builders[page.type]
    // This should never happen
    if (!builder) throw new Error(`Can't build ${page.path}. unimplemented type ${page.type}`)

    const result = await builder({ src, dest, page, globalVars, rootLayout })
    results.push(result)
  }

  return results
}

/**
 * Convert a path to a URL for the site.
 * @param  {[type]} fsPath [description]
 * @return {[type]}        [description]
 */
function fsPathToUrlPath (fsPath) {
  return '/' + fsPath.split(sep).join('/')
}

function createPageBuilder (builder) {
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
    const pageFile = join(pageDir, 'index.html')

    const finalVars = Object.assign({}, globalVars, pageVars, vars)

    if (page.pageStyle) finalVars.styles = [fsPathToUrlPath(join(page.path, 'style.css'))]
    if (page.clientBundle) finalVars.scripts = [fsPathToUrlPath(join(page.path, 'client.js'))]

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

async function jsBuilder ({ page }) {
  assert(page.type === 'js', 'js page builder requries "js" page type')
  // TODO: do I need to eval this or something? or put a qs on this
  const { default: pageLayout, vars } = await import(page.page.filepath)
  assert(pageLayout, 'js pages must export a page layout default export')

  return { vars, pageLayout }
}

const buildJsPage = createPageBuilder(jsBuilder)

async function mdBuilder ({ page }) {
  assert(page.type === 'md', 'md builder requires an "md" page type')
  const fileContents = await readFile(page.page.filepath, 'utf8')

  let frontMatter
  let mdUnparsed
  if (fileContents.trim().startsWith('---')) {
    const [/* _ */, frontMatterUnparsed, ...mdParts] = fileContents.split('---')
    mdUnparsed = mdParts.join('---')
    frontMatter = yaml.load(frontMatterUnparsed)
  } else {
    frontMatter = {}
    mdUnparsed = fileContents
  }

  const mdOpts = {
    html: true,
    linkify: true,
    typographer: true
  }

  const md = markdownIt(mdOpts)
    .use(markdownItSub)
    .use(markdownItSup)
    .use(markdownItFootnote)
    .use(markdownItDeflist)
    .use(markdownItEmoji)
    .use(markdownItIns)
    .use(markdownItMark)
    .use(markdownItAbbr)
    .use(markdownItHighlightjs, { auto: false, code: true })

  // disable autolinking for filenames
  md.linkify.tlds('.md', false) // markdown

  return {
    vars: frontMatter,
    pageLayout: (vars) => md.render(mdUnparsed)
  }
}

const buildMdPage = createPageBuilder(mdBuilder)

async function htmlBuilder ({ page }) {
  assert(page.type === 'html', 'html builder requires a "html" page type')

  const fileContents = await readFile(page.page.filepath, 'utf8')

  return {
    vars: {},
    pageLayout: vars => fileContents
  }
}

const buildHtmlPage = createPageBuilder(htmlBuilder)

/**
 * Object of bulder functions
 */
const builders = {
  html: buildHtmlPage,
  md: buildMdPage,
  js: buildJsPage
}

build(srcDir, outDir).then(() => { console.log('done') }).catch(console.error)
