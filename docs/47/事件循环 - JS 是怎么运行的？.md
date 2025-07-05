---
tags:
  - FE
  - JavaScript
  - Explanation
share: "true"
issue: "47"
created: 2020-10-02T20:12
updated: 2024-05-12T12:36
---
  
## 前言  
  
- Vue.nextTick 怎么实现的？为什么这个 API 可以保证回调函数在 DOM 更新后被调用？  
  - 抛开 Vue，浏览器对 DOM 的更新是异步的吗？为什么 Vue 中的 DOM 更新是异步的？  
- 如果 setTimeout 中注册回调函数，将时间设为 0，当回调函数执行时 DOM 更新了吗？  
- Vue.nextTick 和 setTimeout(callback, 0)，谁先执行？  
  
如果上面这个问题你都知道了，那你对事件循环的理解在日常工作中就够用了，但还是建议看一下文章，因为会讲一些原理性的知识。  
  
## 概述  
  
- JS 引擎执行 JS 代码，是基于事件循环的。  
- 事件循环：单线程执行异步（非阻塞）代码的一种实现方式。  
- JS 执行线程为什么是单线程？  
  - 为了防止多个 JS 线程同时对 DOM 操作起冲突，比如一个更新了 DOM 属性，另一个删除了 DOM。  
  - 但这并不是最根本的原因，因为别的语言中也存在多个线程同时操作共享数据的情况，解决方案是加入线程锁，来避免多线程同时对相同的数据进行操作。JS 之所以选用单线程，而不是多线程 + 线程锁呢？主要是在设计之初，就没想着做出一个完备强大的语言出来，布兰登·艾克用了 10 天的时间开发 JS 这门语言，所以肯定是怎么简单怎么来。（如果他知道 20 年后这门语言会成为世界上最热门的语言之一，不知道开发时会不会更严谨一点）  
  
## 浏览器进程与线程  
  
想把事件循环讲明白，就绕不过浏览器的进程和线程。  
  
> 异步代码是什么？从哪里来的？  
  
### Chrome 的多进程架构  
  
![IMG_9301.jpeg](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/IMG_9299.JPG)  
  
#### Browser 进程  
  
浏览器的主进程（负责协调、主控）  
  
- 负责浏览器界面显示，与用户交互。如地址栏、书签栏、前进，后退等  
- 负责各个页面的管理，创建和销毁其他进程  
- 网络资源、本地存储、文件系统等  
  
#### 插件进程  
  
- 每种类型的插件对应一个进程，仅当使用该插件时才创建  
  
#### GPU 进程：用于 3D 绘制等  
  
#### Renderer 进程（浏览器内核）  
  
- 主要作用为页面渲染，脚本执行，事件处理等  
  
### 渲染进程（浏览器内核）中的线程  
  
![IMG_9302.PNG](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/IMG_9302.PNG)  
  
#### GUI 渲染线程  
  
> 负责渲染工作  
  
- 渲染线程的工作流程    
  ![IMG_9303.jpeg](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/IMG_9303.JPG)  
  
- GUI 渲染线程与 JS 执行线程是互斥的，一个执行的时候另一个就会被挂起。  
- 常说的 JS 脚本加载和执行会阻塞 DOM 树的解析，指的就是互斥现象。  
  - 在 JS 执行过程中，对 GUI 线程的写操作，并不会被立即执行，而是被保存到一个队列中，等到 JS 引擎空闲时（当前宏任务执行完，下面会详细讲）被执行。  
  
    ```js  
    document.body.style.color = "#000"  
    document.body.style.color = "#001"  
    ```  
  
