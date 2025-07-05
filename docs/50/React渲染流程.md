---
tags:
  - React
  - Explanation
  - FE
share: "true"
issue: "50"
created: 2021-05-06T20:12
updated: 2024-05-12T12:36
---
  
想要知道 `React` 的内部运行机制，实际上就是要探索 `React` 如何将组件映射屏幕，以及组件中的状态发生了变化之后 `React` 如何将这些「变化」更新到屏幕上。  
  
## React 渲染流程图解  
  
![image](https://github.com/lei4519/picture-bed/raw/main/images/1619879843033-image.png)  
  
对于首次渲染，`React` 的主要工作就是将 `React.render` 接收到的 `VNode` 转化 `Fiber` 树，并根据 `Fiber` 树的层级关系，构建生成出 `DOM` 树并渲染至屏幕中。  
  
而对于更新渲染时，`Fiber` 树已经存在于内存中了，所以 `React` 更关心的是计算出 `Fiber` 树中的各个节点的差异，并将变化更新到屏幕中。  
  
## React 中的基础概念  
  
在进行流程解读之前，有一些关于 `React` 源码中的概念需要先了解一下。  
  
### 两个阶段  
  
为了实现 `concurrent` 模式，`React` 将渲染更新的过程分为了两个阶段：  
  
1. `render` 阶段，利用双缓冲技术，在内存中构造另一颗 `Fiber` 树，在其上进行协调计算，找到需要更新的节点并记录，这个过程会被重复中断恢复执行。  
2. `commit` 阶段，根据 `render` 阶段的计算结果，执行更新操作，这个过程是同步执行的。  
  
### VNode(元素)  
  
`JSX` 会被编译转换成 `React.createElement` 函数的调用，其返回值就是 `VNode`，`虚拟DOM` 节点的描述对象。  
  
在 `React` 源码中称之为 `element`，为了避免和 `DOM元素` 的冲突，这里我就用大家比较熟悉的 `虚拟DOM` 来称呼了。  
  
```js  
{  
  // DOM节点名称或类组件、函数组件  
  type: 'div' | App,  
  ref: null,  
  key: null,  
  props: null  
}  
```  
  
### Fiber  
  
Fiber 有两层含义：程序架构、数据结构  
  
从程序架构的角度来看，为了实现 `concurrent` 模式，需要程序具备的可中断、可恢复的特性，而之前 `VNode` 的树型结构很难完成这些操作，所以 `Fiber` 就应运而生了。  
  
那 `Fiber` 究竟是如何实现可中断、可恢复的呢？这就要说说 `Fiber` 的具体数据结构了。  
  
`Fiber` 是一个链表结构，通过 `child`、`sibling`、`return` 三个属性记录了树型结构中的子节点、兄弟节点、父节点的关系信息，从而可以实现从任一节点出发，都可以访问其他节点的特性。  
  
除了作为链表的结构之外，程序运行时还需要记录组件的各种状态、实例、真实 DOM 元素映射等等信息，这些都会被记录在 `Fiber` 这个对象身上。  
  
```js  
function FiberNode() {  
  this.tag = tag  
  this.key = key  
  this.elementType = null  
  this.type = null  
  this.stateNode = null  
  this.return = null  
  this.child = null  
  this.sibling = null  
  this.index = 0  
  this.ref = null  
  this.pendingProps = pendingProps  
  this.memoizedProps = null  
  this.updateQueue = null  
  this.memoizedState = null  
  this.dependencies = null  
  this.mode = mode  
  this.effectTag = NoEffect  
  this.nextEffect = null  
  this.firstEffect = null  
  this.lastEffect = null  
  this.expirationTime = NoWork  
  this.childExpirationTime = NoWork  
  this.alternate = null  
}  
```  
  
#### return、child、sibling  
  
这三个属性主要用途是将每个 Fiber 节点连接起来，用链表的结构来描述树型结构的关系。  
  
- child：指向第一个子节点  
- sibling：指向第一个兄弟节点  
- return：指向父节点  
  
#### effectTag（flags）  
  
副作用标记，标识了此 `Fiber` 节点需要进行哪些操作，默认为 `NoEffect`。  
  
标记了 `NoEffect`、`PerformedWork` 的节点在更新过程中会被跳过。  
  
```js  
// 源码位置：packages/shared/ReactSideEffectTags.js  
// 作为 EffectTag 的初始值，或者用于 EffectTag 的比较判断，其值为 0 表示没有副作用，也就是不涉 及更新  
export const NoEffect = 0b000000000000  
// 由 React devtools 读取， NoEffect 和 PerformedWork 都不会被 commit，当创建 Effect List时，会跳过NoEffect 和 PerformedWork  
export const PerformedWork = 0b000000000001  
// 表示向树中插入新的子节点，对应的状态为 MOUNTING，当执行 commitPlacement 函数完成插入后， 清除该标志位  
export const Placement = 0b000000000010  
// 表示当 props、state、context 发生变化或者 forceUpdate 时，会标记为 Update ，检查到标记后，执行 mmitUpdate 函数进行属性更新，与其相关的生命周期函数为 componentDidMount 和 componentDidUpdate  
export const Update = 0b000000000100  
export const PlacementAndUpdate = 0b000000000110  
// 标记将要卸载的结点，检查到标记后，执行 commitDeletion 函数对组件进行卸载，在节点树中删除对应对 节点，与其相关的生命周期函数为 componentWillUnmount  
export const Deletion = 0b000000001000  
export const ContentReset = 0b000000010000  
export const Callback = 0b000000100000  
export const DidCapture = 0b000001000000  
export const Ref = 0b000010000000  
export const Snapshot = 0b000100000000  
export const Passive = 0b001000000000  
export const LifecycleEffectMask = 0b001110100100  
export const HostEffectMask = 0b001111111111  
```  
  
#### nextEffect、firstEffect、lastEffect  
  
链表结构，保存了需要更新的后代节点，每个 `Fiber` 节点处理完自身后都会根据相应逻辑与父节点的 `lastEffect` 进行连接。  
  
这样在 `commit` 阶段，只需要从根节点的 `firstEffect` 向下遍历，就可以将所有需要更新的节点进行相应处理了。  
  
#### updateQueue  
  
保存了同一事件循环中对组件的多次更新操作（多次调用 `setState`）  
  
#### Tag  
  
`tag` 描述了 `Fiber` 节点的类型  
  
```js  
// 源码位置:packages/shared/ReactWorkTags.js  
export const FunctionComponent = 0 // 函数组件元素对应的 Fiber 结点  
export const ClassComponent = 1 // Class组件元素对应的 Fiber 结点  
export const IndeterminateComponent = 2 // 在不确定是 Class 组件元素还是函数组件元素时的取值 export const HostRoot = 3; // 对应 Fiber 树的根结点  
export const HostPortal = 4 // 对应一颗子树，可以另一个渲染器的入口  
export const HostComponent = 5 // 宿主组件元素(如div，button等)对应的 Fiber 结点  
export const HostText = 6 // 文本元素(如div，button等)对应的 Fiber 结点  
export const Fragment = 7  
```  
  
#### stateNode  
  
`Fiber` 节点的 `stateNode` 属性存储的当前节点的最终产物  
  
- `ClassComponent` 类型的节点则该属性指向的是当前 `Class` 组件的实例  
- `HostComponent` 类型的节点则该属性指向的是当前节点的 `DOM` 实例  
- `HostRoot` 类型的节点则该属性指向的是 `fiberRoot` 对象  
  
### FiberRootNode  
  
`fiberRoot` 对象是整个 `Fiber架构` 的入口对象，其上记录了应用程序运行过程中需要保存的关键信息。  
  
```js  
function FiberRootNode(containerInfo, tag, hydrate) {  
  this.tag = tag  
  // current树  
  this.current = null  
  // 包含容器  
  this.containerInfo = containerInfo  
  this.pendingChildren = null  
  this.pingCache = null  
  this.finishedExpirationTime = NoWork  
  // 存储工作循环(workLoop)结束后的副作用列表，用于commit阶段  
  this.finishedWork = null  
  this.timeoutHandle = noTimeout  
  this.context = null  
  this.pendingContext = null  
  this.hydrate = hydrate  
  this.firstBatch = null  
}  
```  
  
`containerInfo` 保存了 `React.render` 函数第二个参数，也就是程序的真实 `DOM` 容器。  
  
`current` 属性既是应用程序中 `Fiber树` 的入口。  
  
`current` 的值是一个 `HostRoot` 类型的 `Fiber` 节点，这个 `HostRoot` 的子节点就是程序的根组件（`App`）对应的 `Fiber` 节点。  
  
在首次渲染调用 `React.render` 时，应用程序中其实只有一个 `HostRoot` 的 `Fiber` 节点，而在 `render` 过程中，才会将我们传入的 `App` 组件构建成 `HostRoot` 的子 `Fiber` 节点。  
  
### 双缓冲  
  
双缓冲是指将需要变化的部分，先在内存中计算改变，计算完成后一次性展示给用户，这样用户就不会感知到明显的计算变化。离屏 `Canvas` 就是双缓冲的思想。  
  
对于 `Concurrent` 模式来说，更新计算的过程会被频繁中断，如果不使用缓冲技术，那用户就会感知到明显的中断变化。  
  
每个 `Fiber` 节点的 `alternate` 属性会指向另一个 `Fiber` 节点，这个 `Fiber` 节点就是「草稿」节点，当需要进行计算时，就会在这个节点上进行。计算完成后将两个节点进行互换，展示给用户。  
  
作为已经计算完成并展示到视图中的 `Fiber` 树，在源码中称为 `current` 树。  
  
而 `current` 树的 `alternate` 指向的另一棵树，就是用来计算变化的，称为 `WorkInProgress` 树（`WIP`）。  
  
### 组件  
  
函数或者是类，最终产出 `VNode` 和定义生命周期钩子。  
  
### 组件实例  
  
类组件实例化后的对象，其上记录了生命周期函数、组件自身状态、响应事件等。对于函数组件来说，没有实例对象，所以在 `hooks` 出现之前函数组件不能拥有自己的状态，而在 `hooks` 之后，函数组件通过调用 `hooks` 的产生状态被记录在组件对应的 `Fiber` 对象中。  
  
### update（更新对象）  
  
包含过期时间、更新内容的对象。  
  
### updateList（更新队列）  
  
`update` 的集合，链表结构。`React` 的更新操作都是异步执行的，在同一个宏任务中执行的更新操作都会被记录在此处，统一在下一个队列中执行。  
  
## 更新队列  
  
不管是首次渲染还是更新渲染，都一定会经过以下步骤：  
  
1. 创建更新对象  
2. 加入更新队列  
3. 遍历合并更新队列获取最终的状态值。  
  
所以我们先来了解一下什么是更新对象和队列。  
  
### 更新队列的作用  
  
主要是对同步的多次调用 `setState` 进行缓冲，避免冗余的渲染调用。  
  
#### 多次触发更新（setState）  
  
触发更新操作时，`React` 会从 `this`（类组件）或 `hooks` 返回的 `setter` 函数中找到对应的 `Fiber` 节点，然后根据传入 `setState` 的参数创建更新对象，并将更新对象保存在 `Fiber` 节点的 `updateQueue` 中。  
  
这样我们在同一个事件循环中对组件的多次修改操作就可以记录下来，在下一个事件循环中统一进行处理。处理时就会遍历 `updateQueue` 中的修改，依次合并获取最终的 `state` 进行渲染。  
  
### 更新对象定义  
  
```js  
function createUpdate(expirationTime, suspenseConfig) {  
  var update = {  
    // 过期时间与任务优先级相关联  
    expirationTime: expirationTime,  
    suspenseConfig: suspenseConfig,  
    // tag用于标识更新的类型如UpdateState，ReplaceState，ForceUpdate等  
    tag: UpdateState,  
    // 更新内容  
    payload: null,  
    // 更新完成后的回调  
    callback: null,  
    // 下一个更新（任务）  
    next: null,  
    // 下一个副作用  
    nextEffect: null,  
  }  
  {  
    // 优先级会根据任务体系中当前任务队列的执行情况而定  
    update.priority = getCurrentPriorityLevel()  
  }  
  return update  
}  
```  
  
为了防止某个 `update` 因为优先级的问题一直被打断，`React` 给每个 `update` 都设置了过期时间（`expirationTime`），当时间到了就会强制执行改 `update`。  
  
`expirationTime` 会根据任务的优先级计算得来  
  
```js  
// 源码位置：packages/scheduler/src/Scheduler.js  
// 立即执行（可由饥饿任务转换），最高优先级  
var ImmediatePriority = 1  
// 用户阻塞级别（如外部事件），次高优先级  
var UserBlockingPriority = 2  
// 普通优先级  
var NormalPriority = 3  
// 低优先级  
var LowPriority = 4  
// 最低优先级，空闲时去执行  
var IdlePriority = 5  
```  
  
简单点说，具有 `UserBlockingPriority` 级别的多个更新，如果它们的时间间隔小于 10ms，那么它们拥有相同的过期时间。  
  
同样的方式可以推到出具有 `LowPriority` 级别的多个更新（一般为异步更新），如果它们的时间间隔小于 25ms，那么它们也拥有相同的过期时间。  
  
`React` 的过期时间机制保证了短时间内同一个 `Fiber` 节点的多个更新拥有相同的过期时间，最终会合并在一起执行。  
  
### 更新队列定义  
  
```js  
// 源码位置:packages/react-reconciler/src/ReactUpdateQueue.js  
function createUpdateQueue(baseState) {  
  var queue = {  
    // 当前的state  
    baseState: baseState,  
    // 队列中第一个更新  
    firstUpdate: null,  
    // 队列中的最后一个更新 lastUpdate: null,  
    // 队列中第一个捕获类型的update firstCapturedUpdate: null,  
    // 队列中第一个捕获类型的update lastCapturedUpdate: null,  
    // 第一个副作用  
    firstEffect: null,  
    // 最后一个副作用  
    lastEffect: null,  
    firstCapturedEffect: null,  
    lastCapturedEffect: null,  
  }  
  return queue  
}  
```  
  
## 初始渲染流程  
  
1. 根组件的 `JSX` 定义会被 `babel` 转换为 `React.createElement` 的调用，其返回值为 `VNode树`。  
2. `React.render` 调用，实例化 `FiberRootNode`，并创建 `根Fiber` 节点 `HostRoot` 赋值给 `FiberRoot` 的 `current` 属性  
3. 创建更新对象，其更新内容为 `React.render` 接受到的第一个参数 `VNode树`，将更新对象添加到 `HostRoot` 节点的 `updateQueue` 中  
4. 处理更新队列，从 `HostRoot` 节点开始遍历，在其 `alternate` 属性中构建 `WIP` 树，在构建 `Fiber` 树的过程中会根据 `VNode` 的类型进行组件实例化、生命周期调用等工作，对需要操作视图的动作将其保存到 `Fiber` 节点的 `effectTag` 上面，将需要更新在 DOM 上的属性保存至 `updateQueue` 中，并将其与父节点的 `lastEffect` 连接。  
5. 当整颗树遍历完成后，进入 `commit` 阶段，此阶段就是将 `effectList` 收集的 `DOM` 操作应用到屏幕上。  
6. `commit` 完成将 `current` 替换为 `WIP` 树。  
  
### 构建 WIP 树  
  
`React` 会先以 `current` 这个 `Fiber` 节点为基础，创建一个新的 `Fiber` 节点并赋值给 `current.alternate` 属性，然后在这个 `alternate` 节点上进行协调计算，这就是之前所说的 `WIP` 树。  
  
协调时会在全局记录一个 `workInProgress` 指针，用来保存当前正在处理的节点，这样中断之后就可以在下一个事件循环中接着进行协调。  
  
此时整个更新队列中只有 `HostRoot` 这一个 `Fiber` 节点，对当前节点处理完成之后，会调用 `reconcileChildren` 方法来获取子节点，并对子节点做同样的处理流程。  
  
### Fiber 节点处理  
  
1. 创建当前节点，并返回子节点  
2. 如果子节点为空，则执行叶子节点逻辑  
3. 否则，将子节点赋值给 `workInProgress` 指针，作为下一个处理的节点。  
  
这里主要说一下三种主要节点：HostRoot、ClassComponent、HostComponent  
  
- HostRoot  
  - 对于 `HostRoot` 主要是处理其身上的更新队列，获取根组件的元素。  
- ClassComponent  
  - 解析完 `HostRoot` 后会返回其 `child` 节点，一般来说就是 `ClassComponent` 了。  
  - 这种类型的 `Fiber` 节点是需要进行组件实例化的，实例会被保存在 `Fiber` 的 `stateNode` 属性上。  
  - 实例化之后会调用 `render` 拿到其 `VNode` 再次进行构建过程。  
  - 对于数组类型的 `VNode`，会使用 `sibling` 属性将其相连。  
- HostComponent  
  - `HostComponent` 就是原生的 `DOM` 类型了，会创建 `DOM` 对象并保存到 `stateNode` 属性上。  
  
#### 叶子节点逻辑  
  
简单思考一下，叶子节点必然是一个 `DOM` 类型的节点，也就是 `HostComponent`，所以对叶子节点的处理可以理解为将 `Fiber` 节点映射为 `DOM` 节点的过程。  
  
当碰到叶子节点时，会创建相应的 `DOM` 元素，然后将其记录在 `Fiber` 的 `stateNode` 属性中，然后调用 `appendAllChildren` 将子节点创建好的的 `DOM` 添加到 `DOM` 结构中。  
  
叶子节点处理完毕后  
  
- 如果其兄弟节点存在，就将 `workInProgress` 指针指向其兄弟节点。  
- 否则就将 `workInProgress` 指向其父节点。  
  
### 收集副作用  
  
收集副作用的过程中主要有两种情况  
  
1. 第一种情况是将当前节点的副作用链表添加到父节点中  
   - `returnFiber.lastEffect.nextEffect = workInProgress.firstEffect`  
2. 第二种情况就是如果当前节点也有副作用标识，则将当前节点连接到父节点的副作用链表中  
   - `returnFiber.lastEffect.nextEffect = workInProgress`  
  
### 处理副作用  
  
从根节点的 `firstEffect` 开始向下遍历  
  
1. `before mutation`：遍历 `effectList`，执行生命周期函数 `getSnapshotBeforeUpdate`，使用 `scheduleCallback` 异步调度 `flushPassiveEffects` 方法（`useEffect` 逻辑）  
2. `mutation`：第二次遍历，根据 `Fiber` 节点的 `effectTag` 对 `DOM` 进行插入、删除、更新等操作；将 `effectList` 赋值给 `rootWithPendingPassiveEffects`  
3. `layout`：从头再次遍历，执行生命周期函数，如 `componentDidMount`、`DidUpdate` 等，同时会将 `current` 替换为 `WIP` 树，置空 `WIP` 树；`scheduleCallback` 触发 `flushPassiveEffects`，`flushPassiveEffects` 内部遍历 `rootWithPendingPassiveEffects`  
  
### 渲染完成  
  
至此整个 `DOM` 树就被创建并插入到了 `DOM` 容器中，整个应用程序也展示到了屏幕上，初次渲染流程结束。  
  
## 更新渲染流程  
  
1. 组件调用 `setState` 触发更新，`React` 通过 `this` 找到组件对应的 `Fiber` 对象，使用 `setState` 的参数创建更新对象，并将其添加进 `Fiber` 的更新队列中，然后开启调度流程。  
2. 从根 `Fiber` 节点开始构建 `WIP` 树，此时会重点处理新旧节点的差异点，并尽可能复用旧的 `Fiber` 节点。  
3. 处理 `Fiber` 节点，检查 `Fiber` 节点的更新队列是否有值，`context` 是否有变化，如果没有则跳过。  
   - 处理更新队列，拿到最新的 `state`，调用 `shouldComponentUpdate` 判断是否需要更新。  
4. 调用 `render` 方法获取 `VNode`，进行 `diff` 算法，标记 `effectTag`，收集到 `effectList` 中。  
   - 对于新元素，标记插入 `Placement`  
   - 旧 `DOM` 元素，判断属性是否发生变化，标记 `Update`  
   - 对于删除的元素，标记删除 `Deletion`  
5. 遍历处理 `effectList`，调用生命周期并更新 `DOM`。  
  
## Fiber Diff  
  
### 单个节点  
  
当 `key` 和 `type` 都相同时，会复用之前的 `Fiber` 节点，否则则会新建并将旧节点标记删除。  
  
### 多个节点  
  
## 任务与调度  
  
### 时间切片  
  
在 `Concurrent` 模式下，任务以 `Fiber` 为单位进行执行，当 `Fiber` 处理完成，或者 `shouldYield` 返回值为 `true` 时，就会暂停执行，让出线程。  
  
```js  
while (workInProgress !== null && !shouldYield()) {  
  performUnitOfWork(workInProgress)  
}  
```  
  
在 `shouldYield` 中会判断当前时间与当前切片的过期时间，如果过期了，就会返回 `true`，而当前时间的过期时间则是根据不同的优先级进行计算得来。  
  
#### 与浏览器通信 - MessageChannel  
  
对于浏览器而言，如果我们想要让出 js 线程，那就是只能把当前的宏任务执行完成。等到下一个宏任务中再接着执行。当浏览器执行完一个宏任务后就会切换只渲染进程进行视图的渲染工作。MessageChannel 可以创建一个宏任务，其优先级比 setTimeout(0) 高。  
  
## 参考资料  
  
- [剖析 React 内部运行机制](https://www.imooc.com/read/86)  
- [React 技术揭秘](https://react.iamkasong.com/)  
