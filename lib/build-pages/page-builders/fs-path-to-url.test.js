import test from 'brittle'
import process from 'node:process'

import { fsPathToUrlPath } from './fs-path-to-url.js'

const isWin = process.platform === 'win32'

test('fsPathToUrlPath works for all OS file path types', async (t) => {
  const tests = [
    {
      input: 'foo/bar/baz',
      expect: '/foo/bar/baz',
      note: 'unix style paths',
      winOnly: false
    },
    {
      input: 'foo\\bar\\baz',
      expect: '/foo/bar/baz',
      note: 'windows style paths',
      winOnly: true
    }
  ]

  for (const test of tests) {
    if (isWin && test.winOnly) {
      t.is(fsPathToUrlPath(test.input), test.expect, test.note)
    } else if (!isWin && !test.winOnly) {
      t.is(fsPathToUrlPath(test.input), test.expect, test.note)
    }
  }
})
