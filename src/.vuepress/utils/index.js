const path = require('path')
const fs = require('fs')
function genSliderBar() {
  const basePath = path.resolve(__dirname, '..', '..', 'zh')
  const result = []
  const _readdir = (path, arr, depth) => {
    const dirsOrFiles = fs.readdirSync(basePath + path)
    dirsOrFiles.forEach(name => {
      const stat = fs.statSync(basePath + path + name)
      if (stat.isDirectory()) {
        const group = {
          title: name,
          sidebarDepth: depth,
          children: []
        }
        arr.push(group)
        _readdir(path + name + '/', group.children, depth + 1)
      } else {
        arr.push('/zh' + path + name)
      }
    })
  }
  _readdir('/', result, 1)
  return result
}
module.exports = {
  genSliderBar
}