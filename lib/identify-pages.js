import { asyncFolderWalker } from 'async-folder-walker'
import assert from 'node:assert'
import desm from 'desm'
import { resolve, relative, join } from 'path'
import { stat } from 'fs/promises'

const __dirname = desm(import.meta.url)

const layoutSuffix = '.layout.js'
const layoutClientSuffix = '.layout.client.js'
const layoutStyleSuffix = '.layout.css'
export const templateSuffix = '.template.js'

/**
 * identifyPages returns a bunch of data relating to pages that need to be built, and related file.
 * @param  {string} src The string path of the src folder of the website to build.
 * @return {object}     The object containing page info
 */
export async function identifyPages (src, pageBuilders, opts = {}) {
  assert(src, 'a src argument is required')
  assert(pageBuilders, 'a pageBuilders argument is required')
  const walker = asyncFolderWalker([src], {
    statFilter: st => !st.isDirectory(),
    ignore: opts.ignore,
    shaper: ({
      root,
      filepath,
      stat,
      relname,
      basename
    }) => ({
      root,
      filepath,
      stat,
      relname,
      basename,
      parentName: relname.slice(0, -(basename.length + 1))
    })
  })

  const dirs = {} // all files keyed by their parent dir relpath

  for await (const file of walker) {
    if (!dirs[file.parentName]) dirs[file.parentName] = {}
    dirs[file.parentName][file.basename] = file
  }

  const layouts = {}
  let pages = []
  const templates = []
  const warnings = []
  const errors = []
  const nonPageFolders = []

  for (const [dir, files] of Object.entries(dirs)) {
    // TODO: parametarize this to support other file formats.
    const jsPage = files['page.js']
    if (jsPage) jsPage.type = 'js'
    const htmlPage = files['page.html']
    if (htmlPage) htmlPage.type = 'html'
    const readmePage = files['README.md']
    if (readmePage) readmePage.type = 'md'

    const pageStyle = files['style.css']
    const clientBundle = files['client.js']
    const pageVars = files['page.vars.js']

    const conflict = jsPage && htmlPage // TODO: parametarize this

    if (conflict) {
      const err = new Error(`Conflicting page sources: The page ${dir} has two page sources (page.js and page.html). Pages only support one page type.`)
      err.type = 'page-conflict'
      errors.push(err)
    }

    const page = (conflict)
      ? null
      : jsPage || htmlPage || readmePage

    if (page) {
      pages.push({
        page,
        type: page.type,
        pageStyle,
        clientBundle,
        pageVars,
        path: dir,
        outputName: 'index.html',
        outputRelname: join(dir, 'index.html')
      })
    }

    if (!page && !conflict) nonPageFolders.push(dir)

    for (const [fileName, fileInfo] of Object.entries(files)) {
      // Render loose MD pages in place. No styles, no clients, no vars file.
      if (fileName.endsWith('.md') && fileName !== 'README.md') {
        pages.push({
          page: fileInfo,
          type: 'md',
          path: dir,
          outputName: fileInfo.basename.replace('.md', '.html')
        })
      }

      if (fileName.endsWith(layoutSuffix)) {
        const layoutName = fileName.slice(0, -layoutSuffix.length)

        if (layouts?.[layoutName]?.relname) {
          warnings.push({
            type: 'duplicate-layout',
            message: `Skipping ${fileInfo.relname}. Duplicate layout name ${layoutName} to ${layouts[layoutName].relname}`
          })
        } else {
          layouts[layoutName] = fileInfo
          layouts[layoutName].layoutName = layoutName
        }
      }

      if (fileName.endsWith(layoutStyleSuffix)) {
        const layoutStyleName = fileName.slice(0, -layoutStyleSuffix.length)

        if (layouts?.[layoutStyleName]?.layoutStyle) {
          warnings.push({
            type: 'duplicate-layout-style',
            message: `Skipping ${fileInfo.relname}. Duplicate layout style name ${layoutStyleName} to ${layouts[layoutStyleName].layoutStyle.relname}`
          })
        } else {
          if (layouts[layoutStyleName]) {
            layouts[layoutStyleName].layoutStyle = fileInfo
          } else {
            layouts[layoutStyleName] = {
              layoutStyle: fileInfo
            }
          }
        }
      }

      if (fileName.endsWith(layoutClientSuffix)) {
        const layoutClientName = fileName.slice(0, -layoutClientSuffix.length)

        if (layouts?.[layoutClientName]?.layoutClient) {
          warnings.push({
            type: 'duplicate-layout-client',
            message: `Skipping ${fileInfo.relname}. Duplicate layout client name ${layoutClientName} to ${layouts[layoutClientName].layoutClient.relname}`
          })
        } else {
          if (layouts[layoutClientName]) {
            layouts[layoutClientName].layoutClient = fileInfo
          } else {
            layouts[layoutClientName] = {
              layoutClient: fileInfo
            }
          }
        }
      }

      if (fileName.endsWith(templateSuffix)) {
        const temlateFileName = fileName.slice(0, -templateSuffix.length)

        templates.push({
          template: fileInfo,
          path: dir,
          outputName: temlateFileName
        })
      }
    }
  }

  // Inject global lauouts and vars
  const rootFiles = dirs['']

  if (!layouts.root) {
    warnings.push({
      type: 'no-root-layout',
      message: 'Missing a root.layout.js file. Using default layout file.'
    })

    const defaultLayoutBasename = 'default.root.layout.js'
    const defaultLayoutFilepath = resolve(__dirname, `./defaults/${defaultLayoutBasename}`)
    const defaultLayoutRelpath = relative(src, defaultLayoutFilepath)
    layouts.root = {
      filepath: defaultLayoutFilepath,
      stat: await stat(defaultLayoutFilepath),
      relname: defaultLayoutRelpath,
      basename: defaultLayoutBasename,
      parentName: defaultLayoutRelpath.slice(0, -(defaultLayoutBasename.length + 1)),
      layoutName: 'root'
    }
  }

  // TODO: maybe formalize this in identify pages later
  pages = pages.filter(p => {
    if (pageBuilders[p.type]) return true
    else {
      warnings.push({
        type: 'unknown-page-builder',
        message: `Skipping ${p.path}. Unimplemented type ${p.type}`
      })
    }
    return false
  })

  const results = {
    type: 'siteData',
    globalStyle: rootFiles['global.css'],
    globalClient: rootFiles['global.client.js'],
    globalVars: rootFiles['global.vars.js'],
    layouts,
    templates,
    pages,
    warnings,
    errors,
    nonPageFolders
    // allFiles: dirs
  }

  return results
}
