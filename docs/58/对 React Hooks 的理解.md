---
tags:
  - React
  - Explanation
  - FE
share: "true"
issue: "58"
created: 2021-10-21T20:17
updated: 2024-05-12T12:36
---
  
## 三个角度  
  
1. 工程化角度：Hooks 存在的意义  
2. 设计者角度：实现 Hooks 要解决的问题、核心 API 分类  
3. 开发者角度：基于 Hooks 对服务端状态进一步封装  
  
## 工程化角度：Hooks 存在的意义  
  
### Hooks 解决了什么问题？  
  
❌ 使函数式组件拥有状态，从而实现 Class 组件的功能  
  
```js  
function App() {  
  // this.state this.setState  
  const [state, setState] = useState()  
  
  // componentDidMount()  
  useEffect(() => {  
    // componentWillUnmount()  
    return () => {}  
  }, [])  
  
  // componentDidUpdate()  
  useEffect(() => {})  
  
  // render()  
  return <div></div>  
}  
```  
  
✅ 👇  
  
![Kanban--2024-04-14_16.41.34.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Kanban--2024-04-14_16.41.34.png)  
  
### React 没有将「逻辑」「抽离出」组件的能力  
  
#### Class：逻辑属于某个组件  
  
```js  
class XXX extends Component {  
  state = { bool: false }  
  handleTrue() {}  
  handleFalse() {}  
  
  render() {}  
}  
```  
  
#### hooks：独立逻辑，不属于任何组件  
  
```js  
function useBoolean() {  
  const [bool, setBool] = useState(false)  
  const handleTrue = () => {}  
  const handleFalse = () => {}  
}  
```  
  
##「视图」「逻辑」分离  
  
#### React  
  
- mixins、render-props、Hoc  
  
#### Vue  
  
- mixins、scope-component、Hoc  
  
#### Angular  
  
- DI  
  
#### 状态管理方案  
  
- Redux、Mobx ...  
  
### 为什么要执着于「视图」「逻辑」分离？  
  
#### 软件开发的难点  
  
如何更好的适应无休止的需求变化  
  
#### 巨人的肩膀  
  
分层架构、设计模式、领域驱动、SOLID、KISS、YAGNI、DRY、迪米特法则 ...  
  
#### 小步「重构」  
  
「**每次**」需求变化时，都将代码「**重构**」成最适合当前的  
  
##「分离」让下一个程序员更易「重构」  
  
###「分离」为主，「复用」是顺其自然的  
  
如若下次需求需要复用，分离的代码可以让下个人很容易的「重构」，反之则不行。  
  
> 好的代码不是告诉计算机怎么做，    
> 而是告诉另一个程序员你想要计算机怎么做。    
> --《趣学设计模式》  
  
![react-hooks](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/react-hooks.png)  
  
### 视图也可以是逻辑的一部分  
  
![Kanban--2024-04-14_16.41.24-4.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Kanban--2024-04-14_16.41.24-4.png)  
  
## 设计者角度：实现 Hooks 要解决的问题  
  
> 以下均为概念性的思考和理解，不等于最佳实践 & 不等于源码实现  
  
### useRef：状态保存  
  
React 的运行机制是每次更新时，函数都会重新运行，这意味着作用域重建，函数内的状态丢失  
  
所以需要将状态存在函数作用域之外，且要与组件的生命周期挂钩（申请和释放）  
  
`useRef` 就提供了这样的能力，这很重要，因为一旦有了状态，我们自己就可以做很多事情  
  
> 需要框架层提供能力  
  
```js  
const root = document.getElementById("root")  
  
function App() {  
  // let i = 0  ❌  
  const i = useRef(0)  
  return <h1>{i.current++}</h1>  
}  
  
setInterval(() => {  
  ReactDOM.render(<App />, root)  
}, 1000)  
```  
  
### useState：触发更新  
  
`useState` 的核心在于 `setter` 函数，它会触发视图更新  
  
实际上，我们完全可以使用 `useRef` + `setter` 来完成状态更新  
  
> 只是说明有了持久化状态后我们可以这样做，实际工作中不要这么做（会被打  
  
```js  
const root = document.getElementById("root")  
const { useState } = React  
  
function App() {  
  const i = useRef(0)  
  let [, reRender] = useState(0)  
  
  setInterval(() => {  
    i.current++  
    reRender()  
  }, 1000)  
  
  return <h1>{i.current}</h1>  
}  
  
ReactDOM.render(<App />, root)  
```  
  
