---
tags:
  - FE
  - JavaScript
  - HowTo
share: "true"
issue: "48"
created: 2020-01-31T20:12
updated: 2024-05-11T13:04
---

## IntersectionObserver 介绍

- mdn：[Intersection Observer](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver)

Intersection Observer 可以异步的监听元素是否进入了可视区域内，当元素进入可视区域后，会触发相应的回调函数。

### 基本用法

```javascript
const callback = () => {}
// 实例化一个交叉观察者，并传入回调函数
const intersectionObserver = new IntersectionObserver(callback)
// 调用observe方法，监听需要观察的dom元素
intersectionObserver.observe(document.querySelector(".scrollerFooter"))
```

## 图片懒加载

图片懒加载的实现原理都是一样的，通过 data-src 属性保存真正的 src 地址，等到了触发条件时（即将进入视口），将 data-src 的值赋予 src 属性，开始加载图片。

有了 IntersectionObserver 我们可以很轻松的知道图片进入视口的时机，只需要再 callback 回调函数中替换 src 属性就可以了。

这里值得注意的一点是，一般情况下，我们并不希望图片在完全进入视口后才开始加载图片，我们需要让用户尽可能的感知不到图片的加载替换。所以我们将加载时机提前一点，比如说一屏的高度，那如果来设置这个高度呢。IntersectionObserver 在初始化时允许传入一个配置项，其中的 rootMargin 选项是用来标注额外的 margin 带来的位置信息判断错误问题，我们可以利用这一点，比如我们将 margin-bottom 设为 200px，IntersectionObserver 就会在视口距离监听元素 200px 时去触发回调函数，这就给了我们可以控制距离底部的距离的方法。

```javascript
<img src="loading.jpg" data-src="realSrc.jpg">

const intersectionObserver = new IntersectionObserver(function(entries) {
  // entries是一个数组，我们会观察多个元素，所以会有多个元素同时进入视口这种情况
  // intersectionRatio代表了元素进入视口的比例，当元素完全进入视口时值为1，当元素没有进入视口时值为0
  // intersectionObserver在监听dom元素后就会执行一次callback，所以这里需要判断一下
  if (entries[0].intersectionRatio <= 0) return;
  // 开始替换src
  entries.forEach(e => {
    e.target.src = e.target.dataset.src
  })
}, {rootMargin: '0px 0px 200px 0px'})
// 监听所有data-src属性的元素
document.querySelectorAll('[data-src]').forEach(element => intersectionObserver.observe(element))
```
