import { describe, it, expect } from "vitest";
import { parse, parseMdx, toHtml } from "../";

describe("parse mdx", () => {
  it("returns html", () => {
    const html = toHtml(`
# Hello

this is a paragraph

here is some mdx

<Callout>
this is a callout

</Callout>`);
    expect(html).toMatchInlineSnapshot(`
      "<h1>Hello</h1>
      <p>this is a paragraph</p>
      <p>here is some mdx</p>
      &lt;Callout&gt;
      this is a callout
      &lt;/Callout&gt;"
    `);
  });

  it("handles broken jsx in mdx without panic", () => {
    const error = catchErrorValue(() =>
      parseMdx(`
paragraph

<Callout type="info">

    `),
    );
    expect(error).toMatchInlineSnapshot(
      `[Error: Message { place: Some(Point(6:5 (39))), reason: "Expected a closing tag for \`<Callout>\` (4:1)", rule_id: "end-tag-mismatch", source: "markdown-rs" }]`,
    );
  });
  it("returns mdast", () => {
    const ast = parseMdx(`
import something from 'package'
export const x = 9

# Hello

this is a paragraph

here is some mdx {expression}

> quote

<Callout type="info">
this is a callout

</Callout>
    `);
    expect(stripPositions(ast)).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "children": [
              {
                "type": "text",
                "value": "import something from 'package'
      export const x = 9",
              },
            ],
            "type": "paragraph",
          },
          {
            "children": [
              {
                "type": "text",
                "value": "Hello",
              },
            ],
            "depth": 1,
            "type": "heading",
          },
          {
            "children": [
              {
                "type": "text",
                "value": "this is a paragraph",
              },
            ],
            "type": "paragraph",
          },
          {
            "children": [
              {
                "type": "text",
                "value": "here is some mdx ",
              },
              {
                "_markdownRsStops": [
                  [
                    0,
                    101,
                  ],
                ],
                "type": "mdxTextExpression",
                "value": "expression",
              },
            ],
            "type": "paragraph",
          },
          {
            "children": [
              {
                "children": [
                  {
                    "type": "text",
                    "value": "quote",
                  },
                ],
                "type": "paragraph",
              },
            ],
            "type": "blockquote",
          },
          {
            "attributes": [
              {
                "name": "type",
                "type": "mdxJsxAttribute",
                "value": "info",
              },
            ],
            "children": [
              {
                "children": [
                  {
                    "type": "text",
                    "value": "this is a callout",
                  },
                ],
                "type": "paragraph",
              },
            ],
            "name": "Callout",
            "type": "mdxJsxFlowElement",
          },
        ],
        "type": "root",
      }
    `);
  });
});

/**
 * Removes all "position" fields from an mdast/unist tree node (in-place).
 * @param node - The tree node to clean.
 * @returns The node without "position" fields.
 */
export function stripPositions<T extends Record<string, any>>(node: T): T {
  if (Array.isArray(node)) {
    // @ts-ignore
    return node.map(stripPositions);
  } else if (node && typeof node === "object") {
    const newNode: any = {};
    for (const key in node) {
      if (key === "position") continue;
      // Recursively clean properties that may be nodes or arrays of nodes
      newNode[key] = stripPositions(node[key]);
    }
    return newNode;
  }
  return node;
}

/**
 * Executes a function and returns either its value or the error thrown.
 * @param fn - The function to execute.
 * @returns The returned value, or the caught error.
 */
export function catchErrorValue<T>(fn: () => T): T | Error {
  try {
    return fn();
  } catch (e) {
    return e;
  }
}
