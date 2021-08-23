import tap from 'tap'

import { fsPathToUrlPath } from './fs-path-to-url.js'

tap.test('fsPathToUrlPath works for all OS file path types', async (t) => {
  const tests = [
    {
      input: '/foo/bar/baz',
      expect: '/foo/bar/baz',
      note: 'unix style paths'
    },
    {
      input: '\\foo\\bar\\baz',
      expect: '/foo/bar/baz',
      note: 'windows style paths'
    }
  ]

  for (const test of tests) {
    t.equal(fsPathToUrlPath(test.input), test.expect, test.note)
  }
})
