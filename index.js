import process from 'process'
import { once } from 'events'
import assert from 'node:assert'
import chokidar from 'chokidar'
import { basename, relative } from 'path'
import makeArray from 'make-array'
import ignore from 'ignore'
import cpx from 'cpx2'
import { inspect } from 'util'

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
    // TODO: expose events and stuff to the caller instead.
    if (this.watching) throw new Error('Already watching.')

    let report

    try {
      report = await watchBuild(this._src, this._dest, this.opts)
      console.log('Initial JS, CSS and Page Build Complete')
    } catch (err) {
      errorLogger(err)
      if (err.report) report = err.report
    }

    this._cpxWatcher = cpx.watch(getCopyGlob(this._src), this._dest, { ignore: this.opts.ignore })

    this._cpxWatcher.on('copy', (e) => {
      console.log(`Copy ${e.srcPath} to ${e.dstPath}`)
    })

    this._cpxWatcher.on('remove', (e) => {
      console.log(`Remove ${e.path}`)
    })

    this._cpxWatcher.on('watch-ready', () => {
      console.log('Copy watcher ready')
    })

    this._cpxWatcher.on('watch-error', (err) => {
      console.log(`Copy error: ${err.message}`)
    })

    const ig = ignore().add(this.opts.ignore)

    const anymatch = name => ig.ignores(relname(this._src, name))

    const watcher = chokidar.watch(`${this._src}/**/*.+(js|css|html|md)`, {
      ignored: anymatch,
      persistent: true
    })

    this._watcher = watcher

    await once(watcher, 'ready')

    watcher.on('add', path => {
      console.log(`File ${path} has been added`)
      watchBuild(this._src, this._dest, this.opts).then(() => console.log('Site Rebuilt')).catch(errorLogger)
    })
    watcher.on('change', path => {
      console.log(`File ${path} has been changed`)
      watchBuild(this._src, this._dest, this.opts).then(() => console.log('Site Rebuilt')).catch(errorLogger)
    })
    watcher.on('unlink', path => {
      console.log(`File ${path} has been removed`)
      watchBuild(this._src, this._dest, this.opts).then(() => console.log('Site Rebuilt')).catch(errorLogger)
    })
    watcher.on('error', errorLogger)

    return report
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

function errorLogger (err) {
  console.error(err)

  if (err.errors) {
    console.error(inspect(err.errors, { depth: 5, colors: true }))
  }
}
