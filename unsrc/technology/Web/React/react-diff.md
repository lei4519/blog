# React Diff

## React 核心思想
> 内存中维护一颗虚拟DOM树，数据变化时（setState），自动更新虚拟 DOM，得到一颗新树，然后 Diff 新老虚拟 DOM 树，找到有变化的部分，得到一个 Change(Patch)，将这个 Patch 加入队列，最终批量更新这些 Patch 到 DOM 中。

@flowstart
@flowstart
st=>start: 程序执行
render=>operation: Render
firstRender=>condition: 首次渲染?
mounted=>end: 渲染完成


st->Render->firstRender(yes)->mounted
st->firstRender(no)
@flowend


参考文章
- [Deep In React系列](https://mp.weixin.qq.com/s/dONYc-Y96baiXBXpwh1w3A)