# Types

## 业务 & 库

### 开发体验

- 智能提示
- 编辑器能力
	- 重构：变量、文件重命名，函数提取
	- 查找引用、实现、函数调用链路
- 文档（补充）

## 类型体操

- lisp 解释器
- 象棋
- base64 编码

## 类型编程


### 流程控制
类型约束

```
type A = 1
type B = 2
type Example = A extends B ? true : false // false
```

### 循环/递归

模式匹配

```
type A = [1, 2, 3]
type ExampleA = A extends [infer First, ...infer Rest] ? First : never // 1
type B = "123"
type ExampleB = B extends `${infer FirstChar}${infer Rest}` ? FirstChar : never // '1'
```

### 数据结构

### 运算

### 参数\变量

数据变化

keyof

T[number]

联合转交叉

交叉转联合










## 例子 - Redux

原子 - 聚合 - 重组 - 应用


```js
const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    increment: state => {
      // Redux Toolkit 允许我们在 reducers 写 "可变" 逻辑。它
      // 并不是真正的改变状态值，因为它使用了 Immer 库
      // 可以检测到“草稿状态“ 的变化并且基于这些变化生产全新的
      // 不可变的状态
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    }
  }
})


const store = configureStore({
  reducer: {
    counter: counterSlice.reducers
  }
})


// 从 store 本身推断出 `RootState` 和 `AppDispatch` 类型
export type RootState = ReturnType<typeof store.getState>
// 推断出类型: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
```






## 例子 - za

```
import React from 'react'
namespace Action {
  /** Type enum. */
  export enum Type {
    Unknown = 0,
    OpenUrl = 1,
    Close = 2,
    PageDisappear = 3,
    Upvote = 7,
    UnUpvote = 8,
    Downvote = 9,
    UnDownvote = 10,
    Thank = 11,
    UnThank = 12,
    NoHelp = 13,
    UnNoHelp = 14,
    Follow = 15,
    UnFollow = 16,
    Comment = 17,
    Collect = 18,
    UnCollect = 19,
    Question = 20,
    Answer = 21,
    Invite = 22,
    Ignore = 23,
    Search = 24,
    Like = 25,
    UnLike = 26,
    Share = 27,
    Report = 28,
    UnReport = 29,
    BlockUser = 30,
    UnBlockUser = 31,
    Applaud = 32,
    UnApplaud = 33,
    Danmaku = 34,
    Save = 35,
    Upload = 36,
    Post = 37,
    Video = 38,
    ClubPost = 39,
    JumpOutside = 40,
    Purchase = 41,
    Download = 42,
    Grade = 43,
    UnPurchase = 44,
    Pin = 45,
    ReadFinished = 46,
    UnIgnore = 47,
    Signin = 48,
    SignUp = 49,
    Forward = 50,
    Gift = 51,
    Statement = 52,
    ReferViewPercentage = 53,
    Play = 1001,
    AutoPlay = 1002,
    Pause = 1003,
    EndPlay = 1004,
    Refresh = 5,
    AutoRefresh = 2001,
    AutoSave = 2002,
    Portal = 2003,
    Expand = 3001,
    Collapse = 3002,
  }
}

export type ExtraInfo<T> = T extends 'OpenUrl'
  ? {
      link: {
        url: string
      }
    }
  : undefined

export type ZAEventProps<T extends keyof typeof Action.Type> = {
  zaAction?: T
} & (T extends 'OpenUrl'
? { extra: ExtraInfo<T> }
: { extra?: ExtraInfo<T> })

function ZAClick<T extends keyof typeof Action.Type>(props: ZAEventProps<T>) {
  return null
}

<ZAClick zaAction="OpenUrl" />

```











// https://zhuanlan.zhihu.com/p/58704376
// https://zhuanlan.zhihu.com/p/47590228
// https://jkchao.github.io/typescript-book-chinese/tips/infer.html#%E4%B8%80%E4%BA%9B%E7%94%A8%E4%BE%8B
// https://zhuanlan.zhihu.com/p/54193438














