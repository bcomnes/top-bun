import assert from 'node:assert'
import { readFile } from 'fs/promises'
import yaml from 'js-yaml'
import cheerio from 'cheerio'
import markdownIt from 'markdown-it'
import markdownItFootnote from 'markdown-it-footnote'
import markdownItEmoji from 'markdown-it-emoji'
import markdownItHighlightjs from 'markdown-it-highlightjs'
// @ts-ignore
import markdownItSub from 'markdown-it-sub'
// @ts-ignore
import markdownItSup from 'markdown-it-sup'
// @ts-ignore
import markdownItDeflist from 'markdown-it-deflist'
// @ts-ignore
import markdownItIns from 'markdown-it-ins'
// @ts-ignore
import markdownItMark from 'markdown-it-mark'
// @ts-ignore
import markdownItAbbr from 'markdown-it-abbr'

/**
 * @template T
 * @typedef {import('../page-writer.js').PageBuilderType<T>} PageBuilderType
 */

/**
 * Build all of the bundles using esbuild.
 * @template T
 * @type {PageBuilderType<T>}
 */
export async function mdBuilder ({ pageInfo }) {
  assert(pageInfo.type === 'md', 'md builder requires an "md" page type')
  const fileContents = await readFile(pageInfo.pageFile.filepath, 'utf8')

  let frontMatter
  let mdUnparsed
  if (fileContents.trim().startsWith('---')) {
    const [/* _ */, frontMatterUnparsed, ...mdParts] = fileContents.split('---')
    mdUnparsed = mdParts.join('---')
    frontMatter = yaml.load(frontMatterUnparsed ?? '')
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
    // @ts-ignore These @types suck! This works fine.
    .use(markdownItHighlightjs, { auto: false, code: true })

  // disable autolinking for filenames
  md.linkify.tlds('.md', false) // markdown

  const body = rewriteLinks(md.render(mdUnparsed))
  const title = cheerio.load(body)('h1').first().text().trim()

  return {
    vars: Object.assign({ title }, frontMatter),
    pageLayout: async (/* vars */) => body
  }
}

/**
  * Rewrites relative `$1.md` and `$1.markdown` links in body to `$1/index.html`.
  * If pretty is false, rewrites `$1.md` to `$1.html`.
  * `readme.md` is always rewritten to `index.html`. From sitedown
  *
  * @param  {String} body - html content to rewrite
  * @return {String}
  */
function rewriteLinks (body /*, pretty */) {
  body = body || ''

  // if (pretty !== false) pretty = true // default to true if omitted

  const regex = /(href=")((?!http[s]*:).*)(\.md|\.markdown)"/g

  return body.replace(regex, function (_match, p1, p2, _p3) {
    const f = p2.toLowerCase()

    // root readme
    if (f === 'readme') return p1 + '/"'

    // nested readme
    if (f.match(/readme$/)) return p1 + f.replace(/readme$/, '') + '"'

    // pretty url
    // if (pretty) return p1 + f + '/"'

    // default
    return p1 + p2 + '.html"'
  })
}
