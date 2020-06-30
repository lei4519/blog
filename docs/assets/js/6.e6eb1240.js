(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{362:function(t,s,a){t.exports=a.p+"assets/img/flow.712802e8.jpg"},384:function(t,s,a){"use strict";a.r(s);var e=a(11),n=Object(e.a)({},(function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h1",{attrs:{id:"使用electron-vue3-ts-实现定时提醒休息软件"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#使用electron-vue3-ts-实现定时提醒休息软件"}},[t._v("#")]),t._v(" 使用Electron + Vue3 + Ts 实现定时提醒休息软件")]),t._v(" "),e("h2",{attrs:{id:"前言"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#前言"}},[t._v("#")]),t._v(" 前言")]),t._v(" "),e("p",[t._v("最近感觉眼神越来越不好了，究其原因是平时工作太认真，代码一敲就是一下午，完全感知不到时间的流逝呀！于是呢，就下载了一个时间提醒软件"),e("code",[t._v("MagicanRest")]),t._v("，来提醒自己休息。用了两天发现还是很好用的，而且功能并不复杂，就想着自己也来写一个玩玩。加上最近Vue3正火，于是就有了这篇文章。")]),t._v(" "),e("p",[t._v("本文将会从项目搭建 -> 代码实现 -> 应用打包，一步步手把手的带你完成这个项目。")]),t._v(" "),e("p",[t._v("让我们开始吧～！")]),t._v(" "),e("h2",{attrs:{id:"项目搭建"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#项目搭建"}},[t._v("#")]),t._v(" 项目搭建")]),t._v(" "),e("h3",{attrs:{id:"vue3搭建（渲染进程代码）"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#vue3搭建（渲染进程代码）"}},[t._v("#")]),t._v(" Vue3搭建（渲染进程代码）")]),t._v(" "),e("p",[t._v("首先搭建一个vue3的项目，我们将使用同样处于焦点的"),e("a",{attrs:{href:"https://github.com/vitejs/vite",target:"_blank",rel:"noopener noreferrer"}},[t._v("vite"),e("OutboundLink")],1),t._v("来搭建。")]),t._v(" "),e("div",{staticClass:"language-sh extra-class"},[e("pre",{pre:!0,attrs:{class:"language-sh"}},[e("code",[t._v("$ "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("yarn")]),t._v(" create vite-app remind-rest\n$ "),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("cd")]),t._v(" remind-rest\n$ "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("yarn")]),t._v("\n$ "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("yarn")]),t._v(" dev\n")])])]),e("p",[t._v("执行完上面的命令，打开"),e("code",[t._v("http://localhost:3000/")]),t._v("就可以看到我们启动的vue项目了。")]),t._v(" "),e("h3",{attrs:{id:"接入electron（主进程代码）"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#接入electron（主进程代码）"}},[t._v("#")]),t._v(" 接入electron（主进程代码）")]),t._v(" "),e("p",[t._v("接下来我们将vue项目放入electron中运行，首先安装electron + typescript（注意设置淘宝源或者使用cnpm下载）")]),t._v(" "),e("div",{staticClass:"language-sh extra-class"},[e("pre",{pre:!0,attrs:{class:"language-sh"}},[e("code",[t._v("$ "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("yarn")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("add")]),t._v(" dev electron typescript\n")])])]),e("p",[t._v("接着我们创建"),e("code",[t._v("main")]),t._v("文件夹，用来存放electron主进程中的代码")]),t._v(" "),e("p",[t._v("然后使用"),e("code",[t._v("npx tsc --init")]),t._v("初始化我们的"),e("code",[t._v("tsconfig.json")]),t._v("，vue中的ts文件会被vite进行处理，所以这里的tsconfig配置只处理我们的electron文件即可，我们增加include属性"),e("code",[t._v('include: ["main"]')])]),t._v(" "),e("p",[t._v("接着我们编写一下主进程的代码，在主进程中加载我们启动的vue页面即可。")]),t._v(" "),e("p",[t._v("在main目录中新建"),e("code",[t._v("index.ts")])]),t._v(" "),e("div",{staticClass:"language-ts extra-class"},[e("pre",{pre:!0,attrs:{class:"language-ts"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("app"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" BrowserWindow"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("require")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'electron'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Electron会在初始化完成并且准备好创建浏览器窗口时调用这个方法")]),t._v("\napp"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("whenReady")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("then")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("createWindow"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 创建一个窗口")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("createWindow")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" win "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("BrowserWindow")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  win"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("loadURL")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'http://localhost:3000'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),e("p",[t._v("嗯，so easy！加上注释换行才9行代码，启动一下试试看～")]),t._v(" "),e("p",[t._v("我们在package.json中加一个脚本, 同时调整一下命令的名称，然后执行"),e("code",[t._v("main-dev")])]),t._v(" "),e("div",{staticClass:"language-json extra-class"},[e("div",{staticClass:"highlight-lines"},[e("br"),e("div",{staticClass:"highlighted"},[t._v(" ")]),e("div",{staticClass:"highlighted"},[t._v(" ")]),e("div",{staticClass:"highlighted"},[t._v(" ")]),e("br"),e("br")]),e("pre",{pre:!0,attrs:{class:"language-json"}},[e("code",[e("span",{pre:!0,attrs:{class:"token property"}},[t._v('"scripts"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token property"}},[t._v('"renderer-dev"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v('"vite"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token property"}},[t._v('"renderer-build"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v('"vite build"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token property"}},[t._v('"main-dev"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v('"electron ./main/index.ts"')]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),e("p",[t._v("不出意外你应该已经可以看到启动的桌面应用了，而里面显示的正是我们的vue项目。")]),t._v(" "),e("p",[t._v("至此，开发环境已经搭建完毕，接下来我们梳理一下需求，然后开始实现代码")]),t._v(" "),e("h2",{attrs:{id:"需求梳理"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#需求梳理"}},[t._v("#")]),t._v(" 需求梳理")]),t._v(" "),e("p",[t._v("我们需要实现什么功能？")]),t._v(" "),e("ul",[e("li",[t._v("需求分析（产品角度）\n"),e("ul",[e("li",[e("p",[t._v("主流程")]),t._v(" "),e("ol",[e("li",[t._v("用户进入软件后，可以设置工作时间、休息时间、解锁密码")]),t._v(" "),e("li",[t._v("菜单栏中显示工作时间倒计时，计时结束显示锁屏界面")]),t._v(" "),e("li",[t._v("锁屏界面中显示休息时间倒计时，倒计时结束关闭锁屏界面，重新开始工作时间倒计时")]),t._v(" "),e("li",[t._v("锁屏界面中有关闭按钮，点击关闭按钮，进行密码判断")]),t._v(" "),e("li",[t._v("如设置了密码，输入正确密码后，立即关闭锁屏界面，重新开始工作时间倒计时")]),t._v(" "),e("li",[t._v("若没有设置密码将立即关闭锁屏界面，重新开始工作时间倒计时")]),t._v(" "),e("li",[t._v("在锁屏页面中，用户只能通过点击关闭按钮关闭锁屏界面。不能通过其他操作关闭页面")])])]),t._v(" "),e("li",[e("p",[t._v("拓展功能")]),t._v(" "),e("ol",[e("li",[t._v("菜单栏中点击倒计时，可以唤起菜单，菜单项为[设置，暂停，继续，重置，退出]")]),t._v(" "),e("li",[t._v("工作时间倒计时剩15s时，弹出气泡提示用户 "),e("code",[t._v("n秒后将进入锁屏界面")]),t._v("，气泡中可以有操作项[暂停，重置]")])])])])])]),t._v(" "),e("p",[t._v("简单画个流程图～\n"),e("img",{attrs:{src:a(362),alt:""}})]),t._v(" "),e("ul",[e("li",[t._v("需求分析（开发角度）\n"),e("ul",[e("li",[e("p",[t._v("渲染进程")]),t._v(" "),e("ol",[e("li",[t._v("设置界面样式")]),t._v(" "),e("li",[t._v("锁屏界面样式")]),t._v(" "),e("li",[t._v("倒计时即将结束气泡样式")]),t._v(" "),e("li",[t._v("数据与主进程通信同步")])])]),t._v(" "),e("li",[e("p",[t._v("主进程")]),t._v(" "),e("ol",[e("li",[t._v("计时功能")]),t._v(" "),e("li",[t._v("锁屏界面显示时，"),e("code",[t._v("锁定")]),t._v("电脑，不允许用户进行其他操作")]),t._v(" "),e("li",[t._v("与渲染进程通信")])])])])])]),t._v(" "),e("p",[t._v("好的，需求梳理完毕后，让我们开始codeing吧👌～")]),t._v(" "),e("h2",{attrs:{id:"代码实现"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#代码实现"}},[t._v("#")]),t._v(" 代码实现")]),t._v(" "),e("p",[t._v("首先安装一个并发执行命令的包，同时运行主进程和渲染进程\n"),e("code",[t._v("yarn add dev concurrently")])]),t._v(" "),e("p",[t._v("然后增加scripts命令, 并运行"),e("code",[t._v("yarn dev")]),t._v(" "),e("code",[t._v('"dev": "concurrently \\"yarn renderer-dev\\" \\"yarn main-dev\\""')])]),t._v(" "),e("p",[t._v("项目启动之后，我们先来完成主进程的代码")]),t._v(" "),e("h3",{attrs:{id:"主进程实现"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#主进程实现"}},[t._v("#")]),t._v(" 主进程实现")]),t._v(" "),e("p",[t._v("为什么要自己来写启动命令？")]),t._v(" "),e("ol",[e("li",[t._v("electron 也可以直接运行ts文件，但是这样在ts文件中无法使用import，不使用import就没办法获得代码自动导入和提示功能，所以要先使用tsc编译ts文件成为js，然后在使用electron运行")]),t._v(" "),e("li",[t._v("我们需要使用 tsc -w功能来监听文件变化重新编译，所以无法使用 && 串行命令执行electron，而使用&并行命令可能会出现electron运行时，ts文件可能还没有编译成功导致加载文件失败的问题。所以我们自己来写一个并行命令来进行控制。")])])])}),[],!1,null,null,null);s.default=n.exports}}]);