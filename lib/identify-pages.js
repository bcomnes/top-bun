import { asyncFolderWalker } from 'async-folder-walker'
import assert from 'webassert'
import desm from 'desm'
import { resolve } from 'path'

const __dirname = desm(import.meta.url)

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

  let pages = []
  const warnings = []
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
    const pageVars = files['page.vars.js'] // Do we include this for MD and js pages?

    const conflict = jsPage && htmlPage // TODO: parametarize this

    if (conflict) {
      throw new Error(
        `Conflicting page sources: The page ${dir} has two page sources (page.js and page.html). Pages only support one page type.`
      )
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
        outputName: 'index.html'
      })
    }

    if (!page && !conflict) nonPageFolders.push(dir)

    // Render loose MD pages in place. No styles, no clients, no vars file.
    for (const [fileName, page] of Object.entries(files)) {
      if (fileName.endsWith('.md') && fileName !== 'README.md') {
        pages.push({
          page,
          type: 'md',
          path: dir,
          outputName: page.basename.replace('.md', '.html')
        })
      }
    }
  }

  // Inject global lauouts and vars
  const rootFiles = dirs['']

  if (!rootFiles['root.layout.js']) {
    warnings.push({
      error: 'no-root-layout',
      message: 'Missing a root.layout.js file. Using default layout file.'
    })
  }

  // TODO: maybe formalize this in identify pages later
  pages = pages.filter(p => {
    if (pageBuilders[p.type]) return true
    else {
      warnings.push({
        error: 'Missing page builder',
        message: `Skipping ${p.path}. Unimplemented type ${p.type}`
      })
    }
    return false
  })

  const results = {
    globalStyle: rootFiles['global.css'],
    globalClient: rootFiles['global.client.js'],
    globalVars: rootFiles['global.vars.js'],
    rootLayout: rootFiles['root.layout.js'] || { filepath: resolve(__dirname, './defaults/default.root.layout.js') },
    pages,
    warnings,
    nonPageFolders
    // allFiles: dirs
  }

  return results
}
