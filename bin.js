#!/usr/bin/env node

import minimist from 'minimist'
import cliclopts from 'cliclopts'
import { readFile } from 'fs/promises'
import { resolve, join, basename, sep, relative } from 'path'
import desm from 'desm'
import process from 'process'
import tree from 'pretty-tree'
import cleanDeep from 'clean-deep'
import { inspect } from 'util'

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
    // TODO: handle warning and error output
    try {
      const results = await siteup.build()
      console.log(tree(generateTreeData(cwd, src, dest, results)))
      if (results?.warnings?.length > 0) {
        console.log(
          '\nThere were build warnings:\n'
        )
      }
      for (const warning of results?.warnings) {
        console.log(`  ${warning.message}`)
      }
      console.log('\nBuild Success!\n\n')
    } catch (err) {
      if (err.results?.siteData?.pages) {
        console.log(tree(generateTreeData(cwd, src, dest, err.results)))
      }
      console.error(inspect(err, { depth: 999, colors: true }))

      if (err.errors) {
        console.error(inspect(err.errors, { depth: 5, colors: true }))
      }

      console.log('\nBuild Failed!\n\n')
    }
  } else {
    // TODO: handle watch data event or something... maybe like a async iterator?
    const initialResults = await siteup.watch()
    console.log(initialResults)
  }
}

function generateTreeData (cwd, src, dest, results) {
  const cwdDir = basename(cwd)
  const srcDir = basename(relative(cwd, src))
  const destDir = basename(relative(cwd, dest))

  const treeStructure = {
    label: `${join(cwdDir, srcDir)} => ${join(cwdDir, destDir)}`,
    leaf: {
      globalStyle: results?.siteData?.globalStyle?.outputRelname,
      globalClient: results?.siteData?.outputMaps?.outputRelname,
      globalVars: results?.siteData?.globalVars?.basename,
      rootLayout: results?.siteData?.rootLayout?.basename
    },
    nodes: []
  }

  for (const page of results?.siteData?.pages) {
    const segments = page.page.relname.split(sep)
    segments.pop()

    let nodes = treeStructure.nodes
    let targetNode = treeStructure

    for (const segment of segments) {
      targetNode = nodes.find(node => segment === node.label)
      if (!targetNode) {
        targetNode = { label: segment, leaf: {}, nodes: [] }
        nodes.push(targetNode)
      }
      nodes = targetNode.nodes
    }

    targetNode.leaf[page.page.basename] = join(page.path, page.outputName)
    if (page.pageStyle) targetNode.leaf[page.pageStyle.basename] = join(page.path, page.pageStyle.outputName ?? page.pageStyle.basename)
    if (page.clientBundle) targetNode.leaf[page.clientBundle.basename] = join(page.path, page.clientBundle.outputName ?? page.clientBundle.basename)
    if (page.pageVars) targetNode.leaf[page.pageVars.basename] = join(page.path, page.pageVars.basename)
  }

  for (const file of results?.static?.report?.copied) {
    const srcFile = relative(srcDir, file.source)
    const destFile = relative(destDir, file.output)
    const segments = srcFile.split(sep)
    segments.pop()

    let nodes = treeStructure.nodes
    let targetNode = treeStructure

    for (const segment of segments) {
      targetNode = nodes.find(node => segment === node.label)
      if (!targetNode) {
        targetNode = { label: segment, leaf: {}, nodes: [] }
        nodes.push(targetNode)
      }
      nodes = targetNode.nodes
    }

    targetNode.leaf[basename(srcFile)] = destFile
  }

  return cleanDeep(treeStructure)
}

run().catch(err => {
  console.error(new Error('Unhandled siteup error', { cause: err }))
  process.exit(1)
})
