import assert from 'webassert'
import { readFile } from 'node:fs/promises'
import yaml from 'js-yaml'
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

export async function mdBuilder ({ page }) {
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
