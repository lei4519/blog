---
tags:
  - FE
  - Explanation
share: "true"
issue: "61"
created: 2024-03-05T20:12
updated: 2024-05-12T12:36
---
  
## 背景  
  
精力是有限的，多花费一分在某个点上，就注定会减少在另一个点上  
  
好用 + 好看 = 时间长  
  
时间短 + 好看 = 不好用  
  
时间短 + 好用 = 不好看  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415181239.png)  
  
## 目标  
  
制定更多基础的 UI 规范（字号、间距、圆角...），提高设计、开发的交付效率  
  
规范 = 约束= 效率  
  
### 下面的场景如何抉择？  
  
假设左边是精心设计的**完美视觉效果页面**，右边是根据「死板」规范无脑堆出来的页面  
  
| **100% 视觉效果 & 100% 成本（心智负担）**                                                                  | **80% 视觉效果 & 50% 成本（心智负担）**                                                                    |  
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |  
| ![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240327135037.png) | ![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415180746.png) |  
| ![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415180758.png) | ![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415180808.png) |  
  
没有标准答案，需要考虑具体的应用场景、定位  
  
但不可否认的是，如果去掉标注，仅凭肉眼是很难分辨两者的差 |  
  
没有标准答案，需要考虑具体的应用场景、定位  
  
但不可否认的是，如果去掉标注，仅凭肉眼是很难分辨两者的差异的，所以右边的性价比高无疑是更高的  
  
### 现状  
  
长期持续的系统组件化 + 芝士组件迁移之后，现在已经大幅减少了设计和研发在 UI 上的成本  
  
> 需求很多，但真正需要设计的模块很少，绝大多数都是直接复用现有组件  
  
### 问题  
  
1. 不可能所有模块都去组件化，总是需要设计的，总是有新东西  
2. 缺乏规范的情况下，组件化的实施很困难  
  
#### 举例  
  
在商业经常 battle 颜色问题，比如按钮组件封装后，后续需求发现颜色变了  
  
（用提示文案举例可能更合适，八百种灰  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415181253.png)  
  
- ✅ 正确做法是：与设计沟通确定颜色，整体做改动  
  - 但精力是有限的，团队合作沟通成本是最大的，成本最低是设计图怎么样就怎么写  
- ❌ 最终导致组件化失败（多个组件、同一个组件多种样式、每处都单独写）  
  
> 「颜色」只是举例，间距、字号、行高、圆角等等都有同样的问题  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415181504.png)  
  
转社区后，就再也没有过这样的问题了，因为有了颜色规范  
  
---  
  
上次的组件迁移时，就聊到能不能规范一下圆角，统一一下，最后的结果就是做不到  
  
要么都改，要么都不改。怕的就是每处都单独改，每处都不一样，系统就失控了  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415181325.png)  
  
### 系统化 UI：提前定义系统，有约束的设计  
  
#### 限制选择 (Limit Your choices)  
  
    ◦ 纠结字体大小是 12px 还是用 13px ?  
    ◦ 边框阴影应具有 10% 的不透明度还是 15% 的不透明度？  
    ◦ 头像高度应该是 24px 还是 25px？  
  
##### 优点  
  
成本降低：  
  
1. 设计阶段：设计成本、沟通成本（产品）  
2. 开发阶段：开发成本、沟通成本（设计）  
3. 验收阶段：设计验收成本、开发改动成本  
  
##### 缺点  
  
限制设计发挥，达不到完美效果  
  
##### 万物都可系统化（Systematize everything）  
  
    ◦ 字体大小（Font size）  
    ◦ 字体粗细（Font weight）  
    ◦ 行高（Line height）  
    ◦ 颜色（Color）  
    ◦ 外边距（Margin）  
    ◦ 内边距（Padding）  
    ◦ 宽度（Width）  
    ◦ 高度（Height）  
    ◦ 边框阴影（Box shadows）  
    ◦ 边框半径（Border radius）  
    ◦ 边框宽度（Border weight）  
    ◦ 不透明度（Opacity）  
    ◦ …  
  
| text                                                                                                       | gap                                                                                                        |  
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |  
| ![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415181543.png) | ![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415181552.png) |  
  
举例：间距规范下的按钮设计，更加具有辨识度  
  
| before                                                                                                     | after                                                                                                      |  
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |  
| ![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415181635.png) | ![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415181649.png) |  
  
### Tailwind CSS  
  
所有 CSS 属性都被符号化了  
  
#### 内外间距  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415181719.png)  
  
#### 字号、行高  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415181726.png)  
  
#### 边框圆角  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415181733.png)  
  
#### 卡片阴影  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415181739.png)  
  
#### 字体  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415181745.png)  
  
#### 动画过渡  
  
## Ref  
  
- [7 Practical Tips for Cheating at Design | by Adam Wathan & Steve Schoger | Refactoring UI | Medium](https://medium.com/refactoring-ui/7-practical-tips-for-cheating-at-design-40c736799886)  
- [Refactoring UI: an essential guide | by Ahlam | Bootcamp](https://bootcamp.uxdesign.cc/refactoring-ui-an-essential-guide-72014f1d77a4)  
- [Refactoring UI](https://www.refactoringui.com/)  
