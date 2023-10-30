import tap from 'tap'
import { keyBy } from './key-by.js'

tap.test('keyBy with function', t => {
  const data = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]

  const result = keyBy(data, item => item.id.toString())
  t.strictSame(result, {
    1: { id: 1, name: 'Alice' },
    2: { id: 2, name: 'Bob' }
  })

  t.end()
})

tap.test('keyBy with string key', t => {
  const data = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]

  const result = keyBy(data, 'id')
  t.strictSame(result, {
    1: { id: 1, name: 'Alice' },
    2: { id: 2, name: 'Bob' }
  })

  t.end()
})
