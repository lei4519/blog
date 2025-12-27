---
tags:
  - Notes
  - Obsidian
  - HowTo
created: 2024-05-01T14:40
share: "true"
updated: 2024-05-17T16:49
issue: "91"
---

> 啊，性能优化的味道

## TL;DR

利用 JS 读取配置文件，懒加载启动插件

## 启动速度 😅

[卡片笔记法](../73/%E5%8D%A1%E7%89%87%E7%AC%94%E8%AE%B0%E6%B3%95.md) 里面提到笔记的的启动速度很重要

但随着 obsidian 安装的插件越来越多，也越来越不满足我们的要求了，尤其是在手机上！

简单搜索之后发现早已有人发现并解决了问题：[Improve Obsidian Startup Time on Older Devices with the FastStart Script](https://medium.com/obsidian-observer/improve-obsidian-startup-time-on-older-devices-with-the-faststart-script-70a6c590309f)  
看完之后发现实现原理就是利用 templater 插件可以执行 JS 的能力，初始情况下仅保留必要插件启用，等启动之后再使用 JS 延时启动插件

## 关键步骤

### 启动时执行 JS

创建一个模板，设置 templater 的 `StartUp templates` 选项为此模板，模板内容如下：

```js
<%*  
fastStart = async (filename, delayInSecond) => {  
    if (tp.file.exists(filename)) {  
        const f = tp.file.find_tfile(filename);  
        let plugins = (await app.vault.read(f)).split(/\r?\n/).map(l => l.trim()).filter(l => !l.startsWith('//')).filter(l => tp.obsidian.Platform.isMobile ? !l.startsWith('onlyDesktop') : true).map(l => l.replace(/^onlyDesktop\s*&&\s*/, ''));  
        setTimeout(async () => {  
            plugins.forEach(async (p) => await app.plugins.enablePlugin(p))  
        }, delayInSecond * 1000)  
    }  
}  
await fastStart("FastStart-Plugins-FastDelay", 2)  
await fastStart("FastStart-Plugins-ShortDelay", 10)  
await fastStart("FastStart-Plugins-LongDelay", 30)  
%>
```

如果你会编程，不难发现逻辑是很简单的，就是读取配置文件中的插件列表进行启用

[原始源码](https://gist.github.com/TfTHacker/29f838b51338a5c7f46b04973bd0f401) 再此，我稍微做了些修改，增加了如下功能
- 支持插件名称前后出现空格
- 支持在行首加入 `//` 表示禁止启用此插件
- 支持在行首加入 `onlyDesktop && ` 表示插件仅在桌面端启用

### 插件分类

其中最下面的三行代码是可以根据自己的需求改动的，括号内的参数：
1. 配置文件的文件名
2. 延时的时间（秒）

```js
await fastStart("FastStart-Plugins-FastDelay", 2)  
await fastStart("FastStart-Plugins-ShortDelay", 10)  
await fastStart("FastStart-Plugins-LongDelay", 30)  
```

逻辑是这样的，把插件分为 N 类
1. 需要直接启用的（eg. templater / homepage），这种直接在设置中打开即可，**其余的全部禁用**
2. 进入后马上就可能用到的：编辑/展示等（eg. dataview / banner / tasks）
3. 增强型插件，没有也不会影响使用，有了效果会更好（eg. 语法高亮 / 阅读时间）
4. 写作一段时间之后可能会用到的插件 （eg. git-publisher / unused-images）
5. ...

**你可以根据自己的插件情况增加或减少分类，调整不同分类的延迟时间**

### 配置文件

一旦你确定了自己的分类，就可以建立相应的配置文件了

**就是普通的 markdown，只不过内容是插件名称**

#### 插件名称？

那怎么知道插件名称呢？

在文件中写入

> 注意去掉 `%\>` 中的 `\`，我如果不写转义符号，内容就会被替换

```js
<% Object.values(app.plugins.manifests).map(p=>p.id).sort((a,b)=>a.localeCompare(b)).join('\n') %\>

```

然后执行 `Templater: replace templates in active file`

模板代码就会被转换为你所安装的所有插件的插件名了

然后你只需要将不同的插件名划分到不同分类的文件中即可，写好之后可以重启 obsidian 测试一下

---

 🚀 然后就继续享受本地笔记软件带来的速度体验了 🥰
