import { docs } from 'fumadocs-mdx:collections/server';
import { type InferPageType, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import type { Root as PageTreeRoot, Node as PageTreeNode, Item as PageTreeItem, Folder as PageTreeFolder } from 'fumadocs-core/page-tree';

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

/**
 * 根据文档的 tags 重新组织 pageTree
 * 将文档按照 tags 进行分组，每个 tag 成为一个文件夹节点
 */
export function getPageTreeByTags(): PageTreeRoot {
  const pages = source.getPages();
  const tagMap = new Map<string, PageTreeItem[]>();
  const pagesWithoutTags: PageTreeItem[] = [];

  // 构建树形结构
  const children: PageTreeNode[] = [];

  // 遍历所有页面，按 tags 分组
  for (const page of pages) {
    const tags = page.data.tags || [];

    const pageItem: PageTreeItem = {
      type: 'page',
      name: page.data.title,
      url: page.url,
      icon: page.data.icon,
    };

    if (tags.length === 0) {
      if (page.path === 'index.mdx') {
        // 首页不单独放置
        children.unshift(pageItem);
      } else {
        // 其他没有 tags 的页面单独放置
        pagesWithoutTags.push(pageItem);
      }
    } else {
      // 有 tags 的页面，添加到对应的 tag 分组中
      for (const tag of tags) {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, []);
        }
        tagMap.get(tag)!.push(pageItem);
      }
    }
  }


  // 添加按 tag 分组的文件夹
  const sortedTags = Array.from(tagMap.keys()).sort();
  for (const tag of sortedTags) {
    const items = tagMap.get(tag)!;
    // 按照创建时间倒序排列（最新的在前）
    items.sort((a, b) => {
      const pageA = pages.find(p => p.url === a.url);
      const pageB = pages.find(p => p.url === b.url);
      const dateA = pageA?.data.created || new Date(0);
      const dateB = pageB?.data.created || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    const folderNode: PageTreeFolder = {
      type: 'folder',
      name: `#${tag}`,
      index: undefined,
      children: items,
    };
    children.push(folderNode);
  }

  // 如果有未分类的页面，添加到末尾
  if (pagesWithoutTags.length > 0) {
    // 按照创建时间倒序排列
    pagesWithoutTags.sort((a, b) => {
      const pageA = pages.find(p => p.url === a.url);
      const pageB = pages.find(p => p.url === b.url);
      const dateA = pageA?.data.created || new Date(0);
      const dateB = pageB?.data.created || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    const uncategorizedFolder: PageTreeFolder = {
      type: 'folder',
      name: 'Uncategorized',
      index: undefined,
      children: pagesWithoutTags,
    };
    children.push(uncategorizedFolder);
  }

  return {
    name: 'Docs',
    children,
  };
}

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
