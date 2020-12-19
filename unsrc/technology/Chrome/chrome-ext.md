# 使用 umi 开发 chrome 扩展

## 使用umi初始化项目

> [参考官方文档](https://umijs.org/zh-CN/docs)


## chrome扩展 核心概念

### manifest.json

作为一个扩展，`manifest.json`是其必不可少的文件，用来描述所有与扩展相关的配置。其中，`manifest_version`、`name`、`version` 3 个配置项是必不可少的。

```json
{
  // 清单文件的版本，值固定为2
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
  /*"page_action":
	{
		"default_icon": "img/icon.png",
		"default_title": "我是pageAction",
		"default_popup": "popup.html"
	},*/
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

### content-scripts

当打开一个网站，Chrome 就会匹配`content-scripts`配置项中的`matches`属性，匹配成功就会将配置项中的`js`、`css`注入到页面中。

`content-scripts`和原始页面共享`DOM`，但是不共享`JS`，如要访问页面`JS`（例如某个`JS`变量），只能通过`injected js`来实现。

`content-scripts`不能访问绝大部分 chrome.xxx.api，除了下面这 4 种：

```js
chrome.extension()
chrome.i18n()
chrome.runtime()
chrome.storage()
```

```json
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
]
```

### injected-script

`content-script`无法访问页面中的`JS`，虽然它可以操作`DOM`，但是`DOM`却不能调用它，也就是无法在`DOM`中通过绑定事件的方式调用`content-script`中的代码

简单说，如果你想点击页面中的按钮并调用扩展的`API`，`content-script`是做不到的。

使用方法：

先在 `manifest.json` 的 `web_accessible_resources` 中配置要注入的`JS`

```json
{
  // 普通页面能够直接访问的插件资源列表，如果不设置是无法直接访问的
  "web_accessible_resources": ["js/inject.js"]
}
```

然后使用`DOM`的方式将`JS`注入页面中

```js
// 向页面注入JS
function injectCustomJs(jsPath) {
  jsPath = jsPath || 'js/inject.js'
  var temp = document.createElement('script')
  temp.setAttribute('type', 'text/javascript')
  // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
  temp.src = chrome.extension.getURL(jsPath)
  temp.onload = function() {
    // 放在页面不好看，执行完后移除掉
    this.parentNode.removeChild(this)
  }
  document.head.appendChild(temp)
}
```


### background

后台配置，是指 chrome 启动后便会一直运行在后台的逻辑代码。

`background`的权限非常高，几乎可以调用所有的`Chrome`扩展`API`（除了`devtools`），而且它可以无限制跨域，也就是可以跨域访问任何网站而无需要求对方设置`CORS`。

### event-pages

鉴于`background`生命周期太长，长时间挂载后台可能会影响性能，所以`Google`又弄一个`event-pages`，在配置文件上，它与`background`的唯一区别就是多了一个`persistent`参数

它的生命周期是：在被需要时加载，在空闲时被关闭，什么叫被需要时呢？比如第一次安装、插件更新、有`content-script`向它发送消息，等等。

### popup

popup 是点击 browser_action 或者 page_action 图标时打开的一个小窗口网页，焦点离开网页就立即关闭，一般用来做一些临时性的交互。

## 插件的展现形式

### browserAction(浏览器右上角)

### pageAction(地址栏右侧)

### 右键菜单



## 参考资料

> [【干货】Chrome插件(扩展)开发全攻略](https://www.cnblogs.com/liuxianan/p/chrome-plugin-develop.html)