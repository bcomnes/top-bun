#!/usr/bin/env node
/* eslint-disable dot-notation */

import minimist from 'minimist'
// @ts-ignore
import cliclopts from 'cliclopts'
import { readFile } from 'fs/promises'
import { resolve, join } from 'path'
import desm from 'desm'
import process from 'process'
// @ts-ignore
import tree from 'pretty-tree'
import { inspect } from 'util'

import { Siteup } from './index.js'
import { SiteupAggregateError } from './lib/helpers/siteup-aggregate-error.js'
import { generateTreeData } from './lib/helpers/generate-tree-data.js'

/**
 * @typedef {import('./lib/builder.js').SiteupOpts} SiteupOpts
 * @typedef {import('./lib/builder.js').Results} Results
 */

const __dirname = desm(import.meta.url)

async function getPkg () {
  const pkgPath = resolve(__dirname, './package.json')
  const pkg = JSON.parse(await readFile(pkgPath, 'utf8'))
  return pkg
}

const clopts = cliclopts([
  {
    name: 'src',
    abbr: 's',
    help: 'path to source directory',
    default: 'src'
  },
  {
    name: 'dest',
    abbr: 'd',
    help: 'path to build destination directory',
    default: 'public'
  },
  {
    name: 'ignore',
    abbr: 'i',
    help: 'comma separated gitignore style ignore string'
  },
  {
    name: 'watch',
    abbr: 'w',
    help: 'build, watch and serve the site build',
    Boolean: true
  },
  {
    name: 'watch-only',
    help: 'watch and build the src folder without serving',
    Boolean: false
  },
  {
    name: 'help',
    abbr: 'h',
    help: 'show help',
    Boolean: true
  },
  {
    name: 'version',
    abbr: 'v',
    boolean: true,
    help: 'show version information'
  }
])

const argv = minimist(process.argv.slice(2), clopts.options())

async function run () {
  if (argv['version']) {
    const pkg = await getPkg()
    console.log(pkg.version)
    process.exit(0)
  }

  if (argv['help']) {
    const pkg = await getPkg()
    console.log('Usage: siteup [options]\n')
    console.log('    Example: siteup --src website --dest public\n')
    clopts.print()
    console.log(`siteup (v${pkg.version})`)
    process.exit(0)
  }
  const cwd = process.cwd()
  const src = resolve(join(cwd, argv['src']))
  const dest = resolve(join(cwd, argv['dest']))

  /** @type {SiteupOpts} */
  const opts = {}

  if (argv['ignore']) opts.ignore = argv['ignore'].split(',')

  const siteup = new Siteup(src, dest, opts)

  process.once('SIGINT', quit)
  process.once('SIGTERM', quit)

  async function quit () {
    if (siteup.watching) {
      const results = await siteup.stopWatching()
      console.log(results)
      console.log('watching stopped')
    }
    console.log('\nquitting cleanly')
    process.exit(0)
  }

  if (!argv['watch'] && !argv['watch-only']) {
    try {
      const results = await siteup.build()
      console.log(tree(generateTreeData(cwd, src, dest, results)))
      if (results?.warnings?.length > 0) {
        console.log(
          '\nThere were build warnings:\n'
        )
      }
      for (const warning of results?.warnings) {
        if ('message' in warning) {
          console.log(`  ${warning.message}`)
        } else {
          console.warn(warning)
        }
      }
      console.log('\nBuild Success!\n\n')
    } catch (err) {
      if (!(err instanceof Error || err instanceof AggregateError)) throw new Error('Non-error thrown', { cause: err })
      if (err instanceof SiteupAggregateError) {
        if (err?.results?.siteData?.pages) {
          console.log(tree(generateTreeData(cwd, src, dest, err.results)))
        }
      }
      if ('results' in err) delete err.results
      console.error(inspect(err, { depth: 999, colors: true }))

      console.log('\nBuild Failed!\n\n')
      process.exit(1)
    }
  } else {
    const initialResults = await siteup.watch({
      serve: !argv['watch-only']
    })
    console.log(tree(generateTreeData(cwd, src, dest, initialResults)))
    if (initialResults?.warnings?.length > 0) {
      console.log(
        '\nThere were build warnings:\n'
      )
    }
    for (const warning of initialResults?.warnings) {
      if ('message' in warning) {
        console.log(`  ${warning.message}`)
      } else {
        console.warn(warning)
      }
    }
  }
}

run().catch(err => {
  console.error(new Error('Unhandled siteup error', { cause: err }))
  process.exit(1)
})
