---
tags:
 - electron
 - vue
 - vue3
 - vite
 - ts
 - typescript
---
# 使用Electron + Vue3 + Ts 实现定时提醒休息软件

## 前言
最近感觉眼神越来越不好了，究其原因是平时工作太认真，代码一敲就是一下午，完全感知不到时间的流逝呀！于是呢，就下载了一个时间提醒软件`MagicanRest`，来提醒自己休息。用了两天发现还是很好用的，而且功能并不复杂，就想着自己也来写一个玩玩。加上最近Vue3正火，于是就有了这篇文章。

本文将会从项目搭建 -> 代码实现 -> 应用打包，一步步手把手的带你完成这个项目。

让我们开始吧～！

## 项目搭建

### Vue3搭建（渲染进程代码）

首先搭建一个vue3的项目，我们将使用同样处于焦点的[vite](https://github.com/vitejs/vite)来搭建。

```sh
$ yarn create vite-app remind-rest
$ cd remind-rest
$ yarn
$ yarn dev
```

执行完上面的命令，打开`http://localhost:3000/`就可以看到我们启动的vue项目了。

### 接入electron（主进程代码）

接下来我们将vue项目放入electron中运行，首先安装electron + typescript（注意设置淘宝源或者使用cnpm下载）
```sh
$ yarn add dev electron typescript
```
接着我们创建`main`文件夹，用来存放electron主进程中的代码

然后使用`npx tsc --init`初始化我们的`tsconfig.json`，vue中的ts文件会被vite进行处理，所以这里的tsconfig配置只处理我们的electron文件即可，我们增加include属性`include: ["main"]`

接着我们编写一下主进程的代码，在主进程中加载我们启动的vue页面即可。

在main目录中新建`index.ts`

```ts
const {app, BrowserWindow} = require('electron')
// Electron会在初始化完成并且准备好创建浏览器窗口时调用这个方法
app.whenReady().then(createWindow)

// 创建一个窗口
function createWindow() {
  const win = new BrowserWindow()
  win.loadURL('http://localhost:3000')
}
```

嗯，so easy！加上注释换行才9行代码，启动一下试试看～

我们在package.json中加一个脚本, 同时调整一下命令的名称，然后执行`main-dev`

```json {2,3,4}
"scripts": {
  "renderer-dev": "vite",
  "renderer-build": "vite build",
  "main-dev": "electron ./main/index.ts"
}
```

不出意外你应该已经可以看到启动的桌面应用了，而里面显示的正是我们的vue项目。

至此，开发环境已经搭建完毕，接下来我们梳理一下需求，然后开始实现代码

## 需求梳理

我们需要实现什么功能？
- 需求分析（产品角度）
  - 主流程
    1. 用户进入软件后，可以设置工作时间、休息时间、解锁密码
    2. 菜单栏中显示工作时间倒计时，计时结束显示锁屏界面
    3. 锁屏界面中显示休息时间倒计时，倒计时结束关闭锁屏界面，重新开始工作时间倒计时
    4. 锁屏界面中有关闭按钮，点击关闭按钮，进行密码判断
    5. 如设置了密码，输入正确密码后，立即关闭锁屏界面，重新开始工作时间倒计时
    6. 若没有设置密码将立即关闭锁屏界面，重新开始工作时间倒计时
    7. 在锁屏页面中，用户只能通过点击关闭按钮关闭锁屏界面。不能通过其他操作关闭页面

  - 拓展功能

    1. 菜单栏中点击倒计时，可以唤起菜单，菜单项为[设置，暂停，继续，重置，退出]
    2. 工作时间倒计时剩15s时，弹出气泡提示用户 `n秒后将进入锁屏界面`，气泡中可以有操作项[暂停，重置]

简单画个流程图～
![](./img/flow.jpg)


- 需求分析（开发角度）
  - 渲染进程
    1. 设置界面样式
    2. 锁屏界面样式
    3. 倒计时即将结束气泡样式
    4. 数据与主进程通信同步

  - 主进程
    1. 计时功能
    2. 锁屏界面显示时，`锁定`电脑，不允许用户进行其他操作
    3. 与渲染进程通信

好的，需求梳理完毕后，让我们开始codeing吧👌～

## 代码实现

首先安装一个并发执行命令的包，同时运行主进程和渲染进程
`yarn add dev concurrently`

然后增加scripts命令, 并运行`yarn dev`
`"dev": "concurrently \"yarn renderer-dev\" \"yarn main-dev\""`

项目启动之后，我们先来完成主进程的代码

### 主进程实现

为什么要自己来写启动命令？

1. electron 也可以直接运行ts文件，但是这样在ts文件中无法使用import，不使用import就没办法获得代码自动导入和提示功能，所以要先使用tsc编译ts文件成为js，然后在使用electron运行
2. 我们需要使用 tsc -w功能来监听文件变化重新编译，所以无法使用 && 串行命令执行electron，而使用&并行命令可能会出现electron运行时，ts文件可能还没有编译成功导致加载文件失败的问题。所以我们自己来写一个并行命令来进行控制。