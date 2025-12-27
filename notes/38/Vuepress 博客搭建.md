---
tags:
  - Blog
  - Tutorials
share: "true"
issue: "38"
created: 2020-06-07T20:21
updated: 2024-05-12T12:36
---

技术的沉淀免不了分享和记录，用本文记录了一下自己搭建博客的过程。

本文将一步步带你实现：

- 使用 `vuepress` + `gitPage` 搭建并部署你的博客网站
- 利用 `nodejs fs api` 根据项目目录自动配置博客侧边栏
- 使用 `nodejs child_process` 一键部署你的博客网站

让赶快我们开始吧～

> [!Warning] 注意事项  
> `vuepress v1.5.0` 存在热更新不生效的问题，请注意升级版本

本项目使用 `yarn`，如使用 `npm` 请自行替换

## 项目初始化

首先让我们新建一个文件夹作为项目的根目录, 然后进入此目录

```sh
 mkdir blog
 cd blog
```

接着来进行 git 和 npm 的初始化工作，并创建 `.gitignore` 文件，在 `.gitignore` 中忽略 `node_modules` 文件夹

```sh
 npm init -y
 git init
 echo node_modules >> .gitignore
```

我们使用 `src` 目录作为项目的入口目录，创建一下它

```sh
mkdir src
```

至此，项目目录已经搭建完毕，接下来开始配置一下 vuepress

## 安装配置 Vuepress

安装 vuepress 依赖

```sh
 yarn add vuepress
```

在 src 目录中创建 `.vuepress目录`，并在 `.vuepress` 中创建 `config.js`

```sh
cd src
mkdir .vuepress
touch config.js
```

在 `config.js` 中写入以下代码

```js
module.exports = {
  // 项目的基础路径，可以理解为github的仓库名称
  base: "/blog/",
  // 打包的输出目录，这里使用docs是为了配合gitpage部署，下面会讲
  dest: "./docs",
  // 博客的标题
  title: "Lay",
  // 描述
  description: "lay的博客",
  // 主题配置
  themeConfig: {
    // 侧边栏
    sidebar: ["/"],
    // 开启滚动效果
    smoothScroll: true,
    // 仓库地址，用于编辑跳转使用
    repo: "https://github.com/lei4519/blog",
    // 开发目录
    docsDir: "src",
    // 开启页面编辑功能
    editLinks: true,
    editLinkText: "在 GitHub 上编辑此页",
    // 更新时间文字
    lastUpdated: "最后更新时间",
  },
}
```

在 `src目录` 中新建 `README.md` 文件，用作博客的首页，并增加如下内容

```sh
touch README.md
```

```
---
home: true
heroText: 博客
tagline: 前端技术分享
actionText: 开始阅读 →
---
```

配置 package.json `script` 字段

```json
"scripts": {
  "dev": "vuepress dev src",
  "build": "vuepress build src"
}
```

运行 `yarn dev`，我们可以在浏览器中看到搭建好的博客首页

接着我们在 src 中新建 `hello.md`, 在里面随便写点内容，然后在 `README.md` 中新增 `actionLink` 属性，值为我们的路径（/blog/应保持和 config.js 中的 base 属性一直）

```{6}
---
home: true
heroText: 博客
tagline: 前端技术分享
actionText: 开始阅读 →
actionLink: /blog/hello
---
```

接着我们点击首页的开始阅读按钮，就会跳转至 hello 页面了

ok，到此我们的项目配置已经完成，接下来让我们配合 gitpage 来部署我们的博客。

## 项目部署

首页执行 `yarn build` 来打包代码

然后在 github 创建一个新的仓库，上传我们刚才写的代码（这个步骤就不写了，不会的可以自行百度）

上传成功之后，进入刚才创建的仓库中，点击 `Settings` 进入仓库配置

![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/202404162020317.png)

进入之后直接向下滚动找到 GitHub Pages 选项，在 Source 选项中选择 `master barnch /docs folder`

![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/202404162021153.png)

这样就可以直接使用我们仓库的 `docs` 目录作为我们网站的根目录，并且我们每次需要部署线上网站时，只需要 `yarn build` 之后推送代码到 git 仓库，线上博客就会自动更新，完全不需要额外的操作，十分方便。

## 封装部署操作

刚才我们提到，每次更新部署，只需要 `yarn build` 之后推送代码到 git 仓库即可，虽然很简单，但是也要以下命令一顿操作才可以

```sh
yarn build
git add .
git commit -m '这次的更新信息'
git push
```

每次这样执行显然不符合程序员的 `don't repeat` 原则，我们很容易就会发现上面的命令中只有提交信息是每次变化的，那我们可不可以将不变的部分提取出来呢？

当然是可以的，既然是前端开发，那我们就是用原生的 nodejs 来简单实现一个命令行交互的功能

在项目根目录新建 `release.js`，并将 package.json `script` 字段调整如下

```json {3}
"scripts": {
  "dev": "vuepress dev src",
  "release": "node release.js"
}
```

接着我们来完善 `release.js`，代码如下

