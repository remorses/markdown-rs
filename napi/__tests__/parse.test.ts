import { describe, it, expect } from "vitest";
import { parse, parseMdx } from "../";

describe("parse mdx", () => {
  it("returns mdast", () => {
    const ast = parseMdx(`
# Hello

this is a paragraph

here is some mdx

<Callout>
this is a callout

</Callout>
    `);
    expect(ast).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "children": [
              {
                "position": {
                  "end": {
                    "column": 8,
                    "line": 2,
                    "offset": 8,
                  },
                  "start": {
                    "column": 3,
                    "line": 2,
                    "offset": 3,
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
                "line": 2,
                "offset": 8,
              },
              "start": {
                "column": 1,
                "line": 2,
                "offset": 1,
              },
            },
            "type": "heading",
          },
          {
            "children": [
              {
                "position": {
                  "end": {
                    "column": 20,
                    "line": 4,
                    "offset": 29,
                  },
                  "start": {
                    "column": 1,
                    "line": 4,
                    "offset": 10,
                  },
                },
                "type": "text",
                "value": "this is a paragraph",
              },
            ],
            "position": {
              "end": {
                "column": 20,
                "line": 4,
                "offset": 29,
              },
              "start": {
                "column": 1,
                "line": 4,
                "offset": 10,
              },
            },
            "type": "paragraph",
          },
          {
            "children": [
              {
                "position": {
                  "end": {
                    "column": 17,
                    "line": 6,
                    "offset": 47,
                  },
                  "start": {
                    "column": 1,
                    "line": 6,
                    "offset": 31,
                  },
                },
                "type": "text",
                "value": "here is some mdx",
              },
            ],
            "position": {
              "end": {
                "column": 17,
                "line": 6,
                "offset": 47,
              },
              "start": {
                "column": 1,
                "line": 6,
                "offset": 31,
              },
            },
            "type": "paragraph",
          },
          {
            "attributes": [],
            "children": [
              {
                "children": [
                  {
                    "position": {
                      "end": {
                        "column": 18,
                        "line": 9,
                        "offset": 76,
                      },
                      "start": {
                        "column": 1,
                        "line": 9,
                        "offset": 59,
                      },
                    },
                    "type": "text",
                    "value": "this is a callout",
                  },
                ],
                "position": {
                  "end": {
                    "column": 18,
                    "line": 9,
                    "offset": 76,
                  },
                  "start": {
                    "column": 1,
                    "line": 9,
                    "offset": 59,
                  },
                },
                "type": "paragraph",
              },
            ],
            "name": "Callout",
            "position": {
              "end": {
                "column": 11,
                "line": 11,
                "offset": 88,
              },
              "start": {
                "column": 1,
                "line": 8,
                "offset": 49,
              },
            },
            "type": "mdxJsxFlowElement",
          },
        ],
        "position": {
          "end": {
            "column": 5,
            "line": 12,
            "offset": 93,
          },
          "start": {
            "column": 1,
            "line": 1,
            "offset": 0,
          },
        },
        "type": "root",
      }
    `);
  });
});
