import { asyncFolderWalker } from 'async-folder-walker'
import assert from 'node:assert'
import desm from 'desm'
import { resolve, relative, join } from 'path'
import { pageBuilders } from './build-pages/index.js'
import { TopBunDuplicatePageError } from './helpers/top-bun-error.js'

/**
 * @typedef {import('./builder.js').TopBunOpts} TopBunOpts
 * @typedef {import('fs').Stats} Stats
 * @typedef {import('async-folder-walker').FWStats} FWStats
 * @typedef {import('./helpers/top-bun-warning.js').TopBunWarning} TopBunWarning
 */

const __dirname = desm(import.meta.url)

const layoutSuffix = '.layout.js'
const layoutClientSuffix = '.layout.client.js'
const layoutStyleSuffix = '.layout.css'
export const templateSuffix = '.template.js'

/**
 * Shape the file walker object
 *
 * @param {FWStats} param - The file stats.
 */
const shaper = ({
  root,
  filepath,
  /* stat, */
  relname,
  basename
}) => ({
  root,
  filepath,
  relname,
  basename,
  parentName: relname.slice(0, -(basename.length + 1))
})

/**
 * @typedef {ReturnType<typeof shaper>} WalkerFile
 */

/**
  * @typedef {WalkerFile & Partial<{
  *            outputRelname: string,
  *            outputName: string,
  *            }>} PageFileAsset
  */

/**
  * @typedef {WalkerFile & { layoutName: string } & Partial<{
  *            layoutStyle: PageFileAsset,
  *            layoutClient: PageFileAsset
  *            }>} Layout
  */

/**
 * @typedef {'js' | 'md' | 'html'} PageTypes
 */

/**
 * @typedef {WalkerFile & {
 *   type?: PageTypes
 * }} PageFile
 */

/**
 * @typedef PageInfo
 * @property {PageFile} pageFile - The main page data.
 * @property {PageTypes} type - The type of the page.
 * @property {PageFileAsset | undefined} [pageStyle] - The style of the page. (Replace 'any' with the appropriate type if known.)
 * @property {PageFileAsset | undefined} [clientBundle] - The client bundle for the page. (Replace 'any' with the appropriate type if known.)
 * @property {PageFileAsset | undefined} [pageVars] - The variables associated with the page. (Replace 'any' with the appropriate type if known.)
 * @property {string} path - The directory path for the page.
 * @property {string} outputName - The name of the output file.
 * @property {string} outputRelname - The relative name/path for the output file.
 */

/**
 * @typedef TemplateInfo
 * @property {WalkerFile} templateFile - The template file info.
 * @property {string} path - The the path of the parent dir of the template
 * @property {string} outputName - The derived output name of the template file. Might be overriden.
 */

/**
 * Identifies the pages, layouts, templates, and other relevant data from a given source directory.
 *
 * @async
 * @function
 * @export
 * @param {string} src - The source directory to identify pages from.
 * @param {object} [opts={}] - Options to modify the behavior of the function.
 * @param {string[]?} [opts.ignore] - Array of file/folder patterns to ignore during the walk.
 * @throws When the `src` argument is not provided or something else goes wrong.
 */
