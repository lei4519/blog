---
tags:
  - Electron
  - Tutorials
  - FE
share: "true"
issue: "36"
created: 2020-12-19T20:16
updated: 2024-05-12T12:36
---

## 前言

对于一直面对电脑的程序员，眼睛的休息是很重要的。但是我们程序员又太过于勤勤恳恳、聚精会神、专心致志、任劳任怨！难免会忽略了时间的流逝。

所以我们迫切的需要一个定时提醒软件，来帮助我们管理时间！～

秉承着钻研技术的理念，这次我们就自己来动手做一个定时提醒软件。

本文将会从项目搭建 -> 代码实现 -> 应用打包，手把手一行行代码的带你完成这个项目。

看完本文你将学会什么知识呢？

1. electron：基本使用、进程通信、打包
2. vue3: composition API、路由、vite
3. node: 多进程相关知识

让我们开始吧～！

## 项目搭建

### Vue3 搭建（渲染进程代码）

首先搭建一个 vue3 的项目，我们将使用随着 vue3 的到来同样大火的 [vite](https://github.com/vitejs/vite) 来搭建。

```sh
$ yarn create vite-app remind-rest
$ cd remind-rest
$ yarn
$ yarn dev
```

执行完上面的命令，打开 `http://localhost:3000/` 就可以看到启动的 vue 项目了。

### 接入 electron（主进程代码）

接下来我们将 vue 项目放入 electron 中运行

首先安装 electron + typescript（注意设置淘宝源或者使用 cnpm 下载）

```sh
$ yarn add dev electron typescript
```

使用 `npx tsc --init` 初始化我们的 `tsconfig.json`，vue 中的 ts 文件会被 vite 进行处理，所以这里的 tsconfig 配置只处理我们的 electron 文件即可，我们增加 include 属性 `include: ["main/"]`。

我们会把打包后的代码都放到 `dist` 目录中，所以配置一下 `outDir` 属性，将 ts 编译后的文件放入 `dist/main` 目录中

修改如下

```json {3, 5}
{
  "compilerOptions": {
    "outDir": "./dist/main"
  },
  "include": ["main/"]
}
```

在根目录创建 `main` 文件夹，用来存放 electron 主进程中的代码

在 main 目录中新建 `index.ts`

```ts
const { app, BrowserWindow } = require("electron")
// Electron会在初始化完成并且准备好创建浏览器窗口时调用这个方法
app.whenReady().then(createWindow)

// 创建一个窗口
function createWindow() {
  const win = new BrowserWindow()
  win.loadURL("http://localhost:3000")
}
```

嗯，so easy！加上注释换行才 9 行代码，启动一下试试看～

我们在 package.json 中加一个脚本 `main-dev`，然后执行

```json {4}
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "main-dev": "electron ./main/index.ts"
}
```

不出意外你应该已经可以看到启动的桌面应用了，而里面显示的正是我们的 vue 项目。

至此，开发环境已经搭建完毕，接下来我们梳理一下需求，看一下我们要做的究竟有哪些功能。然后开始实现代码。

## 需求梳理

### 我们要实现哪些页面？

设置页面

![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/setting.png)

倒计时提示框

![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/tips.png)

锁屏页面

![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/rest.png)

### 我们需要实现什么功能？

![flow](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/flow.jpg)

1. 用户可以设置工作时间、休息时间、提示时间
2. 系统托盘栏中显示工作时间倒计时，托盘栏菜单项：`设置` `暂停` `继续` `重置` `退出`
3. 工作倒计时剩余时间等于提示时间，显示提示框，提醒用户还有几秒进入锁屏界面
4. 用户可以点击提示框中的 `暂停` 和 `重置` 按钮，对倒计时进行操作
5. 倒计时结束，进入锁屏界面
6. 进入锁屏界面后，屏幕上显示休息倒计时和关闭按钮。
7. 用户只能通过点击 `关闭` 按钮提前退出锁屏界面，其他所有常规操作都无法退出锁屏界面（如切换屏幕、切换软件、cmd + Q）
8. 休息倒计时结束，自动退出锁屏界面，重新开始工作时间倒计时

好了，需求梳理完毕，让我们开始快乐的 coding 吧 👌 ～

## 代码实现

### 完善渲染进程目录

在 vue 项目中创建如下文件

```tree
- src
  - main.js // 入口文件
  - route.js // 路由配置
  - App.vue
  - views
    - LockPage.vue // 锁屏界面
    - Tips.vue // 提示气泡界面
    - Setting.vue // 设置界面
```

安装 `vue-router`

```sh
yarn add vue-router@^4.0.0-alpha.4
```

其中 `main.js` `route.js` 都是 vue3 的新写法，和老版本没有太大区别，就不详细说明了，直接看代码吧

views 文件夹中的文件我们后面再具体实现

main.js

```js
import { createApp } from "vue"
import App from "./App.vue"
import router from "./route"
const app = createApp(App)
app.use(router)
router.isReady().then(() => app.mount("#app"))
```

route.js

```js
import { createRouter, createWebHashHistory } from "vue-router"
import LockPage from "./views/LockPage.vue"
import Tips from "./views/Tips.vue"
import Setting from "./views/Setting.vue"
export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/LockPage",
      name: "LockPage",
      component: LockPage,
    },
    {
      path: "/Tips",
      name: "Tips",
      component: Tips,
    },
    {
      path: "/Setting",
      name: "Setting",
      component: Setting,
    },
  ],
})
```

App.vue

```vue
<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "App",
}
</script>
```

### 完善主进程目录

```js
;-main -
  index.ts - // 入口
  tary.ts - // 托盘模块
  browserWindow.ts - // 创建渲染进程窗口
  countDown.ts - // 倒计时模块
  setting.ts - // 设置模块
  utils.ts - // 工具代码
  store.json // 本地存储
```

### 主进程自动重启

渲染进程的代码，每次我们修改之后都会进行热更新。而主进程的代码却没有这样的功能（社区中未找到相关实现），这就导致在主进程的开发过程中我们需要频繁的手动重启终端以去查看效果，这显然是一件很不效率的事情。这里我们通过 node 的 api 来简单实现一个主进程代码的自动重启的功能。

思路其实也很简单，就是监听到文件变更后，自动重启终端

首先我们需要使用 node 来运行终端命令，这样才能去进行控制。node 怎么运行终端命令呢？使用 child_process 中的 spawn 模块就可以了，不熟悉的同学可以看一下这片文章 [child_process spawn 模块详解](pages/Node/child_process%2520spawn%2520%E6%A8%A1%E5%9D%97%E8%AF%A6%E8%A7%A3.md.md)

在根目录新建一个 `scripts` 文件夹，用来存放我们的脚本文件

然后在 `scripts` 目录中创建 `createShell.js` `dev.js` 这两个文件

```sh
mkdir scripts
cd scripts
touch createShell.js dev.js
```

在 `createShell.js` 文件中，创建一个工厂函数，传入终端命令，返回执行此命令的终端实例，代码如下:

```js
const { spawn } = require("child_process")

module.exports = function createShell(command) {
  return spawn(command, {
    shell: true,
  })
}
```

接下来我们实现 `dev.js` 的内容，先来捋一下思路，当我们执行 `dev.js` 的时候，我们需要执行如下命令:

1. 启动 vite，运行渲染进程的代码
2. 启动 tsc，编译主进程的代码
3. 等到 tsc 编译成功，启动 electron
4. 监听到 electron 进程发出的重启信号，重启 electron

> [!TIP] 小提示  
> `&&` 代表串行命令，前一个执行完才会执行后一个  
> `&` 代表并行命令，前后两个命令同时执行

```js
// 引入我们刚才写的工厂函数
const createShell = require("./createShell")

// 运行vite 和 tsc
const runViteAndTsc = () =>
  new Promise((reslove) => {
    // 运行终端命令 下面会解释
    createShell(
      "npx vite & rm -rf ./dist/main && mkdir dist/main && cp -r main/store.json dist/main/store.json && tsc -w"
    ).stdout.on("data", (buffer) => {
      // 输出子进程信息到控制台
      console.log(buffer.toString())
      // tsc在每次编译生成后，会输出Watching for file changes
      // 这里利用Promise状态只会改变一次的特性，来保证后续的代码逻辑只执行一次
      if (buffer.toString().includes("Watching for file changes")) {
        reslove()
      }
    })
  })
// 运行electron
const runElectron = () => {
  // 定义环境变量，启动electron
  createShell("cross-env NODE_ENV=development electron ./dist/main/index.js")
    //监听到子进程的退出事件
    .on("exit", (code) => {
      // 约定信号100为重启命令，重新执行终端
      if (code === 100) runElectron()
      // 使用kill而不是exit，不然会导致子进程无法全部退出
      if (code === 0) process.kill(0)
    })
}

// 串起流程，执行命令
runViteAndTsc().then(runElectron)
```

在这里解释一下上面的终端命令，我们格式化一下

```sh
npx vite & rm -rf ./dist/main &&
mkdir dist/main &&
cp -r main/store.json dist/main/store.json &&
tsc -w

1. 运行vite，同时删除掉上一次编译产生的main目录
2. 删除目录后，重新建一个空的main目录
3. 重建的目的是为了这行的copy命令，ts不会编译非.ts文件，我们需要手动拷贝store.json文件
4. 拷贝完成后，开始编译ts
```

这里补充一下，自己来写启动命令除了实现自动刷新之外，还有下面的原因：

1. electron 也可以直接运行 ts 文件，但是并不会编译 ts，不编译的话在 ts 文件中就无法使用 import，不使用 import 就没办法获得代码自动导入和提示功能，所以要先使用 tsc 编译 ts 文件成为 js，然后再使用 electron 运行 js
2. 而直接在终端输入命令是无法实现上述流程的，因为我们需要使用 tsc -w 功能来监听文件变化重新编译，这就导致 ts 编译完成后并不会退出，所以无法使用 && 串行命令执行 electron，而使用 & 并行命令可能会出现 electron 运行时，ts 文件可能还没有编译成功导致 electron 加载文件不存在而启动失败的问题。所以我们需要自己写命令来进行控制。

以上只完成了第一步，接下来我们要监听文件变化并退出 electron 进程，退出时我们传入 code：100，来通知外部这是一次重启

先写一个辅助函数, 递归遍历指定目录下的所有文件，并执行传入的回调函数，向回调函数中传入当前文件的路径

`main/utils.ts`

```js
import fs from "fs"

type callback = (name: string) => void
export function readDeepDir(path: string, fn: callback) {
  const _reader = (path: string) => {
    fs.readdirSync(path).forEach((name) => {
      if (!fs.statSync(path + "/" + name).isDirectory()) {
        return fn(path + "/" + name)
      }
      return _reader(path + "/" + name)
    })
  }
  return _reader(path)
}
```

在 `main/index.ts` 中监听当前的主进程目录，只要有文件变化，我们就执行 `app.exit(100)` 退出当前进程

```js
import { readDeepDir } from "./utils"

function watchFile() {
  let debounce: NodeJS.Timeout
  const reload = () => {
    clearTimeout(debounce)
    debounce = setTimeout(() => {
      // 当前应用退出，外部进程接收到之后重启应用
      app.exit(100)
    }, 300)
  }
  // fs.watch并不稳定，使用watchFile进行监听
  const watcher = (path: string) => {
    fs.watchFile(path, reload)
  }
  readDeepDir(__dirname, watcher)
}
```

说明一下

1. 不使用 `fs.watch` 是因为这个 api 并不稳定，会导致刷新结果不符合预期。watchFile 是监听不到新增文件的，这个解决方案其实是借助 tsc -w 的能力，当有已监听的文件去引用新增文件的时候，就会导致 tsc 重新编译，然后触发自动刷新，当第二次启动 electron 的时候，就会把新的文件进行监听了
2. electron 是有 `app.relaunch()`api 的，调用这个 api 就会重启应用，那我们为什么不使用这个而要自己去写呢？是因为 `app.relaunch` 其实是另起了一个进程来运行新的 electron，当前这个进程我们需要执行 `app.exit()` 来退出才可以，这是在官网说明的。但是如果我们这么做的话，`app.relaunch` 启动的这个进程就会脱离了我们 `node scripts/dev.js` 这个进程的管控，导致我们中断 `node scripts/dev.js` 这个进程的时候，`app.relaunch` 启动的这个进程还在运行的问题。

到此自动刷新就完成了，让我们真正的来实现代码逻辑吧！

### 主进程实现

#### main/index.ts

```js
import { app } from "electron"
import fs from "fs"
import { inittary } from "./tary"
export const isDev = process.env.NODE_ENV === "development"
// 自动刷新
isDev && watchFile()

// 隐藏dock
app.dock.hide()

// Electron会在初始化完成并且准备好创建浏览器窗口时调用这个方法
app.whenReady().then(() => {
  inittary()
})
```

1. 首先我们获取到当前的环境信息，如果是开发环境，就把刚才实现的自动刷新功能使用上。
2. 隐藏 dock 栏，因为我们的应用功能主要在托盘栏，不需要展示 dock 栏的图标
3. 当我们的 app 启动完成后，初始化托盘栏

index.js 代码很简单，这里的 `inittary` 我们还没实现，在实现它之前，让我们先把倒计时模块写好

#### main/countDown.ts

首先定义些关于时间的常量

```js
export const BASE_UNIT = 60
export const SECONDS = 1000
export const MINUTES = SECONDS * BASE_UNIT
export const HOURS = MINUTES * BASE_UNIT
```

将倒计时模块写成一个类，方便管理

这个类有三个私有属性

```js
class CountDown {
  // 用来计算当前的时间
  private time = 0
  // 保存传入的时间，重置时会用到
  private _time = 0
  // 清除定时器，暂停时会用到
  private timer?: NodeJS.Timeout
}
```

接下来实现相关方法，我们需要有设置时间、暂停时间、重置时间，启动倒计时这几个功能

```js
setTime(ms: number) {
  // 如果之前有一个定时器在运行，就中断掉
  this.stop()
  this.time = this._time = ms
  return this
}
stop() {
  this.timer && clearInterval(this.timer)
}
resetTime() {
  this.time = this._time
  return this
}
run() {
  this.timer = setInterval(() => {
    this.time -= SECONDS
  }, SECONDS)
}
```

easy ～再定义一个静态方法，用于将时间戳转换为我们的需要的时间格式

```js
static formatTimeByMs(ms: number) {
  return {
    h: String((ms / HOURS) | 0).padStart(2, '0'),
    m: String((ms / MINUTES) % BASE_UNIT | 0).padStart(2, '0'),
    s: String((ms / SECONDS) % BASE_UNIT | 0).padStart(2, '0'),
  }
}
```

ok，大体功能写好了，接下来我们需要把时间的变化发送出去

为了时间的精确性，再使用时我们将为倒计时模块单独开一个进程，所以这里也使用进程通信的方式来发送消息

先定义发送消息的接口

```js
export interface SendMsg {
  // 格式化后的时间
  time: {
    h: string
    m: string
    s: string
  }
  // 原始时间戳
  ms: number
  // 时间是否归零
  done: boolean
}
```

写一个发送消息的方法

```js
private send(msg: SendMsg) {
  process.send!(msg)
}
```

然后在重置时间和启动时间时给父进程发送消息

```js
resetTime() {
  this.time = this._time
  this.send({
    time: CountDown.formatTimeByMs(this.time),
    ms: this.time,
    done: this.time <= 0
  })
  return this
}
run() {
  this.send({
    time: CountDown.formatTimeByMs(this.time),
    ms: this.time,
    done: this.time <= 0
  })
  this.timer = setInterval(() => {
    let done: boolean
    if (done = this.time <= 0) this.stop()
    this.send({
      time: CountDown.formatTimeByMs(this.time -= SECONDS),
      ms: this.time,
      done
    })
  }, SECONDS)
}
```

OK，发送消息的逻辑我们处理完成了，接下来处理一下接收消息的流程

首先定义接口，这会比较复杂，因为我们的这些方法中，setTime 是需要传入参数的，而其他的方法并不需要，如果想准确进行提示，那我们就需要这么做

首先我们将需要接收参数的方法名定义一个 type，这里是将类型当成了变量来使用

```js
type hasDataType = "setTime"
```

然后我们定义不接受参数的接口，这里使用了两个技巧

1. keyof：因为我们的类中向外暴露的其实只有 setTime、resetTime、run、stop，其他的都是私有变量或者静态方法，所以这里我们使用 keyof 就可以把这四个方法名取出来供类型系统使用
2. Exclude：我们取出的名称中，setTime 是需要传递参数的，所以使用 Exclude 将这个名称排除掉

这样操作之后，这里的 type 其实就是 resetTime | run | stop

```js
interface ReceiveMsgNoData {
  type: Exclude<keyof CountDown, hasDataType>
}
```

接收参数的接口就很简单了

```js
interface ReceiveMsgHasData {
  type: hasDataType
  data: number
}
```

最终定义一个联合类型供外部使用，这里之所以要定义数组类型，是为了方便外部使用，之后的代码中我们可以看到用法了

```js
export type ReceiveMsg =
  | ReceiveMsgNoData
  | ReceiveMsgHasData
  | Array<ReceiveMsgNoData | ReceiveMsgHasData>
```

接口定义完了，来实现一下代码

```js
const c = new CountDown()
process.on("message", (message: ReceiveMsg) => {
  if (!Array.isArray(message)) {
    message = [message]
  }
  message.forEach((msg) => {
    if (msg.type === "setTime") {
      c[msg.type](msg.data)
    } else {
      c[msg.type]()
    }
  })
})
```

接收消息的功能也实现了，至此倒计时模块就写完了，快让我们去 tary.js 中把它使用起来吧！～

#### main/tary.ts

同样的，tary 也将使用类来实现

在代码实现之前，我们先来捋一下逻辑

- 实例化 Tary 时：设置菜单项 -> 监听倒计时模块消息 -> 开始倒计时
- 监听倒计时时间变化
  1. 如果当前是工作时间的倒计时，设置托盘栏文字为当前时间
  2. 如果剩余时间等于提示时间，显示提示框，监听提示框进程的消息通信
  3. 工作倒计时结束：关闭提示框进程。打开锁屏窗口，切换至休息时间倒计时
  4. 时间变化时传递给锁屏渲染进程，以供渲染进程渲染时间
  5. 锁屏进程点击关闭或者倒计时归零，通知主进程关闭锁屏界面，切换至工作时间倒计时

先定义要使用的私有属性

```js
import { Tray as ElectronTary } from 'electron'

type TimeType = 'REST' | 'WORK'
class Tary {
  // 初始化托盘栏，并传入托盘图标
  private tray: ElectronTary = new ElectronTary(
    path.resolve(__dirname, '../icon/img.png')
  )
  // 标示当前时间为工作时间或休息时间
  private timeType: TimeType = 'WORK'
  // 菜单实例
  private menu: Menu | null = null
  // 锁屏窗口实例
  private restWindows: BrowserWindow[] | null = null
  // 提示框口实例
  private tipsWindow: BrowserWindow | null = null
  // 倒计时模块 使用 child_process.fork 创建一个子进程
  private countDown: ChildProcess = fork(path.resolve(__dirname, './countDown'))
}
```

定义向子进程发送消息的方法

```js
send(message: ReceiveMsg | ReceiveMsg[]) {
  this.countDown.send(message)
}
```

设置菜单项，这里其实就是调用 electron 的 api，详细的可以看官方文档。

当用户点击暂停、继续、重置时，给倒计时模块发送消息。偏好设置的功能我们后面再实现

```js
private setContextMenu() {
  this.menu = Menu.buildFromTemplate([
    {
      label: '偏好设置',
      accelerator: 'CmdOrCtrl+,',
      click: () => {},
    },
    {
      type: 'separator',
    },
    {
      id: 'play',
      label: '继续',
      accelerator: 'CmdOrCtrl+p',
      visible: false,
      click: (menuItem) => {
        this.send({
          type: 'run'
        })
        // 暂停和继续 只显示其中一个
        menuItem.menu.getMenuItemById('pause').visible = true
        menuItem.visible = false
      },
    },
    {
      id: 'pause',
      label: '暂停',
      accelerator: 'CmdOrCtrl+s',
      visible: true,
      click: (menuItem) => {
        this.send({
          type: 'stop'
        })
        // 暂停和继续 只显示其中一个
        menuItem.menu.getMenuItemById('play').visible = true
        menuItem.visible = false
      },
    },
    {
      label: '重置',
      accelerator: 'CmdOrCtrl+r',
      click: (menuItem) => {
        menuItem.menu.getMenuItemById('play').visible = false
        menuItem.menu.getMenuItemById('pause').visible = true
        this.startWorkTime()
      },
    },
    {
      type: 'separator',
    },
    { label: '退出', role: 'quit' },
  ])
  this.tray.setContextMenu(this.menu)
}
```

监听倒计时模块消息

```js
handleTimeChange() {
  this.countDown.on('message', (data: SendMsg) => {
    if (this.timeType === 'WORK') {
      this.handleWorkTimeChange(data)
    } else {
      this.handleRestTimeChange(data)
    }
  })
}
```

开始工作时间倒计时

```js
private startWorkTime() {
  this.send([
    {
      type: 'setTime',
      data: workTime,
    },
    {
      type: 'run',
    },
  ])
}
```

实例化时调用上面的方法

```js
constructor() {
  this.setContextMenu()
  this.handleTimeChange()
  this.startWorkTime()
}
```

上面代码执行完成后，倒计时就启动了，接下来就要处理时间变化的逻辑了

先来处理工作时间的变化

```js
handleWorkTimeChange({ time: {h, m, s}, ms, done }: SendMsg) {
  this.tary.setTitle(`${h}:${m}:${s}`) // 1
  if (ms <= tipsTime) {
    this.handleTipsTime(s, done) // 2
  } else if (this.tipsWindow) {
    this.closeTipsWindow() // 3
  }
  if (done) {
    this.toggleRest() // 4
  }
}
```

1. 首先我们使用 tary 模块的 setTitle api，将文字设置到托盘栏中。
2. 接着我们判断一下当前的时间是不是到了提示用户的时间，如果到了时间就开始展示提示框
3. else if 的逻辑是一个容错处理，如果当前时间不是提示时间，但是提示框却存在的话，就关闭提示框。这种情况在重置时间的时候会发生。
4. 如果工作时间结束了，就切换到处理休息时间的逻辑上。

##### 展示提示框

```ts
export const TIPS_MESSAGE = 'TIPS_MESSAGE'

handleTipsTime(s: string, done: boolean) {
  if (!this.tipsWindow) { // 初始化
    ipcMain.on(TIPS_MESSAGE, this.handleTipsMsg)
    this.tipsWindow = createTipsWindow(this.tary.getBounds(), s)
  } else { // 发送消息
    this.tipsWindow.webContents.send(TIPS_MESSAGE, {
      s,
      done
    })
  }
}
```

1. 如果是之前没有提示气泡窗口，就做初始化的工作：监听渲染进程的消息，创建提示气泡窗口
2. 如果已经有了窗口就向窗口中发送时间变化的消息。

监听提示框渲染进程的消息

```js
interface TipsMsgData {
  type: 'CLOSE' | 'RESET' | 'STOP'
}
handleTipsMsg = (event: IpcMainEvent, {type}: TipsMsgData) => {
  if (type === 'CLOSE') {
    this.closeTipsWindow()
  } else if (type === 'RESET') {
    this.closeTipsWindow()
    this.send({
      type: 'resetTime'
    })
  } else if (type === 'STOP'){
    this.closeTipsWindow()
    this.send({
      type: 'stop'
    })
    this.menu.getMenuItemById('play').visible = true
    this.menu.getMenuItemById('pause').visible = false
  }
}
closeTipsWindow() {
  if (this.tipsWindow) {
    ipcMain.removeListener(TIPS_MESSAGE, this.handleTipsMsg)
    this.tipsWindow.close()
    this.tipsWindow = null
  }
}
```

1. 如果是关闭的消息，就关闭提示窗口。关闭时先去除事件的监听，然后关闭窗口和引用
2. 如果是重置的消息，就关闭提示窗口，然后发消息通知计时器模块重置时间
3. 如果是停止的消息，就关闭提示窗口，然后通知计时器模块停止计时，然后将托盘栏的菜单项进行调整：显示继续菜单项，隐藏暂停菜单项

##### 创建提示气泡窗口

在 browserWindow.ts 中添加如下代码

```js
const resolveUrl = (address: string) => `http://localhost:3000/#${address}`

export function createTipsWindow(rect: Rectangle, s: string): BrowserWindow {
  const win = new BrowserWindow({
    x: rect.x, // 窗口x坐标
    y: rect.y, // 窗口y坐标
    width: 300, // 窗口宽度
    height: 80, // 窗口高度
    alwaysOnTop: true, // 一直显示在最上面
    frame: false, // 无边框窗口
    resizable: false, // 不可以resize
    transparent: true, // 窗口透明
    webPreferences: {
      webSecurity: false, // 忽略web安全协议
      devTools: false, // 不开启 DevTools
      nodeIntegration: true, // 将node注入到渲染进程
    },
  })
  // 加载Tips页面，传入消息通信的事件名称和时间
  win.loadURL(resolveUrl(`/Tips?type=${TIPS_MESSAGE}&s=${s}`))
  return win
}
```

##### Vue 渲染进程代码: src/views/Tips.vue

页面结构很简单，提示用户还有几秒开始休息，然后提供暂停和关闭的按钮

```vue
<template>
  <div class="wrap">
    <div class="title">还剩{{ time }}s开始休息～</div>
    <div class="progress"></div>
    <div class="btns">
      <button @click="stop">暂停</button>
      <button @click="reset">重置</button>
    </div>
  </div>
</template>
```

主要看一下逻辑代码

```vue
<script>
import { ref } from "vue"
import { useRoute } from "vue-router"
const { ipcRenderer } = require("electron")

export default {
  setup() {
    // 取到当前页面的query参数
    const { query } = useRoute()
    // 使用传入的s作为时间
    const time = ref(query.s)
    // 向主进程发送消息
    const close = () => {
      ipcRenderer.send(query.type, { type: "CLOSE" })
    }
    const stop = () => {
      ipcRenderer.send(query.type, { type: "STOP" })
    }
    const reset = () => {
      ipcRenderer.send(query.type, { type: "RESET" })
    }
    // 监听时间变化，修改时间
    ipcRenderer.on(query.type, (ipc, { s, done }) => {
      time.value = s
      if (done) close()
    })
    return {
      time,
      stop,
      reset,
    }
  },
}
</script>
```

为了节省篇幅，样式代码就不贴上来了，各位可以自行发挥，或者看下面的完整代码

到此，气泡提示的代码已经被我们完成了。接下来我们继续处理工作时间结束时，切换至休息时间的逻辑

##### 切换休息时间

```js
handleWorkTimeChange({ time: {h, m, s}, ms, done }: SendMsg) {
  // ...
  if (done) {
    this.toggleRest()
  }
}
toggleRest() {
  this.timeType = 'REST'
  this.closeTipsWindow()
  ipcMain.on(REST_MESSAGE, this.handleRestMsg)
  this.restWindows = createRestWindow()
}
```

1. 改变当前的 timeType
2. 关闭提示气泡窗口
3. 监听锁屏渲染进程的事件
4. 创建休息时间的窗口

##### 监听事件

```js
interface RestMsgData {
  type: 'CLOSE' | 'READY'
  data?: any
}
handleRestMsg = (event: IpcMainEvent, data: RestMsgData) => {
  if (data.type === 'READY') {
    this.startRestTime()
  } else if (data.type === 'CLOSE') {
    this.toggleWork()
  }
}
startRestTime = () => {
  this.send([
    {
      type: 'setTime',
      data: restTime
    },
    {
      type: 'run'
    }
  ])
}
toggleWork() {
  this.timeType = 'WORK'
  ipcMain.removeListener(REST_MESSAGE, this.handleRestMsg)
  this.restWindows?.forEach(win => {
    win.close()
  })
  this.restWindows = null
  this.startWorkTime()
}
```

代码很简单，当渲染进程初始化成功后（vue create 时机）会向我们发送 READY 事件，此时我们开始休息事件的倒计时。

当渲染进程的倒计时结束或者点击了关闭按钮时，会触发关闭事件，此时我们将切换回工作时间

再说一下切换回工作时间的逻辑

1. 切换 timeType 为工作时间
2. 移除事件监听
3. 关闭休息时间的窗口（注意这里的休息时间窗口是个数组，原因我们下面会说），解除引用
4. 开始工作时间倒计时

喝口水接着来！创建休息时间的窗口（锁屏界面）

main/browserWindow.ts

```js
export function createRestWindow(): BrowserWindow[] {
  return screen.getAllDisplays().map((display, i) => {
    // 创建浏览器窗口
    const win = new BrowserWindow({
      x: display.bounds.x + 50,
      y: display.bounds.y + 50,
      fullscreen: true, // 全屏
      alwaysOnTop: true, // 窗口是否应始终位于其他窗口的顶部
      closable: false, // 窗口是否可关闭
      kiosk: true, // kiosk模式
      vibrancy: "fullscreen-ui", // 动画效果
      webPreferences: {
        devTools: false,
        webSecurity: false,
        nodeIntegration: true,
      },
    })
    // 并且为你的应用加载index.html
    win.loadURL(
      resolveUrl(
        `/LockPage?type=${REST_MESSAGE}${
          i === 0 ? "&isMainScreen=1" : ""
        }&password=${password}`
      )
    )
    return win
  })
}
```

这个有几点需要特殊处理，因为我们希望出现锁屏界面时，用户就不可以进行别的操作了。

这里我们需要启用 kiosk 模式来达到效果

windows 中的 kiosk 模式介绍如下（取自百度）：

> 什么是 Windows 自助终端模式？  
> Windows Kiosk 模式只是 Windows 操作系统（OS）的一项功能，它将系统的可用性或访问权限仅限于某些应用程序。意思是，当我们在 Windows 上打开 Kiosk 模式时，它只允许一个应用程序运行，就像机场上的 kiosk 系统那样设置为仅运行 Web 浏览器，某些应用程序如 PNR 状态检查一个。  
> Kiosk 模式的好处是，它允许企业仅在办公室，餐馆等运行特定的销售点（POS）应用程序，以阻止客户使用机器上的任何其他应用程序，除了他们已分配的应用程序。它不仅可以在 windows 10 上使用，而且还可以在 Windows XP，Windows Vista，Windows 7 和 Windows 8.1 中启用。

简单点说就是让你的电脑只运行当前这个应用程序，阻止你使用别的应用程序。

主要的配置如下

```js
fullscreen: true, // 窗口全屏
alwaysOnTop: true, // 窗口一直显示在最上面
closable: false, // 窗口不可关闭
kiosk: true, // 窗口为kiosk模式
```

那代码中的 `screen.getAllDisplays()` 是干什么用的呢？这是为了防止外接显示器（程序员大多数都会外接的），如果我们只创建一个窗口，那只能让当前屏幕无法操作，而别的显示器还是可以正常工作的。所以我们使用这个 api 来获取到所有的显示器，然后为每一个显示器都创建一个窗口。

同时我们只让第一个窗口中出现提示信息和关闭按钮。所以我们给渲染进程传入一个主屏幕的标志。

vue 渲染进程代码 views/LockPage.vue

```vue
<template>
  <div v-if="isMainScreen" class="wrap">
    <div class="time">{{ time }}</div>
    <div class="btn" @click="close">X</div>
  </div>
</template>

<script>
export default {
  setup() {
    const { query } = useRoute()
    const time = ref("")
    const close = () => {
      ipcRenderer.send(query.type, { type: "CLOSE" })
    }
    const isMainScreen = ref(!!query.isMainScreen)
    if (isMainScreen) {
      ipcRenderer.send(query.type, { type: "READY" })
      ipcRenderer.on(query.type, (ipc, { time: { h, m, s }, done }) => {
        time.value = `${h}:${m}:${s}`
        if (done) close()
      })
    }
    return {
      isMainScreen,
      time,
      close,
    }
  },
}
</script>
```

逻辑很简单，如果是主屏幕，那初始化的时候我们就发送一个 ready 事件，然后监听时间变化。如果时间结束就发送关闭的事件。

至此，就只剩设置相关的逻辑没有写

#### main/setting.ts

```js
import fs from "fs"
import path from "path"

const storePath = path.resolve(__dirname, "./store.json")

function get() {
  const store = fs.readFileSync(storePath, "utf-8")
  return JSON.parse(store)
}

export let { restTime, tipsTime, workTime } = get()

export function setTime(rest: number, work: number, tips: number) {
  restTime = rest
  tipsTime = tips
  workTime = work
  fs.writeFileSync(
    storePath,
    JSON.stringify({ restTime, tipsTime, workTime }, null, 2)
  )
}
```

逻辑：从本地文件中获取工作、休息、提示时间，当设置新的时间时再改写本地文件

#### 设置窗口

完善托盘栏菜单项的代码

```js
interface SettingMsgData {
  rest: number
  work: number
  tips: number
}
Menu.buildFromTemplate([
  {
    label: '偏好设置',
    accelerator: 'CmdOrCtrl+,',
    click: () => {
      const win = createSettingWindows(restTime, tipsTime, workTime)
      const handleSettingMsg = (event: IpcMainEvent, {rest, work, tips}: SettingMsgData) => {
        setTime(rest, work, tips)
        win.close()
      }
      win.on('close', () => {
        ipcMain.removeListener(SETTING_MESSAGE, handleSettingMsg)
      })
      ipcMain.on(SETTING_MESSAGE, handleSettingMsg)
    },
  }
])
```

当我们点击设置菜单项时

1. 创建一个设置窗口
2. 监听设置窗口发送来的消息
3. 当设置窗口关闭时移除消息监听

而设置窗口发消息的时机就是当用户点击保存的时候，此时会把设置之后的工作时间、休息时间、提示时间传过来。我们设置到本地即可

下面我们看一下创建窗口和渲染进程的逻辑

main/browserWindow.ts

```js
export function createSettingWindows(
  restTime: number,
  tipsTime: number,
  workTime: number
) {
  const win = new BrowserWindow({
    maximizable: false,
    minimizable: false,
    resizable: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true, // 将node注入到渲染进程
    },
  })
  win.loadURL(
    resolveUrl(
      `/Setting?type=${SETTING_MESSAGE}&rest=${restTime}&tips=${tipsTime}&work=${workTime}`
    )
  )
  return win
}
```

vue: views/setting.vue

```js
export default {
  setup() {
    const { query } = useRoute()
    const rest = ref(+query.rest / MINUTES)
    const work = ref(+query.work / MINUTES)
    const tips = ref(+query.tips / SECONDS)
    const save = () => {
      ipcRenderer.send(query.type, {
        rest: rest.value * MINUTES,
        work: work.value * MINUTES,
        tips: tips.value * SECONDS,
      })
    }
    const reset = () => {
      rest.value = +query.rest / MINUTES
      work.value = +query.work / MINUTES
      tips.value = +query.tips / SECONDS
    }
    return {
      rest,
      work,
      tips,
      save,
      reset,
    }
  },
}
```

好了，至此我们的代码已经完全实现了。

但是现在还有一个点需要解决，那就是电脑休眠时，我们应该让计时功能暂停。

我们在 `main/index.ts` 中修改如下代码

```js {4,5,6,7,8,10,11,12,13,14}
app.whenReady().then(() => {
  const tray = initTray()
  // 系统挂起
  powerMonitor.on("suspend", () => {
    tray.send({
      type: "stop",
    })
  })
  // 系统恢复
  powerMonitor.on("resume", () => {
    tray.send({
      type: "run",
    })
  })
})
```

好了，就是监听两个事件的事～都是些 api，就不多说了。

接下来我们打包一下 electorn，让我们的代码可以在电脑上安装。

## 项目打包

项目打包主流的方式有两种：`electron-builder` 和 `electron-packager`

`electron-builder` 会把项目打成安装包，就是我们平时安装软件的那种形式。

`electron-packager` 会把项目打包成可执行文件，你可以理解为上面 👆 的安装包安装之后的软件目录。

下面我们分别介绍一下这两种的打包步骤（这里只打包了 mac 版本，win 版本可自行查阅官网，差别不大）

### `electron-builder` 打包

安装

```sh
cnpm i electron-builder --save-dev
```

`package.json` 新增 `build` 项

```json
"build": {
  // 软件的唯一id
  "appId": "rest.time.lay4519",
  // 软件的名称
  "productName": "Lay",
  // 要打包的文件
  "files": [
    "node_modules/",
    "dist/",
    "package.json"
  ],
  // 打包成mac 安装包
  "dmg": {
    "contents": [
      {
        "x": 130,
        "y": 220
      },
      {
        "x": 410,
        "y": 220,
        "type": "link",
        "path": "/Applications"
      }
    ]
  },
  // 设置打包目录
  "directories": {
    "output": "release"
  }
}
```

增加脚本

```json
"scripts": {
  // ...
  "buildMac": "cp -r icon dist/icon && npx electron-builder --mac --arm64"
}
```

### `electron-packager` 打包

增加脚本

```json
"scripts": {
  // ...
  "packageMac": "rm -rf ./dist && npx vite build && tsc && cp -r icon dist/icon & cp main/store.json dist/main/store.json && electron-packager . --overwrite"
}
```

这个大概解释一下

1. 清空 dist 目录
2. 使用 vite build 渲染进程代码
3. tsc 编译主进程代码
4. 拷贝 icon 文件夹、main/store.json
5. electron-packager 打包当前文件夹

好了，打包已经完成了。但是你以为到此就结束了吗？

点开 vite 打包后的 index.html，你会发现 script 标签上有一个 `type="module"`，这意味着 vite 默认打包后，还是使用了 es6 的模块机制，这个机制依赖了 http，所以我们无法使用 `file` 协议来加载文件。

也就是说，这个 html 我们双击打开是无法运行的，所以你在 electron 里直接 loadFile 也是无法运行的。

怎么解决呢？也许 vite 可以配置 CMD、AMD 的模块机制，但是我也懒得再去翻阅文档了。反正是用的 electron，我们直接在本地起一个 http 服务就是

main/browserWindow.ts

```js
const productPort = 0
const resolveUrl = (address: string) => `http://localhost:${isDev ? 3000 : productPort}/#${address}`