document.body.style.color = '#002'  
  
    ```  
  
    - 如果JS线程的当前宏任务执行时间过长，就会导致页面渲染不连贯，给用户的感觉就是页面卡顿。  
  
    - `1000毫秒 / 60帧 = 16.6毫秒`  
  
#### JS 引擎线程  
  
> 负责执行 Javascript 代码，V8 引擎指的就是这个。  
  
- JS 引擎在执行代码时，会将需要执行的代码块当成一个个任务，放入任务队列中执行，JS 引擎会不停的检查并运行任务队列中任务。  
  
  ```vue  
  // html  
  <script>  
  console.log(1)  
  console.log(2)  
  console.log(3)  
  </script>  
  
  // 将需要执行的代码包装成一个任务 const task = () => { console.log(1)  
  console.log(2) console.log(3) } // 放入任务队列 pushTask(task)  
  ```  
  
- JS 引擎执行逻辑：伪代码（所有的伪代码都是为了理解写的，并不是浏览器的真实实现）：  
  
  ```js  
  // 任务队列  
  const queueTask = []  
  // 将任务加入任务队列  
  export const pushTask = (task) => queueTask.push(task)  
  
  while (true) {  
    // 不停的去检查队列中是否有任务  
    if (queueTask.length) {  
      // 队列：先进先出  
      const task = queueTask.shift()  
      task()  
    }  
  }  
  ```  
  
#### 事件触发线程  
  
> 事件监听触发  
  
- `document.body.addEventListener('click', () => {})`  
- 伪代码：  
  
  ```js  
  // JS线程 -> 监听事件  
  function addEventListener(eventName, callback) {  
    sendMessage("eventTriggerThread", this, eventName, callback)  
  }  
  
  // 事件触发线程 -> 监听元素对应事件  
  
  // 事件触发线程 -> 元素触发事件  
  function trigger(callback) {  
    pushTask(callback)  
  }  
  ```  
  
#### 定时触发器线程  
  
> 定时器 setInterval 与 setTimeout 所在线程  
  
- 伪代码：  
  
  ```js  
  // JS线程 -> 开始计时  
  function setTimeout(callback, timeout) {  
    sendMessage("timerThread", callback, timeout)  
  }  
  
  // 定时器线程 -> 设定定时器开始计时  
  
  // 定时器线程 -> 计时器结束  
  function trigger(callback) {  
    pushTask(callback)  
  }  
  ```  
  
#### 异步 Http 请求线程  
  
> Ajax、fetch 请求  
  
- 伪代码：  
  
  ```js  
  // JS线程 -> 开始请求  
  XMLHttpRequest.send()  
  sendMessage("netWorkThread", options, callback)  
  
  // 网络线程 -> 开始请求  
  
  // 网络线程 -> 请求响应成功  
  function trigger(callback) {  
    pushTask(callback)  
  }  
  ```  
  
#### 异步任务是什么？从哪来的？  
  
- 异步任务就是由浏览器其他线程处理并执行的任务。  
- 由 JS 引擎调用浏览器 API 来通知其他线程开始工作，并将执行成功的回调函数传入，当工作结束后其他线程会将回调函数推入任务队列中，由 JS 引擎执行回调函数。  
  
### 示例：任务队列的运行过程  
  
- 从输入 URL 到页面渲染都发生了什么？  
  - 只详细讲任务队列相关的流程  
  
1. 在地址栏输入 URL，请求 HTML，浏览器接受到响应结果，将 HTML 文本交给渲染线程，渲染线程开始解析 HTML 文本。  
  
   ```html  
   ...  
     </div>  
     <script>  
       document.body.style.color = '#f40'  
       document.body.addEventListener('click', () => {})  
       setTimeout(() => {}, 100)  
       ajax('/api/url', () => {})  
     </script>  
   </body>  
   ```  
  
2. 渲染线程解析过程中遇到 `<script>` 标签时，会把 `<script>` 中的代码包装成一个任务，放入 JS 引擎中的任务队列中，并挂起当前线程，开始运行 JS 线程。  
  
   ```js  
   pushTask(<script>)  
   ```  
  
3. JS 线程检查到任务队列中有任务，就开始执行任务。  
   1. 将对 DOM 的写操作放入队列中  
   2. 告诉事件触发线程，监听事件  
   3. 告诉定时器线程，开始计时  
   4. 告诉网络线程，开始请求  
4. 第一个宏任务执行完成，执行写操作队列（渲染页面）  
  
   ```js  
   while (true) {  
     if (queueTask.length) {  
       const task = queueTask.shift()  
       task()  
  
       requestAnimationFrame()  
       // 执行写操作队列后进行渲染  
       render()  
       // 检查空闲时间是否还够  
       requestIdleCallback()  
     }  
   }  
   ```  
  
5. 第一个任务就完全结束了，任务队列回到空的状态，第一个任务中注册了 3 个异步任务，但是这对 JS 引擎不会关心这些，它要做的就是接着不停的循环检查任务队列。  
6. 为了简化流程，假设三个异步任务同时完成了，此时任务队列中就有了 3 个任务  
  
   ```js  
   // 任务队列  
   const queueTask = [addEventListener, setTimeout, ajax]  
   ```  
  
7. 但是不管有多少任务，都会按照上面的流程进行循环重复的执行，这整个流程被称为事件循环。  
  
## 微任务队列  
  
上面说的是 ES6 之前的事件循环，只有一个任务队列，很好理解。  
  
在 ES6 标准中，ECMA 要求 JS 引擎在事件循环中加入了一个新的队列：**微任务队列**  
  
- 为什么要加一个队列？要解决什么问题呢？  
  
### 宏任务队列的问题  
  
实际功能：Vue 为了性能优化，对响应式数据的修改并不会立即触发视图渲染，而是会放到一个队列中统一异步执行。（JS 引擎对 GUI 线程写操作的思想）  
  
那怎么实现这个功能呢？想要异步执行，就需要创建一个异步任务，setTimeout 是最合适的。  
  
```js  
// 响应式数据修改  
this.showModal = true  
  
