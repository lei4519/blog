const path = require('path')
const fs = require('fs')
function genSliderBar(dirname = '/') {
  const basePath = path.resolve(__dirname, '..', '..')
  const noParse = ['README.md', 'img']
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
          children: _readdir(path + name + '/', [], depth + 1)
        }
        arr.push(group)
      } else {
        arr.push({
          path: path + name,
          mtime: stat.mtime
        })
      }
    })
    return mergeSort(arr, (a, b) => {
      if (!a.mtime && !b.mtime) return false
      if (!b.mtime) return true
      return a.mtime < b.mtime
    }).map(item => item.path ? item.path : item)
  }
  return _readdir(dirname, [], 1)
}
function mergeSort (array, fn) {
  if (!fn || typeof fn !== 'function') fn = (a, b) => a > b
  // 分
  const divide = (arr) => {
    const len = arr.length
    if (len < 2) return arr
    const mid = len / 2 | 0
    return merge(divide(arr.slice(0, mid)), divide(arr.slice(mid)))
  }
  // 合
  const merge = (a1, a2) => {
    const a = []
    while (a1.length && a2.length) {
      a.push(fn(a1[0], a2[0])
        ? a2.shift()
        : a1.shift()
        )
    }
    return a.concat(a1, a2)
  }
  return divide(array)
}
function findFirstPath([first]) {
  return typeof first === 'string' ? first : findFirstPath(first.children)
}
function genNavAndSideBar(nav) {
  const sidebar = nav.reduce((sidebar, item) => {
    if (item.genSidebar) {
      sidebar[item.link] = genSliderBar(item.link)
      item.link = findFirstPath(sidebar[item.link])
    }
    return sidebar
  }, {})

  return {nav, sidebar}
}
module.exports = {
  genNavAndSideBar
}
