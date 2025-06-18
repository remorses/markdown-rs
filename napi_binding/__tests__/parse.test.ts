import { describe, it, expect } from 'vitest'
import { parse } from '../index'

describe('parse', () => {
  it('returns mdast', () => {
    const ast = parse('# Hello')
    expect(ast).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "children": [
              {
                "position": {
                  "end": {
                    "column": 8,
                    "line": 1,
                    "offset": 7,
                  },
                  "start": {
                    "column": 3,
                    "line": 1,
                    "offset": 2,
                  },
                },
                "type": "text",
                "value": "Hello",
              },
            ],
            "depth": 1,
            "position": {
              "end": {
                "column": 8,
                "line": 1,
                "offset": 7,
              },
              "start": {
                "column": 1,
                "line": 1,
                "offset": 0,
              },
            },
            "type": "heading",
          },
        ],
        "position": {
          "end": {
            "column": 8,
            "line": 1,
            "offset": 7,
          },
          "start": {
            "column": 1,
            "line": 1,
            "offset": 0,
          },
        },
        "type": "root",
      }
    `)
  })
})