// 记录需要重新渲染的视图  
const queue = []  
const flag = false  
// 触发setter  
function setter() {  
  // 记录需要渲染的组件  
  queue.push(this.render)  
  
  if (flag) return  
  flag = true  
  setTimeout(() => {  
    queue.forEach((render) => render())  
    flag = false  
  })  
}  
```  
  
这样实现有什么问题呢？  
  
```js  
// 任务队列  
const queueTask = [addEventListener, setTimeout, ajax]  
```  
  
用上面的例子，现在任务队列里有三个任务，在第一个任务 `addEventListener` 中进行了 Vue 响应式修改。  
  
假设 setTimeout 立即就完成了，那么现在的任务队列如下:  
  
```js  
// 任务队列  
const queueTask = [addEventListener, setTimeout, ajax, vueRender]  
```  
  
这个结果符合任务队列的运行逻辑，但却不是我们想要的。  
  
因为视图更新的代码太靠后了，要知道每次任务执行之后并不是立即执行下一个任务，而是会执行 `requestAnimationFrame`、渲染视图、检查剩余时间执行 `requestIdleCallback` 等等一系列的事情。  
  
按这个执行顺序，vueRender 的代码会在页面渲染两次之后才执行。  
  
我们想要实现的效果是这个异步代码最好是在当前任务执行完就执行，理想的任务队列是下面这样。  
  
```js  
// 任务队列  
const queueTask = [addEventListener, vueRender, setTimeout, ajax]  
```  
  
相当于要给宏任务队列加入插入队列的功能，但是如果这么改，那就整个乱套了。之前的异步任务还有个先来后到的顺序，先加入先执行，这么一改，异步任务的顺序就完全无法控制了。  
  
上面的问题总结来说  
  
1. 现在的异步任务，执行颗粒度太大，两个任务间要做的事情太多，我们想要能够创建更快更高效的异步任务。  
2. 现在的任务队列逻辑不能动。  
3. JS 引擎本身没有创建异步任务的能力。  
   - 在这个例子中，需要执行的异步任务，跟别的线程是没有任何关系的，我们只是想通过异步任务来优化性能。  
  
### 解决方案  
  
既然之前的任务队列逻辑不能动，那不如就加个新队列：**微任务队列**。  
  
JS 引擎自己创建的异步任务，就往这个微任务队列里放。通过别的线程创建的异步任务，还是按老样子放入之前的队列中（宏任务队列）。  
  
微任务队列，会在宏任务执行之后被清空执行。  
  
加入了微任务队列之后，JS 引擎的代码实现：  
  
```js  
// 宏任务队列  
const macroTask = []  
// 微任务队列  
const microTask = []  
  
