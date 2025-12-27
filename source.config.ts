import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import { z } from 'zod/v4';
import { remarkDirectiveAdmonition } from 'fumadocs-core/mdx-plugins';


const customSchema = {
  issue: z.number().optional(),
  tags: z.array(z.string()).optional(),
  created: z.date().optional(),
  updated: z.string().optional(),
};

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema.extend(customSchema)
    ,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema.extend
      (customSchema),
  },
});

export default defineConfig({
  mdxOptions: {
    // MDX options
    remarkPlugins: [remarkDirectiveAdmonition],
    remarkImageOptions: {
      external: false,
      // publicDir: "https://raw.githubusercontent.com/lei4519"
    },
    // @ts-ignore
    rehypeCodeOptions: {
      fallbackLanguage: 'text',
    },
  },
});
