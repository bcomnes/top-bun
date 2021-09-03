import process from 'node:process'
import { once } from 'events'
import assert from 'webassert'
import chokidar from 'chokidar'

import { build } from './lib/builder.js'

export class SiteUp {
  constructor (src, dest, cwd = process.cwd(), opts = {}) {
    assert(src, 'src is a required argument')
    assert(dest, 'dest is a required argument')

    this._src = src
    this._dest = dest
    this._cwd = cwd

    this.opts = opts

    this._watcher = null
    this._building = false
  }

  get watching () {
    return Boolean(this._watcher)
  }

  build () {
    return build(this._src, this._dest)
  }

  async watch () {
    if (this.watching) throw new Error('Already watching.')
    const results = await build(this._src, this._dest)

    const watcher = chokidar.watch(this._src, {
      ignored: /(^|[/\\])\../, // ignore dotfiles
      persistent: true
    })

    this._watcher = watcher

    await once(watcher, 'ready')

    watcher.on('add', path => {
      console.log(`File ${path} has been added`)
      build(this._src, this._dest)
    })
    watcher.on('change', path => {
      console.log(`File ${path} has been changed`)
      build(this._src, this._dest)
    })
    watcher.on('unlink', path => {
      console.log(`File ${path} has been removed`)
      // await build(this.src, this.dest)
    })
    watcher.on('error', console.error)

    return results
  }

  async stopWatching () {
    if (!this.watching) throw new Error('Not watching')
    await this._watcher.close()
    this._watcher = null
  }
}
