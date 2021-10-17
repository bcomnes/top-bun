import process from 'node:process'
import { once } from 'events'
import assert from 'webassert'
import chokidar from 'chokidar'
import { basename, relative } from 'node:path'
import makeArray from 'make-array'
import ignore from 'ignore'
import cpx from 'cpx2'

import { getCopyGlob } from './lib/build-static/index.js'
import { build, watchBuild } from './lib/builder.js'

export class Siteup {
  constructor (src, dest, cwd = process.cwd(), opts = {}) {
    assert(src, 'src is a required argument')
    assert(dest, 'dest is a required argument')

    const defaultIgnore = ['.*', 'node_modules', basename(dest)]

    opts.ignore = defaultIgnore.concat(makeArray(opts.ignore))

    this._src = src
    this._dest = dest
    this._cwd = cwd

    this.opts = opts

    this._watcher = null
    this._cpxWatcher = null
    this._building = false
  }

  get watching () {
    return Boolean(this._watcher)
  }

  build () {
    return build(this._src, this._dest, this.opts)
  }

  async watch () {
    if (this.watching) throw new Error('Already watching.')
    const results = await watchBuild(this._src, this._dest, this.opts)

    this._cpxWatcher = cpx.watch(getCopyGlob(this._src), this._dest, { ignore: this.opts.ignore })

    this._cpxWatcher.on('copy', (e) => {
      console.log(`Copy ${e.srcPath} to ${e.dstPath}`)
    })

    this._cpxWatcher.on('remove', (e) => {
      console.log(`Remove ${e.path}`)
    })

    this._cpxWatcher.on('copy', (e) => {
      console.log(`Copy ${e.srcPath} to ${e.dstPath}`)
    })

    this._cpxWatcher.on('watch-ready', () => {
      console.log('Copy watcher ready')
    })

    this._cpxWatcher.on('watch-error', (err) => {
      console.log(`Copy error: ${err.message}`)
    })

    console.log(this.opts.ignore)
    const ig = ignore().add(this.opts.ignore)

    const anymatch = name => ig.ignores(relname(this._src, name))

    const watcher = chokidar.watch(`${this._src}/**/*.+(js|css|html|md)`, {
      ignored: anymatch,
      persistent: true
    })

    console.log(watcher)

    this._watcher = watcher

    await once(watcher, 'ready')

    watcher.on('add', path => {
      console.log(`File ${path} has been added`)
      build(this._src, this._dest, this.opts)
    })
    watcher.on('change', path => {
      console.log(`File ${path} has been changed`)
      build(this._src, this._dest, this.opts)
    })
    watcher.on('unlink', path => {
      console.log(`File ${path} has been removed`)
      // await build(this.src, this.dest)
    })
    watcher.on('error', console.error)

    return results
  }

  async stopWatching () {
    if (!this.watching || !this._cpxWatcher) throw new Error('Not watching')
    await this._watcher.close()
    this._cpxWatcher.close()
    this._watcher = null
    this._cpxWatcher = null
  }
}

function relname (root, name) {
  return root === name ? basename(name) : relative(root, name)
}
