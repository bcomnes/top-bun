import assert from 'node:assert'
import { readFile } from 'fs/promises'
import yaml from 'js-yaml'
import cheerio from 'cheerio'

import { getMd, renderMd } from './get-md.js'

const md = getMd()

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

  const body = renderMd(mdUnparsed, frontMatter, md)
  const title = cheerio.load(body)('h1').first().text().trim()

  return {
    vars: Object.assign({ title }, frontMatter),
    pageLayout: async (vars) => renderMd(mdUnparsed, vars, md)
  }
}
