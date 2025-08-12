import { test } from 'node:test'
import assert from 'node:assert'

import { extractFirstH1 } from './extract-title-from-md.js'

test.describe('extractFirstH1', () => {
  test('extracts ATX style H1 headings', async () => {
    const tests = [
      {
        input: '# Simple Heading',
        expect: 'Simple Heading',
        note: 'basic ATX H1'
      },
      {
        input: '#    Extra Spaces   ',
        expect: 'Extra Spaces',
        note: 'ATX H1 with extra spaces'
      },
      {
        input: '# Heading with **bold** and *italic*',
        expect: 'Heading with **bold** and *italic*',
        note: 'ATX H1 with inline formatting'
      },
      {
        input: 'Some text\n# First Heading\n## Second Heading',
        expect: 'First Heading',
        note: 'ATX H1 after other content'
      },
      {
        input: '## Not H1\n# Real H1\n### Not H1',
        expect: 'Real H1',
        note: 'ATX H1 between other headings'
      }
    ]

    for (const testCase of tests) {
      const result = extractFirstH1(testCase.input)
      assert.equal(result, testCase.expect, testCase.note)
    }
  })

  test('extracts Setext style H1 headings', async () => {
    const tests = [
      {
        input: 'Simple Heading\n==============',
        expect: 'Simple Heading',
        note: 'basic Setext H1'
      },
      {
        input: 'Simple Heading\n===',
        expect: 'Simple Heading',
        note: 'Setext H1 with minimum underline'
      },
      {
        input: '  Trimmed Heading  \n==============',
        expect: 'Trimmed Heading',
        note: 'Setext H1 with spaces to trim'
      },
      {
        input: 'Heading with **bold** and *italic*\n==================',
        expect: 'Heading with **bold** and *italic*',
        note: 'Setext H1 with inline formatting'
      },
      {
        input: 'Some text\n\nFirst Heading\n=============\n\nMore text',
        expect: 'First Heading',
        note: 'Setext H1 with surrounding content'
      }
    ]

    for (const testCase of tests) {
      const result = extractFirstH1(testCase.input)
      assert.equal(result, testCase.expect, testCase.note)
    }
  })

  test('handles edge cases correctly', async () => {
    const tests = [
      {
        input: '',
        expect: null,
        note: 'empty string'
      },
      {
        input: '## Only H2\n### Only H3',
        expect: null,
        note: 'no H1 present'
      },
      {
        input: 'Not a heading\n---',
        expect: null,
        note: 'Setext H2 (dashes) should not match'
      },
      {
        input: 'Not a heading\n--',
        expect: null,
        note: 'Setext H2 (dashes) should not match'
      },
      {
        input: 'Not a heading\n==',
        expect: 'Not a heading',
        note: 'markdown-it accepts any number of equals for Setext H1'
      },
      {
        input: '\n========',
        expect: null,
        note: 'empty line before Setext underline'
      },
      {
        input: '    # Code block heading',
        expect: null,
        note: 'indented code block should not match'
      },
      {
        input: '```\n# Code fence heading\n```',
        expect: null,
        note: 'fenced code block should not match (simple case)'
      }
    ]

    for (const testCase of tests) {
      const result = extractFirstH1(testCase.input)
      assert.equal(result, testCase.expect, testCase.note)
    }
  })

  test('prefers first H1 when multiple exist', async () => {
    const tests = [
      {
        input: '# First ATX\n# Second ATX',
        expect: 'First ATX',
        note: 'multiple ATX H1s'
      },
      {
        input: 'First Setext\n============\n\nSecond Setext\n============',
        expect: 'First Setext',
        note: 'multiple Setext H1s'
      },
      {
        input: '# ATX First\n\nSetext Second\n=============',
        expect: 'ATX First',
        note: 'ATX before Setext'
      },
      {
        input: 'Setext First\n============\n\n# ATX Second',
        expect: 'Setext First',
        note: 'Setext before ATX'
      }
    ]

    for (const testCase of tests) {
      const result = extractFirstH1(testCase.input)
      assert.equal(result, testCase.expect, testCase.note)
    }
  })

  test('handles multiline documents correctly', async () => {
    const markdown = `
Some introductory text here
that spans multiple lines

# The Real Title

## A subsection

More content here
`
    const result = extractFirstH1(markdown)
    assert.equal(result, 'The Real Title', 'finds H1 in realistic document')
  })

  test('handles frontmatter-like content', async () => {
    const markdown = `---
title: Frontmatter Title
---

# Actual H1 Title

Content here`
    const result = extractFirstH1(markdown)
    assert.equal(result, 'Actual H1 Title', 'ignores frontmatter')
  })
})
