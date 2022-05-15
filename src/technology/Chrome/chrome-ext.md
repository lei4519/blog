# 使用 Umi 开发 Chrome 扩展

## 源起

公司要开发一个 Chrome 扩展，用来模拟人为操作，爬取目标网站的数据。

通过这篇文章来记录和分享一下开发过程中的经验与心得。

此扩展开发时，Chrome 扩展 `v3` 版本的文档已经发布。但是只有最新的 Chrome 才支持，考虑兼容性问题，扩展使用的仍然是 `v2` 版本，本篇文章中的相关介绍，也都是以 `v2` 版本为主。

虽然标题是使用 `Umi` 开发Chrome扩展，但是本篇95%都是在讲扩展本身，最后会简单说一下开发扩展时`Umi`的配置。



## Chrome 扩展

### 官方介绍

> 扩展程序是可以定制浏览体验的小型软件程序。它使用户可以根据个人需要或偏好来定制 Chrome 功能和行为。它们是基于 Web 技术（例如 HTML，JavaScript 和 CSS）构建的。
> 扩展由相互联系的各种**组件**组成，**组件**可以包括[后台脚本](https://developer.chrome.com/docs/extensions/mv3/background_pages/)，[内容脚本](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)，[选项页](https://developer.chrome.com/docs/extensions/mv3/options/)，[UI 元素](https://developer.chrome.com/docs/extensions/mv3/user_interface/)和各种逻辑文件。

### 常用的扩展组件和功能概述

> 本节介绍一下常用的扩展组件和功能，带你了解扩展在浏览器中能做什么事情。

#### browserAction、pageAction

浏览器右上角（工具栏）展示的小图标，每一个图标就代表一个扩展程序。
![action](https://github.com/lei4519/picture-bed/raw/main/images/1608434897668-image.png)

`action`有三种操作方式：

- `toopli`：鼠标`hover`后的文字提示
- `badge`：徽标
- `popup`：点击后弹窗

其中弹出窗口是`action`的主要交互区域。

![dark reader](https://github.com/lei4519/picture-bed/raw/main/images/1608435161113-image.png)

#### Commands（键盘快捷键）

顾名思义，可以增加和修改浏览器的键盘快捷键操作。

说起这个功能，就不得不提一个非常热门的扩展：`Vimium`

这个扩展可以让你用`vim`的快捷键操作浏览器，让你完全脱离鼠标操作。

#### contextMenu(右键菜单)

向右键菜单中加入自定义项。

![image](https://github.com/lei4519/picture-bed/raw/main/images/1608436354861-image.png)

#### override

使用`override`可以将 Chrome 默认的一些特定页面替换掉，改为使用扩展提供的页面。

可以替代的页面如下：

- `Chrome://history` 历史记录页
- `Chrome://newtab` 新标签页
- `Chrome://bookmarks` 书签页

一个扩展只能替代一个页面，不能替代无痕模式窗口的新标签页。

新标签页扩展：`掘金`、`Infinity`
![image](https://github.com/lei4519/picture-bed/raw/main/images/1608436527513-image.png)

#### omnibox（多功能框）

在地址栏中注册关键字，用户输入指定关键字后按下`tab`键即可输入内容，每次用户按下回车键，地址栏中输入的内容都会被发送到扩展中。

百度、必应、Github 等网站在 Chrome 中都有对应的关键字搜索功能，相信不少人都用过。在地址栏中输入`github.com`或者`baidu.com`，然后按下`tab`键，地址栏就会变成下面的样子。在这种状态下我们输入的内容都会在相应网站中进行搜索执行。

![github](https://github.com/lei4519/picture-bed/raw/main/images/1608448620624-image.png)

#### devtools(开发者工具)

向开发者工具中的增加功能，如`Vue devtools`、`React devtools`，前端一定不会陌生，本文不会重点讲解，建议查阅官网。

#### option(选项页)

对着`action`图标右键，菜单中就会显示`选项`菜单，如果菜单是亮起的，说明此扩展开启了选项功能。

![image](https://github.com/lei4519/picture-bed/raw/main/images/1608448821517-image.png)

选项页一般情况下，都会作为扩展的配置页面，如下

![FeHelper Options](https://github.com/lei4519/picture-bed/raw/main/images/1608448890182-image.png)

当然，所谓的选项页其实就是加载了一个指定的HTML，至于HTML中是展示扩展的配置还是别的东西，这个完全取决于你自己。

> 上面讲的都是使用者可以直观感受的功能，接下来这两个脚本功能是使用者无法直接感知但又在扩展中无比重要的功能。

#### background-script（后台脚本）

后台脚本就是指伴随扩展的整个生命周期进而运行的 JS 文件，在这个 JS 中可以使用 Chrome 提供的 API 来监听浏览器、扩展的各种事件，通过对这些事件的监听，进而对扩展其他功能进行协调和处理。

#### content-script（内容脚本）

`content-script` 可以把指定的JS、CSS文件放在当前正在浏览的网页上下文中执行。

CSS可以修改的网页的样式，JS可以访问和更改**当前页面的 BOM、DOM**，进而对网页的样式、行为进行控制和更改。

---

以上就是插件中比较常用的一些功能，除了这些常用的功能 Chrome 还给我们提供了很多强大的 API，下面我们罗列一些常用的。

- `Management`: 管理已安装和运行的扩展
  - 扩展管理
- `Message Passing`: 各个扩展之间、扩展与 `content-script` 之间的通信
- `Storage`：提供本地存储与账号同步存储功能

- `Tabs`：在浏览器中创建、修改和重新排列标签
  - `oneTab`
- `Windows`：在浏览器中创建、修改和重新排列窗口
- `Cookies`：浏览和修改浏览器的 `cookie` 系统
  - `cookies`
- `Cross-Origin`：扩展中的`XMLHttpRequest`和`fetch`API 是不受同源策略影响的。
- `webRequest`：拦截，阻止或修改请求网络请求

- `Bookmarks`：书签创建、组织和操作书签行为
- `Downloads`： 以编程方式启动、监视、操作和搜索下载
- `History`： 历史记录 与浏览器访问页面的记录交互
- `Devtools`: 向开发者工具中添加功能

- `Accessibility(a11y)`：可访问性
- `Internationalization(i18n)`：国际化
- `identity`: `OAuth2` 访问令牌
- `Proxy`：管理 `Chrome` 的代理设置
  - `VPN`

### 组件的使用方式

> 在开始之前，我们需要再了解一个东西：`mainfest.json`。

#### Mainfest

上一小节，我们讲了关于扩展的很多功能。再回顾开头，官方介绍中提到了这些组件都是由`Web`技术构建出来的，也就是说我们只需要给Chrome提供HTML、CSS、JS，Chrome就可以将它们作为扩展进而运行。

那这里就有了一个问题，Chrome 怎么知道这些文件就是扩展要运行的文件呢？它又如何知道哪些文件对应哪个功能呢？

所以这里就需要一个配置文件，来 **告诉** Chrome 这个扩展应该如何构建，如何运行。这就是`mainfest.json`的作用。

详细的`mainfest.json`配置后面再说，这里了解完其概念之后我们接着往下讲。

#### background-script

先说后台脚本，因为有些扩展的运行依赖于它。

配置方式：

```json
// manifest.json
{
  "background": {
    // 两种方式选其一
    "page": "background.html",
     "scripts": ["background.js"],
     // 关闭持久连接
     "persistent": false
  }
}
```

在`manifest.json`中的`background`属性中，可以指定一个 JS 数组，或者一个 HTML。

HTML 作用就是加载执行其中的 JS，HTML 本身的内容是不会被展示出来的。

`persistent`属性代表后台脚本的运行方式，默认为`true`，表示会一直运行。如果指定为`false`，则只会在一些重要的事件中运行。

- 该扩展程序首先安装或更新为新版本。
- 后台页面正在监听事件，并且已调度该事件。
- 内容脚本或其他扩展发送消息。
- 扩展中的另一个视图（例如弹出窗口）调用`runtime.getBackgroundPage`。

官方推荐将其设置为`false`，并且在 v3 中，`persistent` 属性被取消，取而代之的是使用`service script`指定后台脚本，其中的脚本将以`service worker`的方式运行。

`persistent`怎么设置，还是要取决于扩展的功能。如果你还不知道怎么配置，那就指定为`false`，因为多数情况下后台脚本都应该是由事件进而驱动运行的。

后台脚本可以访问 Chrome 提供的除`devtools`外的所有 API。

#### content-script

配置方式:

```
{
	"content_scripts": [
		{
			"matches": ["<all_urls>"],
			"js": ["js/content-script.js"],
			"css": ["css/custom.css"],
			"run_at": "document_start",
      // "exclude_matches": "",
      // "include_globs": ""
      // "exclude_globs": ""
      // "match_about_blank": false
		},
    {
			"matches": ["*://*.baidu.com/*"],
			"js": ["bd-content.js"],
			"run_at": "document_start"
		}
	]
}
```

`content_scripts`属性是个数组，其中可以配置多个匹配规则，当匹配成功，就会将配置的文件进行注入执行。

- `matches`：指定[匹配模式](https://developer.chrome.com/docs/extensions/mv2/match_patterns/)，"<all_urls>"表示所有网址。
- `js/css`: 要注入的文件。
- `match_about_blank`: 脚本是否应注入到 `about:blank` 页面，默认 `false`。
- `exclude_matches`/`include_globs`/`exclude_globs`: 配置额外的匹配模式。
- `run_at`：代码注入的时机
  - `document_start`：在 CSS 注入之后，在构建 DOM 和运行脚本文件之前被注入。
  - `document_end`：在 DOM 加载完成之后，可以理解为`DOMContentLoaded`事件。
  - `document_idle`：默认值，在 `window.onload` 事件调用的前后执行。具体时机取决于文档的复杂程度和加载所需的时间，并针对页面加载速度进行了优化。这个注入方式中不需要监听 `onload` 事件，因为可以确保 DOM 已经加载完成。如果必须要知道 `onload` 有没有触发，可以使用 `document.readyState` 进行判断。

出于安全性的考虑，`content-script` 的 JS 是在沙箱环境中执行的，它访问不到网页本身加载的 JS 定义的属性、方法，比如说网页本身加载了 `jquery`，那在 `content-script` 中是访问不到的，如果想要使用，只能在配置项中配置，在 `content-script` 的执行环境中注入一个 `jquery`。

`content-script`可以对页面中的 DOM 进行随意的修改、删除、新增，可以给已有的 DOM 元素绑定事件，也可以创建一个新的 DOM 并给其添加事件后插入页面中。正常来说呢，已经可以满足大多数的需求了。

> 在参考文章[【干货】Chrome 插件(扩展)开发全攻略](https://www.cnblogs.com/liuxianan/p/Chrome-plugin-develop.html#injected-script)中，提到 content-script 无法给 DOM 绑定事件，经测试是可以的，不知是不是扩展的功能更新了。

如果真的有需求，需要 JS 在当前网页的执行环境中进行执行，那也是可以实现的，既然我们可以操作 DOM，就可以很轻松的写出如下代码：

```typescript
const script = document.createElement('script')
script.innerHTML = 'console.log(window.$)'
document.body.append(script)
```

这样通过操作 DOM 注入的 JS 就是在网页自身的执行环境运行的了。

当然，正常情况下我们不会通过 `innerHTML` 来实现，而是使用 `script` 的 `src` 属性直接加载一个 JS 文件。
代码如下：

```
	const script = document.createElement('script')
	script.src = chrome.extension.getURL('js/inject.js')
	document.head.appendChild(script)
```

需要注意的是加载的路径是扩展目录的文件（当然也可以加载网络资源），这个目录地址我们需要通过`chrome.extension.getURL`API 来获得。

还需要注意，如果你加载的是扩展目录的文件，那就需要在`web_accessible_resources`明确的配置文件名才行（网络资源不需要）。

```
{
  "web_accessible_resources": [
    "inject.js"
  ]
}
```

内容脚本中只能访问如下的 Chrome API

- i18n
- storage
- extension
- runtime
  - connect
  - onConnect
  - onMessage
  - sendMessage
  - getManifest
  - getURL
  - id

其中的`runtime`中的前四个 API 提供了与扩展的其他部分进行通信的能力。

![image](https://github.com/lei4519/picture-bed/raw/main/images/1608786751478-image.png)

#### browserAction、pageAction

上节说到`action`点击后会弹出一个窗口，这个**窗口**其实就是一个小型的`tab`页面 ，里面加载了一个我们指定的 HTML 文件。

配置方式：

```json
// manifest.json
{
  // "page_action"
  "browser_action": {
    // 图标
    "default_icon": "img/icon.png",
    // tooltip
    "default_title": "标题",
    // 弹窗页面
    "default_popup": "popup.html"
  }
}
```

可以看到我们在`default_popup`字段中指定了一个HTML，这个HTML会在弹窗打开时加载，弹窗关闭后销毁。

也就是说，弹窗的每次的出现和消失，都是一个完整的生命周期。就像你在浏览器中打开一个`tab`页加载页面，随后又把这个`tab`页关闭了一样。

##### browserAction 与 pageAction 的区别

- `browserAction`的图标是常亮的，它的功能在任何网页中都可以使用。
- `pageAction`只会在指定的网站中亮起，它的功能也只限于这些指定网站使用。
  - `octotree` 扩展只会在 `github` 的项目页面亮起。
    ![octotree](https://github.com/lei4519/picture-bed/raw/main/images/1608435579256-image.png)

在 `background.js` 中使用 `declarativeContent` 对页面的变化进行匹配，然后来决定 `pageAction` 的点亮和置灰。

```
// manifest.json
{
  "permissions": ["declarativeContent"]
}

// background.js
chrome.runtime.onInstalled.addListener(function(details) {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostEquals: 'www.google.com', schemes: ['https'] },
          css: ["input[type='password']"]
        })
      ],
      actions: [ new chrome.declarativeContent.ShowPageAction() ]
    }]);
  });
});
```

在`Chrome ext v3`版本中，`browserAction`与`pageAction`这两个区别并不大的功能被统一合并成了`action`功能。

`action`和 `background` 一样，可以访问 Chrome 提供的除`devtools`外的所有 API。

在`action`中可以通过 `chrome.extension.getBackgroundPage`或者`chrome.runtime.getBackgroundPage` 直接获取到 `background` 脚本的 `window` 对象，进而访问其中的方法和属性。

这两个 API 的区别在于 `background` 的 `persistent` 属性，如果值为 `false`，空闲时后台脚本就是关闭的，需要使用`runtime.getBackgroundPage`通过事件机制将其唤醒，然后才能交互。

```
const bgs = chrome.extension.getBackgroundPage()
// or
chrome.runtime.getBackgroundPage((bgs) => {
  bgs.backgroundFunction()
})
```

#### contextMenu(右键菜单)

在权限配置中声明我们需要 `contextMenus` 权限，然后为其制定一个图标。

```
{
 "permissions": [
    "contextMenus"
  ],
  "icons": {
    "16": "icon-bitty.png",
    "48": "icon-small.png",
    "128": "icon-large.png"
  }
}
```

在 `background.js` 中可以使用 `chrome.contextMenus` API 对菜单项进行增删改查。

```
chrome.contextMenus.create({
	type: 'normal'， // 类型，可选：["normal", "checkbox", "radio", "separator"]，默认 normal
	title: '菜单的名字', // 显示的文字，除非为“separator”类型否则此参数必需，如果类型为“selection”，可以使用%s显示选定的文本
	contexts: ['page'], // 上下文环境，可选：["all", "page", "frame", "selection", "link", "editable", "image", "video", "audio"]，默认page
	onclick: function(){}, // 单击时触发的方法
	parentId: 1, // 右键菜单项的父菜单项ID。指定父菜单项将会使此菜单项成为父菜单项的子菜单
	documentUrlPatterns: 'https://*.baidu.com/*' // 只在某些页面显示此右键菜单
});
// 删除某一个菜单项
chrome.contextMenus.remove(menuItemId)；
// 删除所有自定义右键菜单
chrome.contextMenus.removeAll();
// 更新某一个菜单项
chrome.contextMenus.update(menuItemId, updateProperties);
```

#### override

```
"chrome_url_overrides":
{
  // 选其一覆盖
	"newtab": "newtab.html",
	"history": "history.html",
	"bookmarks": "bookmarks.html"
}
```

通过上节罗列的扩展 API，我们可以拿到自己需要的数据并加以渲染。

#### devtools(开发者工具)

这个功能没有去深究，这里把官网的介绍复制一下。

每次打开`Devtools`窗口时，都会创建扩展的`Devtools`页面的实例。`DevTools`页面在`DevTools`窗口的生命周期内一直存在。`DevTools`页面可以访问`DevTools` API和一组有限的扩展API。具体来说，`DevTools`页面可以：

- 使用`devtools.panels` API创建面板并与面板进行交互。
- 获取有关检查窗口的信息，并使用`devtools.inspectedWindow` API在检查窗口中评估代码。
- 使用`devtools.network` API获取有关网络请求的信息。

`DevTools`页面和`content-script`类似，只能使用有限的Chrome API。`DevTools`页面与后台页面通信同样是使用`runtime`的相关API。

```
{
  // 只能指向一个 HTML 文件，不能是 JS 文件
  "devtools_page": "devtools.html"
}
```

`Devtools`的开发场景并不多，如果想了解可以看文末的参考资料进行学习。

#### omnibox

先在`manifest.json`中指定一个关键字以提供搜索建议（只能设置一个关键字）

```
{
	"omnibox": { "keyword" : "go" },
}
```

在`background.js`中监听相关事件

```
// 输入框内容变化时触发，suggest用以提示做输入建议
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
	if(!text) return;
	if(text == '美女') {
		suggest([
			{content: '中国' + text, description: '你要找“中国美女”吗？'}
		])
	}
})

// 当用户接收关键字建议时触发
chrome.omnibox.onInputEntered.addListener((text) => { });
```

#### option(选项页)

在`manifest.json`中指定渲染HTML即可

```
{
  "options_ui": {
    "page": "options.html",
    "chrome_style": true
  }
}
```


#### manifest.json

[官网 manifest 格式](https://developer.chrome.com/docs/extensions/mv3/manifest/)

```json
{
  // 清单文件的版本，值固定为2，现在已经有3了
  "manifest_version": 2,
  // 插件的名称
  "name": "demo",
  // 插件的版本
  "version": "1.0.0",

  // 插件描述
  "description": "简单的Chrome扩展demo",
  // 图标，一般偷懒全部用一个尺寸的也没问题
  "icons": {
    "16": "img/icon.png",
    "48": "img/icon.png",
    "128": "img/icon.png"
  },

  // 会一直常驻的后台JS或后台页面
  "background": {
    // 2种指定方式，如果指定JS，那么会自动生成一个背景页
    "page": "background.html"
    //"scripts": ["js/background.js"]
  },

  // 浏览器右上角图标设置，browser_action、page_action、app必须三选一
  "browser_action": {
    "default_icon": "img/icon.png",
    // 图标悬停时的标题，可选
    "default_title": "这是一个示例Chrome插件",
    "default_popup": "popup.html"
  },
  // 当某些特定页面打开才显示的图标
  "page_action":
	{
		"default_icon": "img/icon.png",
		"default_title": "我是pageAction",
		"default_popup": "popup.html"
	},

  // 需要直接注入页面的JS
  "content_scripts": [
    {
      //"matches": ["http://*/*", "https://*/*"],
      // "<all_urls>" 表示匹配所有地址
      "matches": ["<all_urls>"],
      // 多个JS按顺序注入
      "js": ["js/jquery-1.8.3.js", "js/content-script.js"],
      // JS的注入可以随便一点，但是CSS的注意就要千万小心了，因为一不小心就可能影响全局样式
      "css": ["css/custom.css"],
      // 代码注入的时间，可选值： "document_start", "document_end", or "document_idle"，最后一个表示页面空闲时，默认document_idle
      "run_at": "document_start"
    },
    // 这里仅仅是为了演示content-script可以配置多个规则
    {
      "matches": ["*://*/*.png", "*://*/*.jpg", "*://*/*.gif", "*://*/*.bmp"],
      "js": ["js/show-image-content-size.js"]
    }
  ],
  // 权限申请
  "permissions": [
    "contextMenus", // 右键菜单
    "tabs", // 标签
    "notifications", // 通知
    "webRequest", // web请求
    "webRequestBlocking",
    "storage", // 插件本地存储
    "http://*/*", // 可以通过executeScript或者insertCSS访问的网站
    "https://*/*" // 可以通过executeScript或者insertCSS访问的网站
  ],
  // 普通页面能够直接访问的插件资源列表，如果不设置是无法直接访问的
  "web_accessible_resources": ["js/inject.js"],
  // 插件主页，这个很重要，不要浪费了这个免费广告位
  "homepage_url": "https://www.baidu.com",
  // 覆盖浏览器默认页面
  "chrome_url_overrides": {
    // 覆盖浏览器默认的新标签页
    "newtab": "newtab.html"
  },
  // Chrome40以前的插件配置页写法
  "options_page": "options.html",
  // Chrome40以后的插件配置页写法，如果2个都写，新版Chrome只认后面这一个
  "options_ui": {
    "page": "options.html",
    // 添加一些默认的样式，推荐使用
    "chrome_style": true
  },
  // 向地址栏注册一个关键字以提供搜索建议，只能设置一个关键字
  "omnibox": { "keyword": "go" },
  // 默认语言
  "default_locale": "zh_CN",
  // devtools页面入口，注意只能指向一个HTML文件，不能是JS文件
  "devtools_page": "devtools.html"
}
```

## 消息通信

开发时主要会用到 `content-script`与 `popup` 和 `background` 之间的通信，通信分为短链接和长链接。

两者的通信其实就是进程间的通信，通信内容必须可以被序列化，可以理解消息体会被`JSON.stringify`后进行传递。所以消息体中不能发送`function`、`symbol`、`Map`等数据。

### popup <---> background

`background`中可以通过`chrome.extension.getViews({type:'popup'})`来获取已打开的`popup`，进而访问其中的属性、方法。

`popup`可以通过`chrome.extension.getBackgroundPage`或者`chrome.runtime.getBackgroundPage`获取到`background`的`window`，进而访问其属性和方法。

### popup | background ==> content-script

`popup` 和 `background` 给 `content-script` 发送消息

#### 短链接

接收方 `content-script` 需要先完成消息事件的监听

```
const handleMessage = (message, sender, sendResponse) => {  }
chrome.runtime.onMessage.addListener(handleMessage)
```

- `message`: 消息内容
- `sender`: 发送者信息
- `sendResponse`: 回复消息的方法

发送方 `popup` | `background` 调用API 发送消息

```
// 封装获取当前选中的tab标签方法
const getCurrentTab = () => new Promise((resolve, reject) => {
  chrome.tabs.query({active: true, currentWindow: true}, ([tab]) => {
    tab?.id ? resolve(tab) : reject('not found active tab')
  })
})

const tab = await getCurrentTab()
// 发送消息
chrome.tabs.sendMessage(tab.id, {greeting: "hello"}, (response) => { })
```

`tabs.sendMessage`的三个参数分别是

- 要与之通信的`tab`标签页的`id`
- 消息体
- 响应的回调函数：这个就是上面的 `sendResponse` 函数

短链接注意事项：

- `sendResponse`只能使用一次，不能多次使用。
- 默认情况下，`handleMessage` 函数执行结束，消息通道就会关闭，此时的`sendResponse`已经无效。也就是说`sendResponse`不能异步使用。
- 如果需要异步使用`sendResponse`，需要在`handleMessage`中明确的写下`return true`，这样消息通道会一直保持，直到`sendResponse`被调用。


#### 长链接

接收方 `content-script` 需要先完成消息事件的监听

```
// 监听长链接 链接事件
chrome.runtime.onConnect.addListener(port => {
  // 可以根据 name 来区分不同的长链接逻辑
  if (port.name === 'knockknock') {
    // 给另一端发送消息
    port.postMessage()

    // 监听另一端的消息
    port.onMessage.addListener(message => {})
  }
})
```

发送方 `popup` | `background` 调用API 发送消息

```
const tab = await getCurrentTab()

// 建立链接
const port = chrome.tabs.connect(tab.id, {name: "knockknock"})

// 给另一端发送消息
port.postMessage()

// 监听另一端的消息
port.onMessage.addListener(message => {})
```


- `port` 端口对象
  - `name`: 端口名称
  - `disconnect`: 关闭端口
  - `postMessage`: 发送消息
  - `onDisconnect`: 监听端口关闭事件
  - `onMessage`: 监听端口消息事件
  - `sender`: 发送者的信息

### content-script ---> popup | background

`content-script` 给 `popup` 和 `background` 发送消息

两者的逻辑其实是一样的，只不过`popup | background`给`content-script`发送消息时，使用的是`chrome.tabs` API，需要指定一个`tab`的`id`。

而`content-script`给`popup | background`发送消息时，使用的时`chrome.runtime` API，不需要`id`。

#### 短链接

接收方 `popup | background` 需要先完成消息事件的监听

```
const handleMessage = (message, sender, sendResponse) => {  }
chrome.runtime.onMessage.addListener(handleMessage)
```

发送方 `content-script` 调用 API 发送消息

```
// tabs 改为了 runtime
chrome.runtime.sendMessage({greeting: "hello"}, (response) => { })
```

如果`popup`和`background`都使用了`runtime.onMessage`监听了事件，那么当`content-script`发送了消息，两者都会接到。
但是`sendResponse`只有一个，一个先用了后者就无法使用了。

这里还存在一个坑，我们下节再说。

#### 长链接

接收方 `popup | background` 需要先完成消息事件的监听

```
// 和上面一模一样
chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'knockknock') {
    port.postMessage()

    port.onMessage.addListener(message => {})
  }
})
```

发送方 `content-script` 调用API 发送消息

```
// tabs 改为了 runtime
const port = chrome.runtime.connect({name: "knockknock"})

port.postMessage()
port.onMessage.addListener(message => {})
```

可以看到两者出了API的调用之外几乎没有区别，具体由谁主动发送消息，由谁来监听，需要根据实际需求来决定。

### 回复CS短链接消息踩坑

说一下在短链接中，`popup | background` 回复 `content-script` 时的坑。

问题的前置条件：

- `sendResponse` 需要异步发送。
- `popup`和`background`都使用`runtime.onMessage`监听了`content-script`发来的消息。

当遇到上述场景时，会发现调用`sendResponse`后无法回复消息。

原因也很简单，我们在上面已经说过了，当`sendResponse`需要异步发送时，需要明确的在`runtime.onMessage`监听事件中返回`true`，但是由于有两者都监听了，那么其中一个可能就会事先返回`undefined`，这就导致了消息通道的提前关闭。

解决办法呢也很简单，我们需要将发送给`popup`和`background`的消息区分并封装，并将是否是异步消息发送给接收方。

代码如下

```
// 消息格式
interface RuntimeMessage<T = string> {
  type: T
  payload: any
  receiver?: 'bgs' | 'popup'
  isAsync?: boolean
}
// 封装发送消息
const sendMessageToRuntime = (
  msg: RuntimeMessage,
  cb?: LooseFunction,
) => {
  // 当传入callback时，默认这是一个异步消息
  if (msg.isAsync === void 0 && isFunction(cb)) {
    msg.isAsync = true
  }
  chrome.runtime.sendMessage(msg, cb)
}
// 使用
sendMessageToRuntime({
  type: 'crossFetch',
  payload: {...},
  receiver: 'bgs',
}, (response) => {})

// background.js
chrome.runtime.onMessage.addListener(
  (
    {
      type,
      payload,
      receiver,
      isAsync,
    },
    sender,
    sendResponse,
  ) => {
    if (receiver === 'bgs') {...}
    return isAsync
  },
)

// popup.js
chrome.runtime.onMessage.addListener(
  (
    {
      type,
      payload,
      receiver,
      isAsync,
    },
    sender,
    sendResponse,
  ) => {
    if (receiver === 'popup') {...}
    return isAsync
  },
)
```

### 两个tab签之间的通信

由于本次开发过程中有这样的需求，而常规的JS手段无法与另一个`tab`页面建立通信（新`tab`页面地址是多次重定向的结果）。

这里主要演示一下由`background`作为消息通道，为两个`tab`签建立通信。

```
// tab页面1 content-script
const port = chrome.runtime.connect({
  name: 'createTabAndConnect',
})
// 创建目标tab
port.postMessage({
  type: 'createTab',
  // tab 信息
  payload: {...},
})
// 监听消息
port.onMessage.addListener(handleMessage)
// 发送消息
port.postMessage({
  type: 'message',
  payload: {...}
})
```

```
// tab页面2 content-script
chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'createTabAndConnect') {
    // 监听消息
    port.onMessage.addListener(handleMessage)
    // 发送消息
    port.postMessage({
      type: 'message',
      payload: {...}
    })
  }
})
```

```
// background.js
port.onMessage.addListener(async ({ type, payload }) => {
  switch (type) {
    case 'createTab':
      {
        // 创建tab
        const tab = await new Promise(resolve => {
          chrome.tabs.create(payload, resolve)
        })
        // 监听tab 页面的状态
        chrome.tabs.onUpdated.addListener((id, info) => {
          if (id === tab.id) {
            // 加载完成
            if (info.status === 'complete') {
              // 建立链接
              tabPort = chrome.tabs.connect(id, {
                name: port.name,
              })
              // 监听消息
              tabPort.onMessage.addListener(msg => {
                // 中转tabPort的消息给port
                port.postMessage({
                  type: 'message',
                  payload: msg,
                })
              })
            }
          }
        })
      }
      return
    case 'message':
      // 中转port的消息给tabPort
      tabPort?.postMessage(payload)
      return
  }
})
```

## 使用 Umi 初始化项目

最后简单说一下Umi开发扩展的配置。

思路是将脚本文件加入入口文件单独打包，HTML页面使用路由的方式，通过`hash`访问。

所以像`popup`、`options`这些需要视图的页面，直接在`pages`文件夹中写就行了。Umi默认会将其作为路由进行打包。

```
// manifest.json
{
	"browser_action": {
		"default_popup": "index.html#/popup"
	},
  "options_ui": {
    "page": "index.html#/options",
  }
}
```

在`scripts`文件夹中编写`content-script`和`background`文件，在Umi的配置文件中添加入口文件。

最终的`.umirc.ts`如下:

```ts
// .umirc.ts
import { defineConfig } from 'Umi'

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  cssLoader: {
    localsConvention: 'camelCase',
  },
  dynamicImport: {},
  history: {
    type: 'hash',
  },
  targets: {
    Chrome: 73,
    firefox: false,
    safari: false,
    edge: false,
    ios: false,
  },
  ignoreMomentLocale: true,
  devServer: {
    writeToDisk: true,
  },
  copy: ['manifest.json', 'index.html', 'hot-reload.js'] as any,
  chainWebpack(memo, { env }) {
    memo.devServer.hot = false as any
    memo.plugins.delete('hmr')
    memo
      .entry('background')
        .add('./src/scripts/background.ts')
        .end()
      .entry('content-script')
        .add('./src/scripts/content-script.ts')
        .end()
  },
})
```


- `targets`配置决定了代码如何被`polyfill`，很明显作为Chrome的插件，我们不需要其他浏览器的`polyfill`。

- `devServer`将开发模式存在内存中的文件写到磁盘中，`webpack`关闭热更新。

  - 扩展开发不像是平时的页面开发，所以热更新在这里没有作用。
  - 内存中的文件写到磁盘中，浏览器才能加载这些文件。

- 通过`copy`将`manifest.json`拷贝到根目录。

- `copy` `index.html`是因为Umi默认会向`index.html`中注入两段`script`脚本，而扩展的`html`中是不允许存在内联脚本的。如果有的话就会有两个报错，当然这两个报错除了不好看之外也没有别的影响。所以这里不做处理也一样。

- 正常情况下，编辑完文件，就需要重新刷新扩展和当前tab页面，才能看到效果。而[hot-reload.js](https://github.com/xpl/crx-hotreload)可以帮我们去自动刷新，详细的用法可以点进去查看。



## 推荐阅读

- [官方提供的各组件demo](https://github.com/GoogleChrome/Chrome-extensions-samples)

## 参考资料

- [官方文档（自备梯子）](https://developer.chrome.com/docs/extensions/mv3/)
- [【干货】Chrome 插件(扩展)开发全攻略](http://blog.haoji.me/Chrome-plugin-develop.html)
- [Umi 官方文档](https://umijs.org/zh-CN/docs)