const utils = require('./utils')
module.exports = {
  base: '/blog/',
  dest: './docs',
  title: 'Lay',
  description: 'lay的博客',
  plugins: [
    '@vuepress/back-to-top',
    [
      '@vuepress/last-updated',
      {
        transformer: (timestamp, lang) => {
          // 不要忘了安装 moment
          const moment = require('moment')
          moment.locale('zh-cn')
          return moment(timestamp).fromNow()
        }
      }
    ]
  ],
  themeConfig: {
    sidebar: utils.genSliderBar(),
    smoothScroll: true,
    repo: 'https://github.com/lei4519/blog',
    docsDir: 'src',
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '最后更新时间'
  }
}