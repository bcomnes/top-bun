/**
 * @import markdownIt from 'markdown-it'
 */
import assert from 'node:assert'
import { readFile } from 'fs/promises'
import yaml from 'js-yaml'
import * as cheerio from 'cheerio'

import { getMd, renderMd } from './get-md.js'

/** @type {markdownIt | null} */
let md = null

/**
 * Build all of the bundles using esbuild.
 * @template {Record<string, any>} T
 * @type {import('../page-writer.js').PageBuilderType<T>}
 */
export async function mdBuilder ({ pageInfo, options }) {
  assert(pageInfo.type === 'md', 'md builder requires an "md" page type')

  const markdownItSettingsPath = options?.markdownItSettingsPath || null

  if (!md) md = await getMd(markdownItSettingsPath)
  const fileContents = await readFile(pageInfo.pageFile.filepath, 'utf8')

  /** @type {object} */
  let frontMatter
  /** @type {string} */
  let mdUnparsed
  if (fileContents.trim().startsWith('---')) {
    const [/* _ */, frontMatterUnparsed, ...mdParts] = fileContents.split('---')
    mdUnparsed = mdParts.join('---')
    // @ts-ignore
    frontMatter = yaml.load(frontMatterUnparsed ?? '')
  } else {
    frontMatter = {}
    mdUnparsed = fileContents
  }

  const body = await renderMd(mdUnparsed, { handlebars: false, ...frontMatter }, md, markdownItSettingsPath)
  const title = cheerio.load(body)('h1').first().text().trim()

  return {
    vars: Object.assign({ title }, frontMatter),
    pageLayout: async (vars) => await renderMd(mdUnparsed, vars, md, markdownItSettingsPath),
  }
}
