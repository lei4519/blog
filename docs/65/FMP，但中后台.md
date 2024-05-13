---  
tags:  
  - FE  
  - HowTo  
share: "true"  
issue: "65"  
created: 2024-04-10T20:12  
---  
  
## TL;DR  
  
通过 `link.preload` 在渲染 HTML 的时候就开始加载必要的接口请求，这样等 JS 执行请求的时候就可以直接使用响应了，减少请求的等待时间  
  
## FMP  
  
> 关键内容绘制（First Meaningful Paint，简称 FMP）是网页性能分析中的一个指标，用于衡量网页加载过程中首次呈现对用户有意义的内容所花费的时间。  
>  
> 与首次内容绘制（First Contentful Paint，FCP）不同，FMP 更加关注页面加载的实用性和用户体验。  
>  
> FCP 只关注页面上任何内容（如文本或图片）首次出现在屏幕上的时间点，而 FMP 则进一步考虑这些内容是否对用户有实际意义。  
>  
> 例如，一个页面可能很快就显示了一个加载动画或者一个背景图像，但这些内容对用户来说并没有提供有价值的信息。  
>  
> 相比之下，FMP 可能会等到页面的主要内容（如文章标题、导航菜单或者重要图像）加载并渲染到屏幕上时才被触发。  
>  
> FMP 是一个更为综合的性能指标，它结合了页面的视觉变化和页面内容的实用性。  
>  
> 一个良好的 FMP 体验意味着用户在较短的时间内就能看到并与之交互的页面核心内容，这通常会导致更高的用户满意度和更低的跳出率。  
  
## 中后台  
  
大多数中后台系统中，必须要先请求类似 `me`/`user` 之类的接口数据之后才能开始真正渲染页面（多是因为角色、权限等需要拿到数据后才知道如何渲染）  
  
而在接口请求成功之前只能给页面一个大大的 `loading` 或者骨架屏  
  
请求瀑布流如下（无缓存）：  
  
1. HTML 加载    
   ![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/202404101120%20Pre%20Load--2024-04-10_11.29.34.png)  
2. `me` 接口    
   ![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/202404101120%20Pre%20Load--2024-04-10_11.30.13.png)  
  
emmm....5s 之后才开始请求 `me` 接口，这还是线上的环境  
  
不过大多数中后台并不（特别）在意性能，所以一般也不会去做优化  
  
### 一行代码  
  
但如果仅需要一行代码就可以轻松提高 N 倍的性能呢，你会去做吗？  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/202404101120%20Pre%20Load--2024-04-10_12.02.24.png)  
  
#### 优化前  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/FMP%EF%BC%8C%E4%BD%86%E4%B8%AD%E5%90%8E%E5%8F%B0--2024-04-10_13.02.58.png)  
  
#### 优化后  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/FMP%EF%BC%8C%E4%BD%86%E4%B8%AD%E5%90%8E%E5%8F%B0--2024-04-10_12.58.35.png)  
  
### Pre Load  
  
说了半天终于到了重点，利用 `link.preload.fetch` 的功能，可以在渲染 HTML 时就预加载接口请求，这样等 JS 执行请求的时候就可以直接拿到接口响应了，减少请求的等待时间  
  
```html  
<link rel="preload" href="/api/data" as="fetch" crossorigin="use-credentials" />  
```  
  
- [link.preload: as](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/link#as)  
- [HTML crossorigin](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/crossorigin)  
  
## REF  
  
- [预请求数据 – SWR](https://swr.vercel.app/zh-CN/docs/prefetching)  
