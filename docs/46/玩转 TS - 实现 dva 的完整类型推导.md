---  
tags:  
  - FE  
  - TypeScript  
  - HowTo  
share: "true"  
issue: 46
created: 2021-06-08
title: 玩转 TS - 实现 dva 的完整类型推导
description: 玩转 TS - 实现 dva 的完整类型推导
permalink: "46"
---  
  
## 前言  
  
在 TypeScript 4.1 来临之前，对于像 `dva`、`vuex` 这种需要在触发时写入命名空间的函数，我们无奈的只能使用 `any` 对其进行类型定义。  
  
```ts  
dispatch({  
  type: "users/getUser",  
  payload: "...", // any  
})  
```  
  
这使得项目中本应良好的 `TS` 类型推导出现了断层，社区中也有相关的解决方案，但都是通过更加复杂类型、函数封装进而实现的，与官方写法大相径庭。  
  
好在，TypeScript 4.1 带来了 [Template Literal Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html) 特性，是我们可以对类型进行字符串拼接操作，从而使得此类函数的类型推导称为现实。  
  
本文将带你一一讲解具体的推导过程，希望看完之后会有收获。  
  
同时，本文的最终实现已经发布了 `npm` 包：`dva-type`，可以在项目中直接安装使用。  
  
## Dva 基本使用  
  
写代码之前先让我们回顾一下 dva 的基本使用，也好让我们知道自己最终要实现什么。  
  
### Model 定义  
  
`dva` 中通过定义 `model` 来声明各模块的状态，其中 `reducers` 就是 `redux` 的 `reducers`，`effects` 就是用来执行异步操作的地方，在 `effect` 中最终也会通过 `reducers` 将状态更新到 `state` 中。  
  
```ts  
cosnt model = {  
  state: {},  
  effects: {  
    getList() {}  
  }  
  reducers: {  
    merge() {}  
  }  
}  
```  
  
### 基本使用  
  
使用方法同 `redux`  
  
- 使用 `connect` 高阶函数或者 `useSelector` 来获取 `state`  
- 使用 `connect` 或者 `useDispatch` 拿到 `dispatch` 函数  
  
```ts  
connect((state) => ({  
  userInfo: state.users.info,  
}))  
  
// 类型断层  
dispatch({  
  type: "users/getUser",  
  payload: false,  
})  
```  
  
类型断层主要在于 `dispatch` 时的 `action` 类型无法推导，`state` 的类型提示则没有问题，而 `action` 之所以会失效主要在于参数 `type` 需要拼接命名空间。  
  
所以我们要解决的其实就是拼接命名空间之后的类型提示和推导，而这在 Template Literal Types 特性出现之后，就使得解决方案变得异常简单与自然。  
  
## Dva-type  
  
开始 `dva-type` 的源码解析之前，先看一下它是如何使用的  
  
### Dva-type 使用  
  
1. 定义单个 `Model` 类型（注意 `Model`、`Effect` 不是从 `dva` 中导入的）  
  
   ```ts  
   import { Effect, Model } from "dva-type"  
  
   interface ListModel extends Model {  
     state: {  
       list: any[]  
     }  
     effects: {  
       // 定义effect 传入 payload 类型  
       getList: Effect<number>  
  
       // 不需要 payload 的 effect  
       getInfo: Effect  
     }  
   }  
   ```  
  
2. 定义项目中所有 `Model` 的集合（**使用 `type` 而不是 `interface`**）  
  
   ```ts  
   // 使用 type 定义 models，将项目中的所有 model 进行收集  
   type Models = {  
     list: ListModel  
     info: InfoModel  
     // ...  
   }  
   ```  
  
3. 将 `Models` 传入 `ResolverModels` 获取 `state` 和 `actions` 的类型  
  
   ```ts  
   import { ResolverModels } from "dva-type"  
  
   type State = ResolverModels<Models>["state"]  
   type Actions = ResolverModels<Models>["actions"]  
   ```  
  
4. 使用  
  
   ```ts  
   // hooks  
   useSelector<State>()  
   const dispatch = useDispatch<(action: Actions) => any>()  
  
   // class  
   const mapStateToProps = (state: State) => {}  
   interface Props {  
     dispatch: (action: Actions) => any  
   }  
   ```  
  
### Dva-type 源码解析  
  
从上面的使用中可以看到，一切的秘密都在 `ResolverModels` 这个类型中，下面我们就看看其实现  
  
```ts  
interface ResolverModels<T extends Record<string, Model>> {  
  state: ResolverState<T> & Loading<T>  
  actions: ResolverReducers<T> | ResolverEffects<T>  
}  
```  
  
#### 提取 State  
  
`state` 的解析很简单，使用 `keyof` 遍历 `models` 的 `state` 定义即可。  
  
```ts  
type ResolverState<T extends Record<string, Model>> = UnionToIntersection<{  
  [k in keyof T]: T[k]["state"]  
}>  
```  
  