if (!isDev) {
 // 检测端口是否被占用
  const portIsOccupied = (port: number): Promise<number> => {
    return new Promise(r => {
      const validate = (p: number) => {
        const server: http.Server = http
          .createServer()
          .listen(p)
          .on('listening', () => {
            server.close()
            r(p)
          })
          .on('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
              server.close()
              validate(p += 1)
            }
          })
      }
      validate(port)
    })
  }
  // 执行
  portIsOccupied(8981)
    .then((p) => {
      productPort = p
      http.createServer((req, res) => {
        if (req.url === '/') {
          // content-type: application/javascript
          return fs.readFile(path.resolve(__dirname, '..', 'renderer/index.html'), (err, data) => {
            if (err) return
            res.setHeader('content-type', 'text/html; charset=utf-8')
            res.end(data)
          })
        } else {
          return fs.readFile(path.resolve(__dirname, '..', 'renderer' + req.url), (err, data) => {
            if (err) return
            if (req.url!.endsWith('.js')) {
              res.setHeader('content-type', 'application/javascript')
            } else if (req.url!.endsWith('.css')) {
              res.setHeader('content-type', 'text/css')
            }
            // 缓存7天
            res.setHeader('cache-control', 'max-age=604800')
            res.end(data)
          })
        }
      })
      .listen(p)
    })
}
```

好啦，这下我们就真正的把代码完成了～

[完整代码点此](https://github.com/lei4519/remind-rest)，觉得文章还可以的欢迎 star、following。

如果有什么问题欢迎在评论区提出讨论。感谢观看 🙏