### useCtlCall：控制函数调用  
  
如果你尝试了上面的代码，很快就会页面更新出现了问题  
  
这是因为每次 `reRender`，组件函数都会重新运行，导致 `setInterval` 被重复多次的注册  
  
所以我们需要某种方式，来控制函数的调用逻辑，同样的有了状态之后，这并不是一个困难的事情  
  
```js  
const root = document.getElementById("root")  
const { useState, useRef } = React  
  
const isEq = (value, other) => {  
  if (Object.is(value, other)) return true  
  
  if (Array.isArray(value) && Array.isArray(other)) {  
    if (value.length === 0 && other.length === 0) return true  
  
    return value.every((item, i) => Object.is(item, other[i]))  
  }  
  
  return false  
}  
  
function useCtlCall(fn, deps) {  
  const prevDeps = useRef(undefined)  
  
  if (isEq(prevDeps.current, deps)) return  
  
  fn()  
  prevDeps.current = deps  
}  
  
function App() {  
  let [i, setState] = useState(0)  
  
  useCtlCall(() => {  
    setInterval(() => {  
      setState(i++)  
    }, 1000)  
  }, [])  
  
  return <h1>{i++}</h1>  
}  
  
ReactDOM.render(<App />, root)  
```  
  
### useMemo & useCallback  
  
是的，轻松就可以实现 `useMemo` 和 `useCallback`  
  
> 不等于实际源码  
  
```js  
function useMemo(fn, deps) {  
  const cacheValue = useRef()  
  
  useCtlCall(() => {  
    cacheValue.current = fn()  
  }, deps)  
  
  return cacheValue.current  
}  
  
function useCallback(fn, deps) {  
  return useMemo(() => fn, deps)  
}  
```  
  
### useLayoutEffect & useEffect  
  
同上是用来控制函数调用时机，但是需要集成进框架中，以在适当的时机触发函数调用  
  
### useContext  
  
> 不等于实际源码  
  
```ts  
export const createContext = (defaultValue) => {  
  const context = {  
    value: defaultValue,  
    subs: new Set(),  
    Provider: ({ value, children = "" }) => {  
      useEffect(() => {  
        context.subs.forEach((fn: any) => fn(value))  
        context.value = value  
      })  
      return children  
    },  
  }  
  return context  
}  
  
export const useContext = (context, selector?) => {  
  const subs = context.subs  
  const [, forceUpdate] = useReducer((c) => c + 1, 0)  
  const selected = selector ? selector(context.value) : context.value  
  const ref = useRef(null)  
  
  useEffect(() => {  
    ref.current = selected  
  })  
  
  useEffect(() => {  
    const fn = (nextValue: unknown) => {  
      if (selector && ref.current === selector(nextValue)) return  
      forceUpdate(nextValue)  
    }  
    subs.add(fn)  
    return () => subs.delete(fn)  
  }, [subs])  
  
  return selected  
}  
```  
  
## 开发者角度：基于 Hooks 对服务端状态进一步封装  
  
### Dva 服务端状态管理  
  
> 如 redux 或其他框架也是一样的  
  
#### 重复代码  
  
观察下面的代码中有多少是重复的，可封装的  
  
```ts  
const m: IReuseTaskDetailModel = {  
  namespace: "reuseTaskDetail",  
  state: {  
    detail: {},  
    auditRecord: {},  
    list: {},  
  },  
  effects: {  
    *getTaskDetail({ payload: id }, { call, put }) {  
      const { data } = yield call(() => axios.get("xxx"), id)  
      return yield put({  
        type: "mergeModel",  
        payload: {  
          detail: data,  
        },  
      })  
    },  
    *getAuditRecord({ payload: params }, { call, put }) {  
      const { data, paging } = yield call(() => axios.get("xxx"), params)  
      return yield put({  
        type: "mergeModel",  
        payload: {  
          auditRecord: {  
            data,  
            paging,  
          },  
        },  
      })  
    },  
    *getList({ payload: params }, { call, put }) {  
      const { data, paging } = yield call(() => axios.get("xxx"), params)  
      return yield put({  
        type: "mergeModel",  
        payload: {  
          list: {  
            data,  
            paging,  
          },  
        },  
      })  
    },  
  },  
}  
```  
  
#### 封装重复  
  