这是基本操作，让我们大致过一下这个过程发生了什么  
  
1. `T` 是我们传入的 `Models` 类型定义  
2. `[k in keyof T]` 相当于遍历了 `T` 的键：`list`、`info`  
3. `T[k]['state']` 相当于：`T['list']['state’]`、`T['info']['state’]`  
  
这样就把 `state` 的类型给推导出来了，但是推导出来的类型是联合类型，我们还需要将其转换为交叉类型才能正确进行类型提示。  
  
##### 联合类型转换交叉类型  
  
而将联合转换为交叉类型则是网上找到的黑魔法：  
  
```ts  
type UnionToIntersection<U> =  
  (U extends any ? (k: U) => void : never)  
    extends (k: infer I) => void  
    ? I  
    : never  
```  
  
具体的深层原理我也没有搞懂，但是可以看一下具体做了那些事情：  
  
1. `U extends any ? (k: U) => void : never`  
   - `extends any` 这个条件永远是 `true`，所以这里就是把传入的类型 `U` 变为了 函数类型：`(k: U) => void`  
2. `extends (k: infer I) => void`  
   - 第一步我们把类型变为了 `(k: U) => void`，所以这里的 `extends` 的判断结果肯定也是 `true`。  
   - 注意 `infer I`，这将类型 `U` 重新做了推断，就是这一步使联合类型变为了交叉类型。  
3. `? I : never`  
   - 很明显，根据第一个和第二步，这里的三元表达式永远都会返回 `I`。  
   - 至此，联合类型被转换为了交叉类型。  
  
#### 提取 Actions  
  
`dva` 提供的 `Effect` 类型不能传入 `payload` 的类型定义，所以这里我们需要封装一个 `Effect` 出来：  
  
```ts  
type Effect<P = undefined> = (  
  action: { type: any; payload?: P },  
  effect: EffectsCommandMap  
) => void  
```  
  
##### 解析 `effects` 类型  
  
```ts  
type ResolverEffects<T extends Record<string, Model>> = ValueType<{  
  [t in keyof T]: ValueType<{  
    [k in keyof T[t]["effects"]]: T[t]["effects"][k] extends (  
      action: { type: any; payload?: infer A },  
      effect: EffectsCommandMap  
    ) => void  
      ? A extends undefined  
        ? {  
            type: `${t}/${k}`  
            [k: string]: any  
          }  
        : {  
            type: `${t}/${k}`  
            payload: A  
            [k: string]: any  
          }  
      : never  
  }>  
}>  
```  
  
代码一大坨，按流程走一遍：  
  
1. `T` 依然是传入的 `Models` 类型  
2. `[t in keyof T]` 同 `state`，不再赘述。  
3. `[k in keyof T[t]['effects']]`，这一步就是将每个 `model` 中定义的 `effect` 进行了遍历，相当于：`Models['list']['effects']['getList’]`、`Models['info']['effects']['getInfo’]`  
4. `T[t]['effects'][k] extends (action: { type: any; payload?: infer A },effect: EffectsCommandMap) => void`  
  
   - `extends` 后面的函数类型与我们定义的 `Effect` 类型一致  
   - 注意 `extends ... payload?: infer A …`，这里将 `payload` 的类型提取了出来  
  
5. `A extends undefined`，这一步是为了判断 `effect` 是否需要传入 `payload`，如果不需要则不需要在类型中体现  
6. ```ts  
   {  
     type: `${t}/${k}`  
     payload: A  
   }  
   ```  
   1. `payload: A` 这个就是将推导出来的类型又赋值回去了  
   2. type: ${t}/${k}，其中 `t` 表示了命名空间，`k` 表示了 `effect` 的名称：`type: 'list/getList'`  
7. 至此，类型已经推导出来了，但是格式却不是我们想要的：  
  
   ```ts  
   {  
     list: {  
       getList: {  
         type: 'list/getList',  
         payload: number  
       }  
     }  
   }  
   ```  
  
8. 我们只想要最里面的 `{type: .. payload ..}` 部分，所以这里要做的就是将 `value` 的类型提取出来，做法也非常简单：`T[keyof T]`，遍历并访问类型的键就可以将值类型全部取出。  
9. 将其简单封装，就是最外层的 `ValueType` 的作用了。  
  
`effects` 的类型提取出来了，`reducers` 也是同样的做法，就不赘述了。  
  
#### Dva-loading 类型  
  
`dva-loading` 中可以根据 `effects` 提供 `loading` 变量，我们解析了 `effects` 之后，`loading` 的变量提示也是顺其自然了  
  
```ts  
interface Loading<T extends Record<string, Model>> {  
  loading: {  
    global: boolean  
    models: {  
      [k in keyof T]: boolean  
    }  
    effects: {  
      [k in ResolverEffects<T>["type"]]: boolean  
    }  
  }  
}  
```  
  
## End  
  
OK，感谢看到这里，希望看完之后对你有所提升，  
