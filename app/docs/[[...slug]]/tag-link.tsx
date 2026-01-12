'use client';

import { useCallback } from 'react';

interface TagLinkProps {
  tag: string;
}

export function TagLink({ tag }: TagLinkProps) {
  const handleClick = useCallback(() => {
    // 侧边栏中的 folder 名称是 `#${tag}`
    const folderName = `#${tag}`;

    // fumadocs 侧边栏的 folder 按钮包含 data-item-id 属性
    // 或者我们可以通过文本内容来查找
    const sidebar = document.querySelector('[data-sidebar]') || document.querySelector('aside');
    if (!sidebar) return;

    // 查找包含对应 tag 名称的 folder 按钮
    const buttons = sidebar.querySelectorAll('button');
    let targetButton: HTMLButtonElement | null = null;

    for (const button of buttons) {
      // 检查按钮文本内容是否匹配 folder 名称
      if (button.textContent?.trim() === folderName) {
        targetButton = button;
        break;
      }
    }

    if (targetButton) {
      // 检查是否已经展开（通过 aria-expanded 或 data-state 属性）
      const isExpanded = targetButton.getAttribute('aria-expanded') === 'true' ||
                         targetButton.getAttribute('data-state') === 'open';

      // 如果没有展开，则点击展开
      if (!isExpanded) {
        targetButton.click();
      }

      // 滚动到目标按钮位置
      targetButton.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      // 添加短暂的高亮效果
      targetButton.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
      setTimeout(() => {
        targetButton?.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
      }, 1500);
    }
  }, [tag]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="cursor-pointer hover:text-fd-primary transition-colors"
    >
      #{tag}
    </button>
  );
}
