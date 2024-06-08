import tap from 'tap'
import process from 'process'

import { fsPathToUrlPath } from './fs-path-to-url.js'

const isWin = process.platform === 'win32'

tap.test('fsPathToUrlPath works for all OS file path types', async (t) => {
  const tests = [
    {
      input: 'foo/bar/baz',
      expect: '/foo/bar/baz',
      note: 'unix style paths',
      winOnly: false,
    },
    {
      input: 'foo\\bar\\baz',
      expect: '/foo/bar/baz',
      note: 'windows style paths',
      winOnly: true,
    },
  ]

  for (const test of tests) {
    if (isWin && test.winOnly) {
      t.equal(fsPathToUrlPath(test.input), test.expect, test.note)
    } else if (!isWin && !test.winOnly) {
      t.equal(fsPathToUrlPath(test.input), test.expect, test.note)
    }
  }
})