```js
// 封装一个命令行执行函数
function sh(commitMsg) {
  const { spawn } = require("child_process")
  // 创建一个运行bash的进程
  const bash = spawn("bash")
  // 错误事件监听
  bash.on("error", function () {
    console.log("error")
    console.log(arguments)
  })
  // 输出信息监听
  bash.stdout.on("data", onData)
  bash.stderr.on("data", onData)
  function onData(data) {
    process.stdout.write(data)
  }
  // 运行结束事件
  bash.on("close", (code) => {
    console.log(`打包完成：${code}`)
    process.exit(code)
  })
  // 像bash中写入以下命令
  bash.stdin.write(`vuepress build src
  git add .
  git commit -m ${commitMsg}
  git push`)
  // 开始执行
  bash.stdin.end()
}
// 检测执行此文件时是否传入了提交信息
// process.argv： ['node', 'release.js', '提交信息']
if (!process.argv[2]) {
  // 如果没有传入提醒输入git信息
  process.stdin.on("data", (data) => {
    data = data.toString()
    if (!data.toString().trim()) {
      console.log("请输入git提交信息：")
    } else {
      sh(data)
    }
  })
  console.log("请输入git提交信息：")
} else {
  // 如果传入了直接执行命令行
  sh(process.argv[2])
}
```

接下来我们只需要运行 `node release.js 提交信息` 就可以直接将代码推送到 github 上了。

## 根据项目目录自动配置 Sidebar

以上的配置还有一些问题，如果你看了 vuepress 文档，就会发现 slider 的配置虽然有 auto 选项，但是实际效果并不如人意，而自己去配置又太过繁琐，那有没有什么办法可以不使用官方的 auto 属性又可以自动配置侧边栏呢？

当然是可以的，前端的朋友一定不会陌生 webpack 中的 require.context 函数，我们经常使用这个来自动生成路由配置等信息，在这里我们也可以用这个思路来根据项目目录来生成侧边栏配置。

这里我们使用 nodejs fs 模块来实现目录读取，并根据文件的更新时间，使用归并排序来对同一个目录中的文件进行排序

我们将这个工具方法建立在 `/src/.vuepress/utils/index.js` 中

具体实现如下

```js
const path = require("path")
const fs = require("fs")
// 生成侧边栏配置信息
function genSliderBar() {
  // 项目根目录
  const basePath = path.resolve(__dirname, "..", "..")
  // 需要排除的目录和文件
  const excludes = ["README.md", "img"]
  // 目录读取函数
  // path是当前目录的父目录路径
  // arr 用来存放读取到的目录和文件
  // depth 用来记录目录的深度，也是用作slide配置中的sidebarDepth值
  const _readdir = (path, arr, depth) => {
    // 读取目录
    const dirsOrFiles = fs.readdirSync(basePath + path)
    // 遍历目录中的每一项
    dirsOrFiles.forEach((name) => {
      // 以.开头和excludes中的文件都不做处理
      if (name.indexOf(".") === 0) return
      if (excludes.includes(name)) return
      // 拿到当前项的信息
      const stat = fs.statSync(basePath + path + name)
      // 如果是目录
      if (stat.isDirectory()) {
        // 读取这个目录中的信息
        const rawChildren = _readdir(path + name + "/", [], depth + 1)
        // 对目录中的文件，根据更新时间进行排序
        const sortChildren = mergeSort(rawChildren, (a, b) => {
          // 没有更新时间代表当前项是目录，目录都放在文件的上方
          if (!b.mtime) return true
          return a.mtime < b.mtime
        })
        // 将当前目录的配置信息放入arr中
        // children的操作是提取文件的path信息，真正的sidebar配置中是不需要mtime属性的
        arr.push({
          title: name,
          sidebarDepth: depth,
          children: sortChildren.map((item) => (item.path ? item.path : item)),
        })
      } else {
        // 如果不是目录，则放入arr中
        arr.push({
          path: path + name,
          mtime: stat.mtime,
        })
      }
    })
    return arr
  }
  return _readdir("/", [], 1)
}
// 归并排序
function mergeSort(array, fn) {
  // 函数安全检测
  if (!fn || typeof fn !== "function") fn = (a, b) => a > b
  // 分
  const divide = (arr) => {
    const len = arr.length
    if (len < 2) return arr
    const mid = (len / 2) | 0
    return merge(divide(arr.slice(0, mid)), divide(arr.slice(mid)))
  }
  // 合
  const merge = (a1, a2) => {
    const a = []
    while (a1.length && a2.length) {
      a.push(fn(a1[0], a2[0]) ? a2.shift() : a1.shift())
    }
    return a.concat(a1, a2)
  }
  return divide(array)
}

module.exports = {
  genSliderBar,
}
```

接着在我们的 config.js 中配置即可

```js
themeConfig: {
  sidebar: utils.genSliderBar()
}
```

## 配置导航栏

接下来我们新增一下导航栏，将博客进行分类

## 添加评论功能：GitTalk

## 结束语

好的，到此我们的博客搭建就算告一段落了。

如果遇到问题，可以去 github 中问我。

如果觉得我写的还不错，欢迎去 github 中给个 star ～谢谢观看 🙏
