---
tags:
  - FE
  - Explanation
share: "true"
issue: "66"
created: 2024-03-25T20:28
updated: 2024-05-12T12:36
---
  
咬文嚼字  
  
## REF  
  
> [我的大前端世界观 - 黄玄 Hux - 哔哩哔哩](https://b23.tv/xIwn2RM)  
  
## TL;DR  
  
如今的前端已经不局限在语言（JS）、环境（Browser）中了，我们几乎可以做任何与用户进行交互的界面或工具  
  
我们想要表达：所有服务于设计和开发用户可以直接看到和交互的部分这件事情  
  
其实「前端」这个词本身的含义已经足够好了，但是因为时代的原因被绑上了固有的标签  
  
所以不得不用一些新词/概念来区别时代的变化  
  
## TUI ( Terminal UI )  
  
开始之前先说一下 TUI，就是运行在终端里的用户界面，不知道有多少人了解/使用过这个  
  
简单列一些比较常用的：  
  
| [lazygit](https://github.com/jesseduffield/lazygit)                                                                                 | [fzf](https://github.com/junegunn/fzf)                                                                                      | [ranger](https://github.com/ranger/ranger)/ [yazi](https://github.com/sxyazi/yazi)                                                  | [bottom](https://github.com/ClementTsang/bottom)                                                                                  | [wtf](https://github.com/wtfutil/wtf)                                                                                       |  
| ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |  
| ![lazygit--2024-04-07_17.39.49](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/lazygit--2024-04-07_17.39.49.png) | ![fzf--2024-04-07_18.36.12](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/fzf--2024-04-07_18.36.12.png) | ![joshuto--2024-04-07_17.41.52](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/joshuto--2024-04-07_17.41.52.png) | ![bottom--2024-04-07_17.48.41](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/bottom--2024-04-07_17.48.41.png) | ![wtf--2024-04-07_18.18.29](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/wtf--2024-04-07_18.18.29.png) |  
  
除此之外还有诸如音乐播放器、邮箱、游戏（[口袋妖怪](https://github.com/lxgr-linux/pokete/blob/master/assets/pics.md)）等等等，感兴趣可以访问 [awesome-tuis](https://github.com/rothgar/awesome-tuis?tab=readme-ov-file)  
  
开发 TUI 的技术栈各种各样：Go / Python / Rust...  
  
当然也少不了 JS：[React TUI - Ink](https://github.com/vadimdemedes/ink)：  
  
- [React - 扫雷](https://github.com/mordv/mnswpr): `npx mnswpr`  
- [React - Git](https://github.com/GitGud-org/GitGud)  
  
> ~~能用 JS 写的终将会用 JS 写~~    
> 能用 Rust 写的终将会用 Rust 写  
  
## 什么是前端？  
  
提到前端很容易会联想到这些标签：HTML + CSS + JS / Browser / Web / React / Vue  
  
但现在 (2024) 的前端已经完全不限于上述的标签里了  
  
- Rust 工具链、WebAssembly  
- BFF  
- TUI  
- RN、Flutter  
- 鸿蒙  
- ......  
  
> ![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Omni-FrontEnd--2024-04-07_19.18.53.png)    
> -- [我的大前端世界观 - 黄玄 Hux](https://b23.tv/xIwn2RM)  
  
国内把这种拥有更全面能力的前端称为「大前端」，但我觉得这个词不好的地方是：会让人**自以为了解**其含义  
  
并且由于里面存在「前端」的字眼，所以大概率还是会局限在固有标签里  
  
> 把 [终端的异步状态管理](../59/%E7%BB%88%E7%AB%AF%E7%9A%84%E5%BC%82%E6%AD%A5%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86.md) 这篇文章的「终端」换为「大前端」，我觉得就不能很好的表达其意思了  
  
## 终端？  
  
终端（Terminal）固有印象：黑窗口/命令行窗口  
  
> ![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/IMG_3528.png)    
> -- [Terminal](<https://zh.m.wikipedia.org/wiki/%E7%BB%88%E7%AB%AF_(macOS)>)  
  
### 此终端（end device）非彼终端（Terminal）  
  
![Kanban--2024-04-14_16.41.34-1.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Kanban--2024-04-14_16.41.34-1.png)  
  
> 鸿蒙 HarmonyOS 系统是面向万物互联的全场景分布式操作系统，支持手机、平板、智能穿戴、智慧屏等多种终端设备运行  
  
更接近我们要表达的意思：人机交互入口、链路的终点，而不是局限在 `Web/Native/Terminal`，又或是手机、电脑、电视等  
  
而且终端这个词的“好处”是人们的第一反应是疑惑与好奇：这跟前端有什么关系？这会驱使其进一步了解，而不是自以为了解  
  
## Omni-FrontEnd  
  
黄玄视频中提到的词  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Omni-FrontEnd--2024-04-07_20.53.13.png)  
  
## Front-end  
  
![Kanban--2024-04-14_16.41.22-1.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Kanban--2024-04-14_16.41.22-1.png)  
  
其实我觉得前端（Front-end）这个词本身是挺好的：**设计和开发用户可以直接看到和交互的部分**  
  
单看这一句完全可以把 end device 相关的都算到前端里，但由于时代的固有印象，不得不用一些新词/概念来进行区分  
