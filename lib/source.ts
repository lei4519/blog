import { docs } from 'fumadocs-mdx:collections/server';
import { type InferPageType, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';

const docSource = docs.toFumadocsSource();

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: '/docs',
  source: docSource,
  plugins: ({ typedPlugin }) => [
    lucideIconsPlugin(),
    // typedPlugin({
    //   transformPageTree: {
    //     file(node, file) {
    //       // access the original (unfiltered) file data
    //       // if (file) console.log(this.storage.read(file));
    //       // modify nodes
    //       // node.name = ""
    //       const page = source.getNodePage(node);
    //       // if (page && page.data.issue) {
    //       //   node.url = `/docs/${page.data.issue}`;
    //       // }
    //       return node;
    //     },
    //   },
    // }),
  ],
  // url(slugs, locale) {
  //   if (slugs.length === 2) {
  //     return `/docs/${slugs[1]}`;
  //   }
  //   return slugs.join("/")
  // },
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title}

${processed}`;
}