export async function identifyPages (src, opts = {}) {
  assert(src, 'a src argument is required')

  const walker = asyncFolderWalker([src], {
    statFilter: st => !st.isDirectory(),
    ignore: opts?.ignore ?? [],
    shaper
  })

  /**
   * @type {{ [parentName: string]: { [basename: string]: WalkerFile } }}
   */
  const dirs = {} // all files keyed by their parent dir relpath

  for await (const file of walker) {
    const dir = dirs[file.parentName]
    if (!dir) {
      dirs[file.parentName] = {
        [file.basename]: file
      }
    } else {
      dir[file.basename] = file
    }
  }

  /** @type {{ [layoutName: string]: Layout }} */
  const layouts = {}

  /** @type {PageInfo[]} */
  let pages = []

  /** @type {TemplateInfo[]} The array of discovered template files */
  const templates = []

  /** @type {TopBunWarning[]} */
  const warnings = []

  /** @type {Error[]} */
  const errors = []

  /** @type {string[]} */
  // const nonPageFolders = []

  for (const [dir, files] of Object.entries(dirs)) {
    /** @type {PageFile | undefined } */
    const jsPage = files['page.js']
    if (jsPage) jsPage.type = 'js'
    /** @type {PageFile | undefined} */
    const htmlPage = files['page.html']
    if (htmlPage) htmlPage.type = 'html'
    /** @type {PageFile | undefined} */
    const readmePage = files['README.md']
    if (readmePage) readmePage.type = 'md'

    const pageStyle = files['style.css']
    const clientBundle = files['client.js']
    const pageVars = files['page.vars.js']

    const conflict = jsPage && htmlPage

    if (conflict) {
      const err = new TopBunDuplicatePageError(
        'Conflicting page sources: The page has two page sources. Pages only support one page type.',
        {
          a: join(dir, 'page.js'),
          b: join(dir, 'page.html')
        }
      )
      errors.push(err)
    }

    const page = (conflict)
      ? null
      : jsPage || htmlPage || readmePage

    if (page && page.type) {
      pages.push({
        pageFile: page,
        type: page.type,
        pageStyle,
        clientBundle,
        pageVars,
        path: dir,
        outputName: 'index.html',
        outputRelname: join(dir, 'index.html')
      })
    }

    // if (!page && !conflict) nonPageFolders.push(dir)

    for (const [fileName, fileInfo] of Object.entries(files)) {
      // Render loose MD pages in place. No styles, no clients, no vars file.
      if (fileName.endsWith('.md') && fileName !== 'README.md') {
        const outputName = fileInfo.basename.replace('.md', '.html')
        pages.push({
          pageFile: fileInfo,
          type: 'md',
          path: dir,
          outputName,
          outputRelname: join(dir, outputName)
        })
      }

      if (fileName.endsWith(layoutSuffix)) {
        const layoutName = fileName.slice(0, -layoutSuffix.length)

        if (layouts?.[layoutName]?.relname) {
          warnings.push(
            /** @type {TopBunWarningCode} */
            {
              code: 'TOP_BUN_WARNING_DUPLICATE_LAYOUT',
              message: `Skipping ${fileInfo.relname}. Duplicate layout name ${layoutName} to ${layouts?.[layoutName]?.relname}`
            })
        } else {
          layouts[layoutName] = { ...fileInfo, layoutName }
        }
      }

      if (fileName.endsWith(layoutStyleSuffix)) {
        const layoutStyleName = fileName.slice(0, -layoutStyleSuffix.length)

        if (layouts?.[layoutStyleName]?.layoutStyle) {
          warnings.push({
            code: 'TOP_BUN_WARNING_DUPLICATE_LAYOUT_STYLE',
            message: `Skipping ${fileInfo.relname}. Duplicate layout style name ${layoutStyleName} to ${layouts?.[layoutStyleName]?.layoutStyle?.relname}`
          })
        } else {
          const layout = layouts[layoutStyleName]
          if (layout) {
            layout.layoutStyle = fileInfo
          } else {
            warnings.push({
              code: 'TOP_BUN_WARNING_ORPHANED_LAYOUT_STYLE',
              message: `Skipping ${fileInfo.relname}. A layout style ${layoutStyleName} was found without a matching layout`
            })
          }
        }
      }

      if (fileName.endsWith(layoutClientSuffix)) {
        const layoutClientName = fileName.slice(0, -layoutClientSuffix.length)

        if (layouts?.[layoutClientName]?.layoutClient) {
          warnings.push({
            code: 'TOP_BUN_WARNING_DUPLICATE_LAYOUT_CLIENT',
            message: `Skipping ${fileInfo.relname}. Duplicate layout client name ${layoutClientName} to ${layouts?.[layoutClientName]?.layoutClient?.relname}`
          })
        } else {
          const layout = layouts[layoutClientName]
          if (layout) {
            layout.layoutClient = fileInfo
          } else {
            warnings.push({
              code: 'TOP_BUN_WARNING_ORPHANED_LAYOUT_CLIENT',
              message: `Skipping ${fileInfo.relname}. A layout client ${layoutClientName} was found without a matching layout`
            })
          }
        }
      }

      if (fileName.endsWith(templateSuffix)) {
        const temlateFileName = fileName.slice(0, -templateSuffix.length)

        templates.push({
          templateFile: fileInfo,
          path: dir,
          outputName: temlateFileName
        })
      }
    }
  }

  // Inject global lauouts and vars
  const rootFiles = dirs[''] ?? {}

  let defaultLayout = false
  // eslint-disable-next-line dot-notation
  if (!layouts['root']) {
    warnings.push({
      code: 'TOP_BUN_WARNING_NO_ROOT_LAYOUT',
      message: 'Missing a root.layout.js file. Using default layout file.'
    })
    defaultLayout = true

    const defaultLayoutBasename = 'default.root.layout.js'
    const defaultLayoutFilepath = resolve(__dirname, `./defaults/${defaultLayoutBasename}`)
    const defaultLayoutRelpath = relative(src, defaultLayoutFilepath)
    // eslint-disable-next-line dot-notation
    layouts['root'] = {
      root: src,
      filepath: defaultLayoutFilepath,
      relname: defaultLayoutRelpath,
      basename: defaultLayoutBasename,
      parentName: defaultLayoutRelpath.slice(0, -(defaultLayoutBasename.length + 1)),
      layoutName: 'root'
    }
  }

  pages = pages.filter(p => {
    if (pageBuilders[p.type]) return true
    else {
      warnings.push({
        code: 'TOP_BUN_WARNING_UNKNOWN_PAGE_BUILDER',
        message: `Skipping ${p.path}. Unimplemented type ${p.type}`
      })
    }
    return false
  })

  const results = {
    /** @type {PageFileAsset | undefined } */
    globalStyle: rootFiles['global.css'],
    /** @type {PageFileAsset | undefined } */
    globalClient: rootFiles['global.client.js'],
    /** @type {PageFileAsset | undefined } */
    globalVars: rootFiles['global.vars.js'],
    /** @type {string?} Path to a default style */
    defaultStyle: null,
    /** @type {string?} Path to a default client */
    defaultClient: null,
    layouts,
    templates,
    pages,
    warnings,
    errors,
    defaultLayout
    // nonPageFolders
    // allFiles: dirs
  }

  return results
}
