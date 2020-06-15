const {genNavAndSideBar} = require('./utils')
module.exports = {
  base: '/blog/',
  dest: './docs',
  title: 'Lay',
  description: 'lay的博客',
  plugins: [
    'flowchart',
    '@vuepress/back-to-top',
    [
      '@vuepress/last-updated',
      {
        transformer: (timestamp, lang) => {
          const moment = require('moment')
          moment.locale('zh-cn')
          return moment(timestamp).fromNow()
        }
      }
    ]
  ],
  themeConfig: {
    ...genNavAndSideBar([
      { text: 'Home', link: '/' },
      { text: '技术分享', link: '/technology/', genSidebar: true },
      { text: '实战分享', link: '/practice/', genSidebar: true },
      { text: '烂笔头', link: '/notes/', genSidebar: true }
    ]),
    smoothScroll: true,
    repo: 'https://github.com/lei4519/blog',
    docsDir: 'src',
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '最后更新时间'
  }
}