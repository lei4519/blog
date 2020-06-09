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
  themeConfig: {
    sidebar: utils.genSliderBar()
  }
}