事实上我们可以把所有请求全放入一个 `namespace`，使用 `api` 地址做 `state[key]` 即可  
  
```ts  
const mergeState = ({ put, key, data, isLoading, isError }) =>  
  put({  
    type: "mergeModel",  
    payload: {  
      [key]: {  
        data,  
        isLoading,  
        isError,  
      },  
    },  
  })  
  
interface State {  
  // 接⼝地址  
  [key: string]: {  
    data: any  
    isLoading: boolean  
    isError: boolean  
  }  
}  
  
const serverModel = {  
  namespace: "serverModel",  
  state: {},  
  effects: {  
    *fetch({ payload: { key, fn } }, { call, put }) {  
      try {  
        yield mergeState({  
          put,  
          key,  
          data: undefined,  
          isLoading: true,  
          isError: false,  
        })  
        const data = yield call(fn)  
        yield mergeState({ put, key, data, isLoading: false, isError: false })  
        return data  
      } catch (e) {  
        yield mergeState({  
          put,  
          key,  
          data: undefined,  
          isLoading: false,  
          isError: true,  
        })  
        return Promise.reject(e)  
      }  
    },  
  },  
}  
```  
  
#### 使用  
  
```ts  
function useTaskList() {  
  const key = "/api/tasklist"  
  const dispatch = useDispatch()  
  
  useEffect(() => {  
    dispatch({  
      type: "serverModel/fetch",  
      payload: {  
        key,  
        fn: fetchTaskList,  
      },  
    })  
  }, [])  
  
  return useSelector(({ serveState }) => serveState[key])  
}  
  
function TaskList() {  
  const { data, isLoading } = useTaskList()  
  return <div>{data}</div>  
}  
```  
  
#### 接着封装  
  
细看会发现取值逻辑也是重复的，依然可以简化  
  
```ts  
function useQuery(key, fn) {  
  const dispatch = useDispatch()  
  
  useEffect(() => {  
    dispatch({  
      type: "serverModel/fetch",  
      payload: {  
        key,  
        fn,  
      },  
    })  
  }, [])  
  
  return useSelector(({ serveState }) => serveState[key])  
}  
  
function useTaskList() {  
  return useQuery("/api/tasklist", fetchTaskList)  
}  
```  
  
#### Mutation  
  
查询逻辑是挂载时自动请求的，写入逻辑则需要手动触发，所以可以再简单封装下  
  
```ts  
function useMutation(key, fn) {  
  const dispatch = useDispatch()  
  return {  
    ...useSelector(({ serveState }) => serveState[key]),  
    mutate() {  
      dispatch({  
        type: "serverModel/fetch",  
        payload: {  
          key,  
          fn,  
        },  
      })  
    },  
  }  
}  
  
function useDelTask() {  
  return useMutation("/api/del/tasklist", fetchTaskList)  
}  
```  
  
#### 封装后的状态管理代码  
  
> 是不是干净整洁无异味，  
  
```ts  
const useTaskList = () => useQuery("/api/xxx", fetchXXX)  
const useTaskDetail = () => useQuery("/api/xxx", fetchXXX)  
const useAuditTask = () => useQuery("/api/xxx", fetchXXX)  
const useAuditInfo = () => useQuery("/api/xxx", fetchXXX)  
  
const useDelTask = () => useMutation("/api/xxx", fetchXXX)  
const usePostTask = () => useMutation("/api/xxx", fetchXXX)  
```  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/dva-react-query.png)  
  
### 最后  
  
上述代码只是想说明 hooks 的封装、简化能力，真实的场景中还会有更多的挑战：  
  
- 问题  
  - 如何重新请求 & 手动控制请求（e.g. 搜索）  
  - 相同接⼝相同参数的重复请求处理？  
  - 相同接⼝不同参数的请求处理？  
- 优化  
  - 依赖查询  
  - 更⽅便的取消请求  
  - 缓存  
  - 窗⼝聚焦重新获取  
  - 数据预取  
  - 分⻚  
  - 轮询  
  - loading 闪烁  
  
实际上工作中我们可以直接使用 `react-query` 来帮助我们管理服务端状态  
  
而对于服务端状态管理的话题，[终端的异步状态管理](../59/%E7%BB%88%E7%AB%AF%E7%9A%84%E5%BC%82%E6%AD%A5%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86.md) 中有更深入的探讨，感兴趣可以继续阅读  
