#!/usr/bin/env node

import minimist from 'minimist'
import cliclopts from 'cliclopts'
import { readFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import desm from 'desm'
import process from 'node:process'

import { Siteup } from './index.js'

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
    help: 'build and watch the src folder for additional changes',
    Boolean: true
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
  if (argv.version) {
    const pkg = await getPkg()
    console.log(pkg.version)
    process.exit(0)
  }

  if (argv.help) {
    const pkg = await getPkg()
    console.log('Usage: siteup [options]\n')
    console.log('    Example: siteup --src website --dest public\n')
    clopts.print()
    console.log(`siteup (v${pkg.version})`)
    process.exit(0)
  }
  const cwd = process.cwd()
  const src = resolve(join(cwd, argv.src))
  const dest = resolve(join(cwd, argv.dest))

  // TODO validate input a little better

  const opts = {}

  if (argv.ignore) opts.ignore = argv.ignore.split(',')

  const siteup = new Siteup(src, dest, cwd, opts)

  process.once('SIGINT', quit)
  process.once('SIGTERM', quit)

  async function quit () {
    if (siteup.watching) {
      const results = await siteup.stopWatching()
      console.log(results)
      console.log('watching stopped')
    }
    console.log('quitting cleanly')
    process.exit(0)
  }

  if (!argv.watch) {
    const results = await siteup.build()
    console.log(results)
    console.log('done')
  } else {
    const initialResults = await siteup.watch()
    console.log(initialResults)
  }
}

run().catch(e => {
  console.error(e)
  process.exit(1)
})
