import { test } from 'node:test'
import assert from 'node:assert'
import { keyBy } from './key-by.js'

test.describe('key-by', () => {
  test('keyBy with function', () => {
    const data = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]

    const result = keyBy(data, item => item.id.toString())
    assert.deepStrictEqual(result, {
      1: { id: 1, name: 'Alice' },
      2: { id: 2, name: 'Bob' },
    })
  })

  test('keyBy with string key', () => {
    const data = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]

    const result = keyBy(data, 'id')
    assert.deepStrictEqual(result, {
      1: { id: 1, name: 'Alice' },
      2: { id: 2, name: 'Bob' },
    })
  })
})
