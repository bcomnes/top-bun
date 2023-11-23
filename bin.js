#!/usr/bin/env node
/* eslint-disable dot-notation */

import minimist from 'minimist'
// @ts-ignore
import cliclopts from 'cliclopts'
import { readFile } from 'node:fs/promises'
import { resolve, join, relative } from 'node:path'
import readline from 'node:readline'
import desm from 'desm'
import process from 'process'
// @ts-ignore
import tree from 'pretty-tree'
import { inspect } from 'util'
import { packageDirectory } from 'pkg-dir'
import { readPackage } from 'read-pkg'
import { addPackageDependencies } from 'write-package'

import { copyFile } from './lib/helpers/copy-file.js'
import { TopBun } from './index.js'
import { TopBunAggregateError } from './lib/helpers/top-bun-aggregate-error.js'
import { generateTreeData } from './lib/helpers/generate-tree-data.js'
import { askYesNo } from './lib/helpers/cli-prompt.js'

/**
 * @typedef {import('./lib/builder.js').TopBunOpts} TopBunOpts
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
    name: 'eject',
    abbr: 'e',
    help: 'eject the top bun default layout, style and client into the src flag directory'
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
    console.log('Usage: top-bun [options]\n')
    console.log('    Example: top-bun --src website --dest public\n')
    clopts.print()
    console.log(`top-bun (v${pkg.version})`)
    process.exit(0)
  }
  const cwd = process.cwd()
  const src = resolve(join(cwd, argv['src']))
  const dest = resolve(join(cwd, argv['dest']))

  // Eject task
  if (argv['eject']) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    const localPkg = await packageDirectory({ cwd: src })

    if (!localPkg) {
      console.error('Can\'t locate package.json, exiting without making changes')
      process.exit(1)
    }

    const localPkgJson = join(localPkg, 'package.json')
    const localPkgJsonContents = await readPackage({ cwd: localPkg })
    const targetIsModule = localPkgJsonContents.type === 'module'

    const relativeSrc = relative(process.cwd(), src)
    const relativePkg = relative(process.cwd(), localPkgJson)

    const targetLayoutPath = `layouts/root.layout.${targetIsModule ? 'js' : 'mjs'}`
    const targetGlobalStylePath = 'globals/global.css'
    const targetGlobalClientPath = `globals/global.client.${targetIsModule ? 'js' : 'mjs'}`

    const tbPkgContents = await readPackage({ cwd: __dirname })
    const mineVersion = tbPkgContents?.['dependencies']?.['mine.css']
    const uhtmlVersion = tbPkgContents?.['dependencies']?.['uhtml-isomorphic']
    const highlightVersion = tbPkgContents?.['dependencies']?.['highlight.js']

    if (!mineVersion || !uhtmlVersion || !highlightVersion) {
      console.error('Unable to resolve ejected depdeency versions. Exiting...')
      process.exit(1)
    }

    console.log(`
top-bun eject actions:
  - Write ${join(relativeSrc, targetLayoutPath)}
  - Write ${join(relativeSrc, targetGlobalStylePath)}
  - Write ${join(relativeSrc, targetGlobalClientPath)}
  - Add mine.css@${mineVersion} to ${relativePkg}
  - Add uhtml-isomorphic@${uhtmlVersion} to ${relativePkg}
  - Add highlight.js@${highlightVersion} to ${relativePkg}
`)
    const answer = await askYesNo(rl, 'Continue?')
    if (answer === false) {
      console.log('No action taken. Exiting.')
      process.exit(0)
    }

    const defaultLayoutPath = join(__dirname, 'lib/defaults/default.root.layout.js')
    const defaultGlobalStylePath = join(__dirname, 'lib/defaults/default.style.css')
    const defaultGlobalClientPath = join(__dirname, 'lib/defaults/default.client.js')

    await Promise.all([
      copyFile(defaultLayoutPath, join(src, targetLayoutPath)),
      copyFile(defaultGlobalStylePath, join(src, targetGlobalStylePath)),
      copyFile(defaultGlobalClientPath, join(src, targetGlobalClientPath))
    ])

    await addPackageDependencies(
      localPkgJson,
      {
        dependencies: {
          'mine.css': mineVersion,
          'uhtml-isomorphic': uhtmlVersion,
          'highlight.js': highlightVersion
        }
      })

    console.log('Done ejecting files!')
    process.exit(0)
  }

  /** @type {TopBunOpts} */
  const opts = {}

  if (argv['ignore']) opts.ignore = argv['ignore'].split(',')

  const topBun = new TopBun(src, dest, opts)

  process.once('SIGINT', quit)
  process.once('SIGTERM', quit)

  async function quit () {
    if (topBun.watching) {
      const results = await topBun.stopWatching()
      console.log(results)
      console.log('watching stopped')
    }
    console.log('\nquitting cleanly')
    process.exit(0)
  }

  if (!argv['watch'] && !argv['watch-only']) {
    try {
      const results = await topBun.build()
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
      if (err instanceof TopBunAggregateError) {
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
    const initialResults = await topBun.watch({
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
  console.error(new Error('Unhandled top-bun error', { cause: err }))
  process.exit(1)
})
