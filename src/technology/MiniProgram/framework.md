# 给原生小程序安排上Composition API

> 通过对逻辑层的封装，让原生小程序使用Vue3的Composotion API

## 使用示例

index.wxml
```html
<view>
  <view>{{count}}</view>
  <button bindtap="add">数字 +1</button>
</view>
```

index.js
```js
import {Epage, ref, onShowHooks} from 'enhance-weapp'

function useCount() {
  const count = ref(0)
  const add = () => {
    count.value++
  }
  onShowHooks(() => {
    console.log('我是useCount')
  })
  return {
    count,
    add
  }
}


Epage({
  setup() {
    onShowHooks(() => {
      console.log('我是setup')
    })
    return useCount()
  }
})
```

## 原理简述

流程图先走一波

![image](gitee.com/lei451927/picture/raw/master/images/1609148257431-image.png)

1. Epage函数会对传入的`options`对象属性进行遍历，对所有的生命周期方法进行装饰，将生命周期改造成数组结构，并提供相关的hooks方式以调用注册。
2. 在onLoad/created中检查并执行`setup`函数，拿到其返回值`setupData`。
3. 创建`options.data`对象副本（如果有的话），使用`reactive`将其响应式后保存到`this.data$`属性上。
4. 遍历`setupData`，将其值直接赋值给`this.data$`，响应式解包赋值给`this.data`。
5. 调用`this.setData(this.data)`，同步数据至渲染层。
6. 保存`this.data`副本至`this.__oldData__`。
7. 使用`watch`监听`this.data$`，响应式触发后diff `this.data$`与`this.__oldData__`。
8. 调用`this.setData(diffData)`，同步数据至渲染层。
9. 优化部分：当页面onHide时会取消响应式监听，onShow时会重新监听并diff一次数据。

以上是核心的实现思路，除此之外还有全局`mixins`、生命周期阻塞执行、全局生命周期控制等逻辑，具体可以去[enhance-weapp](https://github.com/lei4519/enhance-weapp)，看下介绍和源码。

如果本篇内容对你有帮助，欢迎点赞star👍。
