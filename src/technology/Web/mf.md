# 模块联邦微前端思考

## 前置 - 模块联邦实现思路

![](https://github.com/lei4519/picture-bed/raw/main/images/20211231151855.png)

### 如何复用？

React
- 16.1.0
- 16.1.5
- 16.2.0

### [语义化版本](https://semver.org/)

`X.Y.Z` (16.1.0)

- `X`：做了不兼容的 API 修改
- `Y`：做了向下兼容的功能性新增
- `Z`：做了向下兼容的问题修正

---

- `X.Y.Z`: 指定版本，严格匹配（`16.1.0`）
- `~X.Y.Z`: 接受 `Z` 的最新版本（`16.1.0`、`16.1.9`、`16.1.99`）
- `^X.Y.Z`: 接受 `Y.Z` 的最新版本（`16.1.0`、`16.9.9`、`16.99.99`）
- `*`: 接受最新版本

模块联邦实现了运行时的语义化版本管理，在指定的范围内尽量用高的版本

---

![](https://github.com/lei4519/picture-bed/raw/main/images/20211231152347.png)

模块联邦
 - 高级的模块加载方式，可以跨项目进行模块复用，通过运行时的语义化版本管理实现生产依赖共享复用。


资源复用 & 资源隔离

模块联邦 &（iframe、qiankun、MicroApp..）

## 常见微前端观点

独立运行 | 独立开发 | 独立升级 | 独立部署

尽量避免各个模块间的耦合关系，保持独立。

- 模块：微前端中的各个子模块（应用）

## [https://micro-frontends.org/](https://micro-frontends.org/)
![](https://github.com/lei4519/picture-bed/raw/main/images/20211230103907.png)

## [qiankun(微前端)快问快答](https://zhuanlan.zhihu.com/p/451425684)

> Q: 你所了解的微前端子模块一般都是如何划分的？有什么建议？
>
> A: 我的 PPT 里有一页其实提到了，微前端拆分其实需要有明确的服务边界划分。如果你的微应用之间存在了过多的交互或者耦合，那你可能就要考虑是不是拆分的粒度过细了。
>
> 有一个简单的判断方式，就是看你的 **微应用在独立打开的情况下，是否能完成一个独立 功能/服务 的提交**，如果不是的，那可能就要看看了。


## 模块联邦概念

模块联邦完全相反，其功能就是模块间共享依赖，让模块与模块之间可以相互调用。

会有什么问题？

简单说：耦合越多，独立运行、独立开发、独立升级、独立部署 就越难完成（）

模块联邦：依赖共享，跨模块调用，会有什么问题？


<!-- ----------------------------------------------------------------------- -->
<!--                                   123                                   -->
<!-- ----------------------------------------------------------------------- -->


 - 依赖版本冲突风险示例
![](https://github.com/lei4519/picture-bed/raw/main/images/20211231143651.png)
![](https://github.com/lei4519/picture-bed/raw/main/images/20211229163038.png)

 - 远程模块冲突风险示例

![](https://github.com/lei4519/picture-bed/raw/main/images/20211231163958.png)

模块提供方，不能假设使用方是完全按照规矩去使用模块的。

具有调用关系（输入输出）的多项目共享模块，必须进行版本控制（npm 包）


##

---

## 趋势

#### 前端 - 组件化 ✅
#### 后端 - 微服务化 ✅
#### 微前端化 ❓

---

## 服务器

调用

- 独立运行环境
- 资源本地存储

![server](https://github.com/lei4519/picture-bed/raw/main/images/20211228142826.png)

## 浏览器

资源（css/js）加载、组合(共享)、执行

- 共用执行环境
- 资源加载
![client](https://github.com/lei4519/picture-bed/raw/main/images/20211228143200.png)

## 共用执行环境

### JS 冲突

- 全局 API 冲突
- 依赖库版本冲突

![global api](https://github.com/lei4519/picture-bed/raw/main/images/20211228144955.png)

### CSS 冲突

公用类名、tailwind

- `clearfix`、`mt-8`、`ellipsis`

```css
/* A */
.inactive {
  color: #ddd;
}
/* B */
.inactive {
  display: none;
}

:global {
  .ant-menu .ant-menu-item-selected {
    border-right: none;
    border-left: 3px solid;
  }
  .ant-menu-inline .ant-menu-item::after {
    border-right: none;
  }
}
```

### 难以排查、复现

- 特定加载顺序
  - A -> B -> C:d -> A
- 特定执行时机
  - A.btn.click() -> B.Model.err

> 如果事情有变坏的可能，不管这种可能性有多小，它总会发生 - 墨菲定律

- 沙箱隔离（可选）


---

## 资源加载

![](https://github.com/lei4519/picture-bed/raw/main/images/20211228162116.png)

## 生产依赖
<!-- ![](https://github.com/lei4519/picture-bed/raw/main/images/20211229153807.png) -->

## 依赖复用

React
- 16.1.0
- 16.1.5
- 16.2.0

### [语义化版本](semver.org/)

`X.Y.Z` (16.1.1)

- `X`：做了不兼容的 API 修改
- `Y`：做了向下兼容的功能性新增
- `Z`：做了向下兼容的问题修正

`~`: 接受 `Z` 的最新版本
`^`: 接受 `Y.Z` 的最新版本

> 模块联邦实现了运行时的语义化版本管理，在指定的范围内尽量用高的版本

### 如何保证所有的依赖都遵循了版本语义化？

![](https://github.com/lei4519/picture-bed/raw/main/images/20211229104000.png)

### 双刃剑 - 独立部署

经过测试的版本，受其他模块影响，在线上运行时被动态升级。




### 模块联邦共享依赖

```js
new ModuleFederationPlugin({
  shared: {
    ...dependencies,
    react: { singleton: true },
    "react-dom": { singleton: true }
  },
})
```

<!-- ![](https://github.com/lei4519/picture-bed/raw/main/images/20211228171614.png) -->

![](https://github.com/lei4519/picture-bed/raw/main/images/20211229165522.png)


### 非法 Hook 调用

![](https://github.com/lei4519/picture-bed/raw/main/images/20211228163936.png)
![](https://github.com/lei4519/picture-bed/raw/main/images/20211228164209.png)

- React 中 ReactCurrentDispatcher.current 指向 hooks 上下文，区分 mount、update
- ReactDOM.render 执行时，会改变 ReactCurrentDispatcher.current 的指向

```js
import React, { useState } from 'react'
import ReactDOM from 'react-dom'

function App() {
  useState()
}

ReactDOM.render(
  React.createElement(App)
)
```

```js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      shared: {
        react: {
          /**
           * 一些库使用全局内部状态（例如 react、react-dom）。
           * 因此，一次只运行一个库的实例至关重要。
           */
          singleton: true,
        },
      },
    }),
  ],
};
```

![](https://github.com/lei4519/picture-bed/raw/main/images/20211229154632.png)

---

### 复用

- 优点
  - 资源复用
  - 模块复用（模块联邦）

- 缺点
  - 依赖版本冲突
    - 很难独立升级
    - 谨慎独立部署（运行时风险）

## 不复用 - 全面隔离

- 优点
  - 稳定运行
  - 独立部署
  - 独立升级

- 缺点
  - 资源浪费（重复加载）
  - 模块不能复用

<!--
- 隔离方案
    - iframe、qiankun、MicroApp
    - [why not iframe](https://www.yuque.com/kuitos/gky7yw/gesexv) -->

---

---

### 可控（可信赖）的项目中 - 模块联邦复用

进行模块拆分、复用，模块相互之间具备调用关系

- 版本可控
- 模块可信赖（动态升级影响可控）

---

### 不可控（无信赖）的项目中 - 全面隔离

进行模块组合、引入

- 模块相互之间没有调用关系
  - 创作者中心 + 芝士
  - 隔离方案
    - 不希望对另一方有任何影响

- 模块相互之间有调用关系
  - npm 包
    - 经过充分测试后升级，杜绝动态升级风险
    - 版本可控可回退（单方面回滚）





<!-- ### MicroApp
![](https://zeroing.jd.com/home/assets/react-code.png)

![](https://github.com/lei4519/picture-bed/raw/main/images/20211228180026.png)

![](https://github.com/lei4519/picture-bed/raw/main/images/20211228175415.png)
 -->


## [微前端的那些事儿](https://github.com/phodal/microfrontends)
![](https://github.com/phodal/microfrontends/raw/master/imgs/angular-split-code-compare.jpg)


表格对比：

       | 标准 Lazyload |   构建时集成  | 构建后集成   | 应用独立
--------|--------------|------------|-------------|-------------
开发流程 |  多个团队在同一个代码库里开发 | 多个团队在不同的代码库里开发 | 多个团队在不同的代码库里开发 | 多个团队在不同的代码库里开发
构建与发布 | 构建时只需要拿这一份代码去构建、部署 | 将不同代码库的代码整合到一起，再构建应用 | 将直接编译成各个项目模块，运行时通过懒加载合并 |  将直接编译成不同的几个应用，运行时通过主工程加载
适用场景 |  单一团队，依赖库少、业务单一 | 多团队，依赖库少、业务单一 | 多团队，依赖库少、业务单一 |  多团队，依赖库多、业务复杂
表现方式 | 开发、构建、运行一体  | 开发分离，构建时集成，运行一体| 开发分离，构建分离，运行一体 |  开发、构建、运行分离

详细的介绍如下：

### 标准 LazyLoad

开发流程：多个团队在同一个代码库里开发，构建时只需要拿这一份代码去部署。

行为：开发、构建、运行一体

适用场景：单一团队，依赖库少、业务单一

### LazyLoad 变体 1：构建时集成

开发流程：多个团队在不同的代码库里开发，在构建时将不同代码库的代码整合到一起，再去构建这个应用。

适用场景：多团队，依赖库少、业务单一

变体-构建时集成：开发分离，构建时集成，运行一体

### LazyLoad 变体 2：构建后集成

开发流程：多个团队在不同的代码库里开发，在构建时将编译成不同的几份代码，运行时会通过懒加载合并到一起。

适用场景：多团队，依赖库少、业务单一

变体-构建后集成：开发分离，构建分离，运行一体

### 前端微服务化

开发流程：多个团队在不同的代码库里开发，在构建时将编译成不同的几个应用，运行时通过主工程加载。

适用场景：多团队，依赖库多、业务复杂

前端微服务化：开发、构建、运行分离

总对比
---

总体的对比如下表所示：

x       | 标准 Lazyload |   构建时集成  | 构建后集成   | 应用独立
--------|--------------|------------|-------------|-------------
依赖管理 |  统一管理     | 统一管理   | 统一管理  | 各应用独立管理
部署方式 |  统一部署     | 统一部署  | 可单独部署。更新依赖时，需要全量部署 | 可完全独立部署
首屏加载 |  依赖在同一个文件，加载速度慢 | 依赖在同一个文件，加载速度慢 | 依赖在同一个文件，加载速度慢  | 依赖各自管理，首页加载快
首次加载应用、模块 | 只加载模块，速度快  | 只加载模块，速度快 | 只加载模块，速度快  | 单独加载，加载略慢
前期构建成本 |  低 | 设计构建流程|   设计构建流程 | 设计通讯机制与加载方式
维护成本    | 一个代码库不好管理 | 多个代码库不好统一 | 后期需要维护组件依赖 | 后期维护成本低
打包优化  | 可进行摇树优化、AoT 编译、删除无用代码| 可进行摇树优化、AoT 编译、删除无用代码 | 应用依赖的组件无法确定，不能删除无用代码 | 可进行摇树优化、AoT 编译、删除无用代码
