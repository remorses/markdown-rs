import { run, bench, boxplot, summary } from "mitata";
import { parse } from "../";
import { remark } from "remark";
import remarkMdx from "remark-mdx";
import remarkGfm from "remark-gfm";


const remarkProcessor = remark().use(remarkMdx).use(remarkGfm);

async function main() {
  const longMdxContent = await fetch(
    "https://raw.githubusercontent.com/colinhacks/zod/0a49fa39348b7c72b19ddedc3b0f879bd395304b/packages/docs/content/packages/v3.mdx",
  ).then((x) => x.text());

  boxplot(async () => {
    summary(() => {
      bench("markdown-rs parse", () => {
        const res = parse(longMdxContent, {
          mdx: true,
          mdxExpressionParse: true,
          mdxEsmParse: true,
          gfm: true,
        });
      });

      bench("remark + remark-mdx parse", () => {
        remarkProcessor.processSync(longMdxContent);
      });
    });
  });
  await run();
}

main();
