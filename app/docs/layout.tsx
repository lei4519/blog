import { source, getPageTreeByTags } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  // 使用按 tags 组织的侧边栏
  const tagBasedTree = getPageTreeByTags();

  return (
    <DocsLayout tree={tagBasedTree} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
