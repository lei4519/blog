const path = require('path')
const fs = require('fs')
function genSliderBar() {
  const noParse = ['README.md']
  const basePath = path.resolve(__dirname, '..', '..')
  const result = []
  const _readdir = (path, arr, depth) => {
    const dirsOrFiles = fs.readdirSync(basePath + path)
    dirsOrFiles.forEach(name => {
      if (name.indexOf('.') === 0) return
      if (noParse.includes(name)) return
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
        arr.push(path + name)
      }
    })
  }
  _readdir('/', result, 1)
  return result
}
genSliderBar()
module.exports = {
  genSliderBar
}