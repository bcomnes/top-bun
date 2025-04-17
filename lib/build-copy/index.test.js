import tap from 'tap'
import { getCopyDirs } from './index.js'

tap.test('getCopyDirs returns correct src/dest pairs', async (t) => {
  const copyDirs = getCopyDirs(['fixtures'])

  t.strictSame(copyDirs, ['fixtures/**'])
})
