const utils = require('./utils')
module.exports = {
  base: '/blog/',
  dest: './docs',
  title: 'Lay',
  description: 'lay的博客',
  extraWatchFiles: [
    '**/*.md',
    '**/*.vue',
    '**/*.js'
  ],
  plugins: ['@vuepress/back-to-top'],
  themeConfig: {
    sidebar: utils.genSliderBar(),
    smoothScroll: true,
    repo: 'https://github.com/lei4519/blog',
    docsDir: 'src',
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: true
  }
}