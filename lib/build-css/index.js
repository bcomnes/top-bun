import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'
import postcssUrl from 'postcss-url'
import postcssNesting from 'postcss-nesting'

/**
 * Build all of the CSS for every page and global CSS
 * @param  {[type]} src      [description]
 * @param  {[type]} dest     [description]
 * @param  {[type]} siteData [description]
 * @return {[type]}          [description]
 */
export async function buildCss (src, dest, siteData, opts) {
  const styles = []

  if (siteData.globalStyle) styles.push(siteData.globalStyle)

  for (const page of siteData.pages) {
    if (page.pageStyle) styles.push(page.pageStyle)
  }

  const reports = {
    type: 'css',
    success: [],
    errors: [],
    warnings: []
  }

  for (const style of styles) {
    try {
      const css = await readFile(style.filepath)
      const targetPath = join(dest, style.relname)
      const result = await postcss([
        postcssImport,
        postcssUrl({
          url: 'copy',
          useHash: true,
          assetsPath: 'assets'
        }),
        postcssNesting,
        autoprefixer
      ]).process(css, { from: style.filepath, to: targetPath })
      await writeFile(targetPath, result.css)
      if (result.map) {
        await writeFile(targetPath + '.map', result.map.toString())
        delete result.map
      }
      delete result.css
      delete result.root
      reports.success.push(result)
    } catch (err) {
      const buildError = new Error('Error building css', { cause: err })
      buildError.style = style
      reports.errors.push(buildError)
    }
  }

  return reports
}
