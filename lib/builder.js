import { join, sep } from 'node:path'
import desm from 'desm'
import { identifyPages } from './identify-pages.js'
import { Transform } from 'streamx'
import cpx from 'cpx2'
import { promisify } from 'node:util'
import { writeFile, mkdir, readFile } from 'node:fs/promises'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'
import postcssUrl from 'postcss-url'

const copy = promisify(cpx.copy)

const __dirname = desm(import.meta.url)

const projectDir = join(__dirname, '..', 'test-project')
const srcDir = join(projectDir, 'src')
const outDir = join(projectDir, 'public')

async function resolveVars (varsPath) {
  if (!varsPath) return {}

  const { default: maybeVars } = await import(varsPath)

  if (typeof maybeVars === 'function') return maybeVars()
  return maybeVars
}

async function build (src, dest) {
  const siteData = await identifyPages(src)

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

async function buildGlobalCss (globalCSSPath, dest) {
  const css = await readFile(globalCSSPath)
  const targetPath = join(dest, 'global.css')
  const result = await postcss([
    postcssImport,
    postcssUrl({
      url: 'copy',
      useHash: true,
      assetsPath: 'assets'
    }),
    autoprefixer
  ]).process(css, { from: globalCSSPath, to: targetPath })

  await writeFile(targetPath, result.css)
  if (result.map) await writeFile(targetPath + '.map', result.map.toString())
}

async function buildCss (src, dest, siteData) {
  const styles = [siteData.globalStyle]

  for (const page of siteData.pages) {
    if (page.pageStyle) styles.push(page.pageStyle)
  }

  console.log(styles)
  return 'build css: wip`'
}

async function buildJs (src, dest, siteData) {
  return 'build js: Not implemented`'
}

function copyStaticAssets (src, dest) {
  const glob = `${src}/**/*.{png,svg,jpg,jpeg,pdf,mp4,mp3,json,gif}`
  return copy(glob, dest)
}

async function resolveLayout (layoutPath) {
  const { default: layout } = await import(layoutPath)

  return layout
}

async function buildPages (src, dest, siteData) {
  const [
    globalVars,
    rootLayout
  ] = await Promise.all([
    resolveVars(siteData.globalVars.filepath),
    resolveLayout(siteData.rootLayout.filepath)
  ])

  for (const page of siteData.pages) {
    switch (page.type) {
      case 'js': {
        const results = await buildJsPage({ src, dest, page, globalVars, rootLayout })
        console.log(results)
        break
      }
      default: {
        console.log(`skipping ${page.path}. unimplemented type ${page.type}`)
      }
    }
  }
}

function fsPathToUrlPath (fsPath) {
  return '/' + fsPath.split(sep).join('/')
}

async function buildJsPage ({ src, dest, page, globalVars, rootLayout }) {
  const pageVars = await resolveVars(page.pageVars ? page.pageVars.filepath : null)
  const { default: pageLayout, vars } = await import(page.page.filepath)

  const pageDir = join(dest, page.path)
  const pageFile = join(pageDir, 'index.html')

  const finalVars = Object.assign({}, globalVars, pageVars, vars)

  if (page.pageStyle) finalVars.styles = [fsPathToUrlPath(join(page.path, 'style.css'))]
  if (page.clientBundle) finalVars.scripts = [fsPathToUrlPath(join(page.path, 'client.js'))]

  const pageOutput = await rootLayout({
    ...finalVars,
    children: await pageLayout(finalVars)
  })

  await mkdir(pageDir, { recursive: true })
  await writeFile(pageFile, pageOutput)

  return { page: pageFile }
}

build(srcDir, outDir).then(() => { console.log('done') }).catch(console.error)
