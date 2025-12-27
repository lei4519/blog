---
tags:
  - NextJS_Image
  - FE
created: 2025-12-25T13:11
share: "true"
issue: "129"
---

## HTML Img 标签

响应式图片：通过原生 `img` 的 [srcset](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/img#srcset) 和 [`sizes`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/img#sizes) 提供额外的资源图像和提示，帮助浏览器选择最合适的资源

[srcset](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/img#srcset) 属性指定了服务端有哪些图片资源可以选择（像服务端发起请求），比如下面列表表示有四个图片资源

```html
<img 
	srcset="
		swing-mobile.jpg 200w,
		swing-ipad.jpg 400w,
		swing-desktop.jpg 800w,
		swing-desktop-large.jpg 1600w
	"
/>
```

至于应该选择哪个图片资源发起请求，取决于 [`sizes`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/img#sizes) 属性的配置

```html
<img 
	sizes="
		(max-width: 30em) 100vw,
		(max-width: 50em) 50vw,
		calc(33vw - 100px)
	"
/>
```

`sizes` 表示了在不同宽度下，预期的图片宽度是多少（相对于视口的宽度），浏览器会根据预期的宽度与真实的视口宽度计算，进而从 `srcset` 中选择最合适的图片尺寸发起请求

注意这一部分的逻辑只和发起请求有关，跟**实际渲染没有关系**，最终的页面呈现效果还是以 CSS 为准

也可以这么理解，等 CSS 计算完布局再根据宽度发请求，这个时机太晚了（不能向前兼容）

所以需要用 sizes 属性根据视口宽度来预测图片宽度，这样在解析 DOM 时就可以拿到结果发起请求（和之前的请求时机一致）

进而也容易理解一个例外场景，当 img 是懒加载时，`loading=lazy`，`sizes` 可以指定为 `auto`，此时浏览器就会根据 CSS 布局后的尺寸来选择合适的图片

### 注意点

- 如果没有 `srcset`，`sizes` 属性无效
- `srcset` 中的尺寸有两种
	1. 宽度描述符（一个正整数，后面紧跟 `w` 符号）
	2. 像素密度描述符（一个正浮点数，后面紧跟 x 符号）
- 同一个 srcset 属性中混合使用宽度描述符和像素密度描述符时，会导致该值无效
- 使用宽度描述符时，必须有 `sizes`，否则 `srcset` 无效
- 在支持 `srcset` 的浏览器中，`src` 属性会被当做拥有一个像素密度的描述符 `1x` 的候选图像处理
- `srcset` 使用了宽度描述符后，`src` 属性会被忽略
- 选择宽度时，浏览器会根据像素密度等数据综合考虑

## NextJS <Image />

与原生的差异为：不允许手写 `srcset`，会根据 `sizes` **自动生成**，具体生成图片的尺寸规则由 [deviceSizes](https://nextjs.org/docs/pages/api-reference/components/image#devicesizes) 和 [imageSizes](https://nextjs.org/docs/pages/api-reference/components/image#imagesizes) 决定

默认值如下

```js
deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
imageSizes: [32, 48, 64, 96, 128, 256, 384]
```

当配置的 `sizes` 比 `deviceSizes` 中的值都小时，就会使用 `imageSizes` 的值，比如 `sizes=40px`

### 生成示例

没写 `sizes`：只会生成 像素密度描述符 的 `srcset`

```html
<Image />

<img 
	srcset="
/_next/image?url=%2Fmeshy-avatar.png&w=640&q=75 1x, 
/_next/image?url=%2Fmeshy-avatar.png&w=1080&q=75 2x"
/>
```

`sizes` 为视口宽度或大于 `deviceSizes` 的最小值：生成所有 `deviceSizes` 数组中的尺寸

```html
<Image sizes="100vw" />

<img 
	srcset="
/_next/image?url=%2Fmeshy-avatar.png&w=640&q=75 640w, 
/_next/image?url=%2Fmeshy-avatar.png&w=750&q=75 750w, 
/_next/image?url=%2Fmeshy-avatar.png&w=828&q=75 828w, 
/_next/image?url=%2Fmeshy-avatar.png&w=1080&q=75 1080w, 
/_next/image?url=%2Fmeshy-avatar.png&w=1200&q=75 1200w, 
/_next/image?url=%2Fmeshy-avatar.png&w=1920&q=75 1920w, 
/_next/image?url=%2Fmeshy-avatar.png&w=2048&q=75 2048w, 
/_next/image?url=%2Fmeshy-avatar.png&w=3840&q=75 3840w"
/>
```

`sizes` 小于 `deviceSizes` 的最小值，生成所有 `imageSizes` 和 `deviceSizes` 的尺寸

```html
<Image sizes="40px" />

<img 
	srcset="
/_next/image?url=%2Fmeshy-avatar.png&w=16&q=75 16w, 
/_next/image?url=%2Fmeshy-avatar.png&w=32&q=75 32w, 
/_next/image?url=%2Fmeshy-avatar.png&w=48&q=75 48w, 
/_next/image?url=%2Fmeshy-avatar.png&w=64&q=75 64w, 
/_next/image?url=%2Fmeshy-avatar.png&w=96&q=75 96w, 
/_next/image?url=%2Fmeshy-avatar.png&w=128&q=75 128w, 
/_next/image?url=%2Fmeshy-avatar.png&w=256&q=75 256w, 
/_next/image?url=%2Fmeshy-avatar.png&w=384&q=75 384w,
/_next/image?url=%2Fmeshy-avatar.png&w=640&q=75 640w, 
/_next/image?url=%2Fmeshy-avatar.png&w=750&q=75 750w, 
/_next/image?url=%2Fmeshy-avatar.png&w=828&q=75 828w, 
/_next/image?url=%2Fmeshy-avatar.png&w=1080&q=75 1080w, 
/_next/image?url=%2Fmeshy-avatar.png&w=1200&q=75 1200w, 
/_next/image?url=%2Fmeshy-avatar.png&w=1920&q=75 1920w, 
/_next/image?url=%2Fmeshy-avatar.png&w=2048&q=75 2048w, 
/_next/image?url=%2Fmeshy-avatar.png&w=3840&q=75 3840w"
/>
```

### 注意点

- 如果没有写 `sizes`，`Next.js` 生成图像尺寸有限的 `srcset`（例如 `1x、2x`），同时会将 `src` 指定为 `srcset` 的最后一项
- 如果 `sizes` 缺少宽度参数，会假定图像宽度与视口宽度相同 `100vw`
	- 比如填了 `100%`

### 推荐写法

图片可以懒加载：使用 `loading="lazy" sizes="auto"`  
（最省心，能用就用）

```HTML
<Image
    loading="lazy"
    sizes="auto"
/>
```

图片通栏，等于屏幕宽度：使用 `sizes="100vw"`  
（场景太少，一般用不到，非通栏场景如果这么用，会导致导入不必要的大尺寸图片）

```html
<Image
	sizes="100vw"
/>
```

图片是固定尺寸：将固定尺寸填入 `sizes`

> 固定尺寸是 CSS 中指定的宽度

```html
<Image
	sizes="40px"
/>
```

图片小于屏幕宽度，且尺寸会随宽度进行响应式变化：正确的编写相应的媒体查询 `sizes`  
（尽量让其懒加载，对于首要的首屏图片，可以针对性指定）

```html
<Image
	sizes="(max-width: 30em) 100vw,
	(max-width: 50em) 50vw,
	calc(33vw - 100px)"
/>
```
