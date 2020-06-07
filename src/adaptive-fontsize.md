---
sidebar: auto
---
# pc端 rem布局 非chrome浏览器字号小于12px的解决方案

## 所遇到的问题
UI这边要求pc端也进行rem布局进行适配，包括字号也需要使用rem，这就导致了在小屏幕下rem计算值小于12px，对于chrome浏览器而言小于12px则会显示为12px，而其他的浏览器则会正常显示。这种显示差异自然是通不过UI的走查要求的，并且小于12px的字体在pc端已经很难看清楚，所以需要将别的浏览器行为统一成chrome的行为。即小于12px也显示为12px字体。

## 解决思路

### 单纯使用css解决 X
因为rem的计算是浏览器计算的，不同宽度下的计算值也不尽相同，所以无法提前进行css适配。

### 使用css + js解决
使用js来控制css当然是可以的，但是我们不可能对每个元素单独进行判断来改变其样式。我们希望的是js改变了字号，所有使用这个字号的元素都会发生改变，所幸的是我们有css变量技术（ie不支持），而js也刚好可以操控它。

我们可以将每一个字号都设置为变量，例如`--font-size-12: 0.12rem`代表12px的字号，当我们写css时统一写css变量 `font-size: var(--font-size-12)`，然后在页面运行时使用js来计算哪些字号小于了12px，改变这些变量的值为12px。
```js
 function adaptiveFS() {
  var rootValue = 100 // 同postcss-pxtorem 的rootValue
  var rt = document.documentElement
  var rootFS = parseFloat(getComputedStyle(rt).fontSize)
  var minFontsize = 12
  var fs = 12
  var styleText = ''
  while (fs / rootValue * rootFS < minFontsize) {
    styleText += '--font-size-' + fs + ':12px;'
    fs++
  }
  rt.style = styleText
}
```

### 使用css + js + webpack解决
虽然上述方案可行，但是作为开发人员，我们不希望每次写字号的时候都去写变量，而且我们也不需要将所有的字号都设置为变量。

对于pc端的rem布局，一般来说我们是不会让屏幕无限进行缩小和放大的，所以我们会设置屏幕最大宽度和最小宽度，有了最小宽度也就有了最小的html font-size。我们只需要将 `font-size / rootValue * minHTMLFontSize < 12` 的字号设置为变量就可以了。

可是这样就更加大了开发的心智负担，我们不仅要写css变量，还要记忆哪些字号写css变量，哪些字号写正常的`px`。

还好我们有各种构建工具可以帮助我们避免这种情况，我们可以使用postcss-loader来自动替换字号为css变量，使用nodejs自动生成css变量文件，使用webpack plugin自动注入在html中注入js。

这些已经都被我写好了，大家直接拿去用就可以了，详见 [adaptive-fontsize](https://github.com/lei4519/adaptiveFontsize)，好用的话记得star～～