while (true) {  
  if (macroTask.length) {  
    const task = macroTask.shift()  
    task()  
  
    // 宏任务执行之后，清空微任务队列  
    while (microTask.length) {  
      const micro = microTask.shift()  
      micro()  
    }  
  
    requestAnimationFrame()  
    render()  
    requestIdleCallback()  
  }  
}  
```  
  
**注意 while 循环的实现，只要微任务队列中有任务，就会一直执行直到队列为空。也就是说如果在微任务执行过程中又产生了微任务（向微任务队列中 push 了新值），这个新的微任务也会在这个 while 循环中被执行**  
  
```js  
// 微任务队列 = []  
  
Promise.resolve().then(() => {  
  console.log(1)  
  Promise.resolve().then(() => {  
    console.log(2)  
  })  
})  
// 微任务队列 = [log1函数体]  
  
// log1函数体 = 微任务队列.shift()  
// 微任务队列 = []  
  
// log1函数体()  
// 微任务队列 = [log2函数体]  
  
// log2函数体 = 微任务队列.shift()  
// 微任务队列 = []  
  
// 渲染视图  
```  
  
以上就是为什么要有微任务队列，以及微任务队列的运行逻辑。  
  
浏览器中可以产生微任务异步代码的 API：`Promise.prototype.then`、`MutationObserver`、`setImmediate(IE、nodejs)`、`MessagePort.onmessage`  
  
Vue 渲染视图的异步代码就是放在微任务队列中的。  
  
> Vue2 的 nextTick 实现为：Promise -> setImmediate -> MessagePort.onmessage -> setTimeout  
  
## Vue.nextTick  
  
> API 介绍：使用 nextTick 注册的代码会在 DOM 更新之后被调用。  
  
nextTick 的实现比我们想的要简单的多，尤其是我们已经了解了微任务的执行逻辑。  
  
```js  
// 记录需要重新渲染的视图  
const queue = []  
const flag = false  
// 触发setter  
function setter() {  
  // 记录需要渲染的组件  
  queue.push(this.render)  
  if (flag) return  
  flag = true  
  // setTimeout 换成了 Promise, 将异步任务注册进微任务队列中  
  Promise.resolve().then(() => {  
    queue.forEach((render) => render())  
    flag = false  
  })  
}  
  
// 微任务队列：[]  
  
this.showModal = true  
// 微任务队列：[vueRender]  
  
this.$nextTick(() => {})  
// 微任务队列：[vueRender, nextTickCallback]  
```  
  
Vue3 的 nextTick（支持 Proxy 的浏览器不可能不支持 Promise）  
  
```js  
const resolvedPromise = Promise.resolve()  
export function nextTick(fn) {  
  return fn ? resolvedPromise.then(fn) : p  
}  
```  
  
## 问题答案  
  
- Vue.nextTick 怎么实现的？为什么这个 API 可以保证回调函数在 DOM 更新后被调用？  
  - DOM 操作时同步的，nextTick 注册的回调函数在 vueRender 函数之后，所以此时 DOM 已经更新了。  
- 如果 setTimeout 中注册回调函数，将时间设为 0，当回调函数执行时 DOM 更新了吗？  
  - 肯定更新了，setTimeout 注册的是宏任务，宏任务执行时微任务肯定早就执行完了  
- Vue.nextTick 和 setTimeout(callback, 0)，谁先执行？  
  - Vue.nextTick，这是个微任务。  
