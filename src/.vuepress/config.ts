import { genNavAndSideBar } from './utils'
import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
  base: '/blog/',
  dest: './docs',
  lang: 'zh-CN',
  title: 'Lay',
  description: 'Lay 的博客',
  themeConfig: {
    ...genNavAndSideBar([
      { text: 'Home', link: '/' },
      { text: '技术分享', link: '/technology/', activeMatch: '/technology/', genSidebar: true },
      { text: '实战分享', link: '/practice/', activeMatch: '/practice/', genSidebar: true },
      { text: '烂笔头', link: '/notes/', activeMatch: '/notes/', genSidebar: true }
    ]),
    smoothScroll: true,
    repo: 'https://github.com/lei4519/blog',
    docsRepo: 'https://github.com/lei4519/blog',
    docsBranch: 'master',
    docsDir: 'src',
    contributors: false,
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdatedText: '最近更新时间'
  }
})
