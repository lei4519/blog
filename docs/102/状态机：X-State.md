---
id: x-state
aliases:
  - state-machine
tags:
  - x-state
  - state-machine
  - FE
  - Explanation
created: 2024-07-30T07:30
share: true
updated: 2024-10-12T10:15
issue: "102"
---
  
虽然主题是状态机，但主要是聊对于 **长期迭代变化** 的业务，最佳实践是什么？  
  
## [X-State](https://stately.ai/docs/xstate) 是什么？  
  
Q: X-State 是什么？  
  
> X-State 是 JavaScript 和 TypeScript 应用程序的**状态管理**和编排解决方案  
  
一个状态管理框架  
  
---  
  
Q: 前端已经有那么多状态管理库，X-State 的亮点是什么？  
  
> 它使用 [事件驱动](https://stately.ai/docs/transitions) 编程、[**状态机、状态图**](https://stately.ai/docs/state-machines-and-statecharts) 和 [参与者模型](https://stately.ai/docs/actor-model) 以可预测、稳健和可视化的方式处理复杂逻辑  
  
不准确，但能简单的了解其定位：有着更多约束、规则、" 死板 " 的 Redux  
  
---  
  
前端已经有那么多状态管理库，  
  
## 为什么要用 X-State 呢？  
  
### 不可避免的复杂度  
  
> [!TIPS]    
> 下面图里内容都不用详情看，体会流程就行了  
  
产品业务流程图  
  
![Pasted image 20241010113159](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020241010113159.png)  
  
其中的一个节点：  
  
![Pasted image 20241010114519](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020241010114519.png)  
  
节点对应的产品文档需求描述：  
  
![Pasted image 20241010113755](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020241010113755.png)  
  
技术方案阶段，对上述文档进行阅读理解后，画出的节点业务流程图  
  
![Pasted image 20241010113928](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020241010113928.png)  
  
开发阶段，根据流程图写下的代码（伪）  
  
![Pasted image 20241010114119](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020241010114119.png)  
  
1. 业务流程/功能本身就很繁琐/复杂，且技术复杂度是不可能低于业务复杂度的  
2. 虽然繁琐，但还是很轻松的：文档 -> 流程图 -> 代码；因为这是一个全新的业务流程，有文档、产品告诉你所有细节  
  
![Pasted image 20241010145138](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020241010145138.png)  
  
1. 但全新的代码开发场景是非常少的，绝大多数时间都是在做维护、迭代  
  
![Pasted image 20241010160747](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020241010160747.png)  
  
一个需求，你很可能完全不了解业务流程，只有一份产品「期望」实现的需求文档  
  
至于怎么达成这个「期望」，可能会影响什么，会有哪些坑，也许产品自己都不知道...  
  
> 「不要（无脑）相信产品的需求文档」  
  
这句话我可能对每一个开发芝士需求的人都说过  
  
### 知识库的更新问题  
  
怎么在长期、频繁的业务迭代和人员变动中，维护一份 ~~精确/正确/完整~~ 大体上正确的业务描述（文档/流程图/..）呢？  
  
定个规矩？强制让产品更新知识库？  
  
> 作为一个大多数人连注释都懒得写/更新的群体......不现实的  
  
---  
  
如果没有这份文档存在，难道要让新来的产品把历史迭代过的全部文档看一遍吗？  
  
现实就是很难要求产品可以了解所有的业务细节  
  
### 源代码，往往是软件的唯一精确描述  
  
![Pasted image 20240926203553](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020240926203553.png)  
  
对于业务逻辑的了解和梳理，开发比产品更有优势  
  
产品可能只有 N 份历史文档  
  
我们却拥有一份合并后的、线上运行的最终代码  
  
对于这种类型业务的迭代，需要研发对已有代码进行梳理后才能决定最终的逻辑  
  
- 需求做起来好恶心，不停改来改去的  
- 产品文档完全没写啊  
- 提测了才发现这里有问题，又要改  
- 我以为 2 天就能做完的  
- ...  
  
研发对代码梳理的效率、结果，直接决定了需求的质量、效率  
  
### 读代码  
  
目标：梳理出当前的业务流程和业务功能，以对产品需求文档进行补充、更正  
  
#### 业务流程  
  
梳理出业务流程是怎么串起来的，需求中的改动会影响哪些上下游节点  
  
> 产品可能只考虑（知道）某个分支  
  
#### 业务功能  
  
流程中的节点，具体的业务细节，需求中是否有遗漏、冲突  
  
读代码的效率又取决于写代码  
  
### 写代码  
  
#### UI 逻辑不分离  
  
> 目前普遍在用的方式  
  
业务逻辑直接写在页面、组件中，每个流程节点的逻辑散落在各个文件中  
  
![Pasted image 20241010173507](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020241010173507.png)  
  
在上千个文件中，想找到一个功能在哪个文件里都要费上一番工夫  
  
就更不要期望，能从中找出当前需求所相关的文件，并从其中梳理出完整的业务流程  
  
##### 举例 - 流程：好物  
  
好物业务虽然在我这里，但我一次正经需求都没有做过，所以我对好物的代码、业务是一窍不通的  
  
业务现状：（几乎）没有前端需求，偶尔有后端需求，偶尔让帮忙排查问题  
  
好物有三个仓库：公用组件、PC 端、APP 端  
  
一窍不通 ➕ 三个仓库数千个文件 ➕ 试图排查问题  
  
emmm...  
  
##### 举例 - 功能：编辑器日志打点  
  
1. 页面 url -> route config -> 入口组件  
2. 从上到下读代码/断点: mount/change/unmount，业务逻辑、埋点、日志代码  
3. 找到依赖组件，重复上述步骤  
4. 文章和回答还不是一套代码...再重复上述步骤  
  
我明明只是想打个点而已，却要把所有逻辑捋一遍  
  
#### 逻辑 UI 分离 - Redux  
  
干净的 UI 逻辑分离后，UI 层只会有 `state` 的使用和 `dispatch`，所有逻辑都在 `reducer` 中  
  
![Pasted image 20240927151130](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020240927151130.png)  
  
> 截图是 saga 代码，不过意思一样了  
  
现在可以把视线聚焦到一个文件里了，只需要看这一个文件就可以了解所有业务逻辑  
  
其次这个文件是一个**线索**，只要顺着 `dispatch type` 就可以找到所有业务相关的文件位置  
  
> 如果好物能用上这种模式，我会很感谢的  
  
##### 隐式状态机  
  
仅通过上面的代码，还是不能方便的还原出完整的业务流程，因为业务流程是有条件和分支的，每个节点只能做当前节点可以做的事情  
  
而所有 reducer 都是平级的（unconditionally/无条件），无法直观的体现出条件分支关系  
  
> 这些逻辑可能在 reduce 内部的 if else 里，也可能在视图层里  
  
除了不能直观的通过 reducer 画出业务流程图  
  
这种写法还更容易产生 BUG：  
  
![Pasted image 20241010200851](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020241010200851.png)  
  
> 应该只在 `state === 'pending'` 的时候才做状态转换  
  
简化后的 demo 大家可能都觉得自己不会犯这种错误，但这就是真实的 BUG  
  
真正开发时，有些功能很重要，有些功能很复杂，工期又很紧。很难面面俱到，保证不会犯这种「低级错误」  
  
更多的可以看：[隐式状态机的风险](https://medium.com/@DavidKPiano/the-facetime-bug-and-the-dangers-of-implicit-state-machines-a5f0f61bdaa2)  
  
#### 状态机  
  
Redux 官方风格指南「强烈推荐篇」中提到：将 Reducer 视为状态机  
  
> 当使用状态机对逻辑进行建模时，Reducer 应该是分层（嵌套）的，首先考虑状态非常重要，只有上层状态符合的情况下，才会（有可能）执行当前层的代码    
> 为每个状态创建 Reducer 有助于封装每个状态的行为  
  
明确标识当前的节点（状态），reducer 内判断状态后再进行逻辑执行  
  
![Pasted image 20241010201309](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020241010201309.png)  
  
这种嵌套的 switch case 可以用对象更简单的实现（策略模式）  
  
![Pasted image 20241010201845](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020241010201845.png)  
  
到此，上面提到的痛点都基本解决  
  
1. 只看一个文件就可以了解所有的业务流程、功能  
2. 通过搜索 `dispatch type` 可以快速的定位相关文件的代码位置  
3. 通过状态机，可以梳理出完整的业务流程、分支  
4. 更健壮的代码，更少的 BUG  
  
但如果你真的用这种模式把业务流程写完，你会发现...  
  
##### 团队协作问题  
  
不是所有人都能理解、延续你的设计。精心、复杂，却毫无约束的设计，反而更容易变成更大的屎山  
  
真实的例子：这是芝士业务里的标准状态机代码，2020 年某位大佬写下，2024 年被我完全删掉改成最普通的代码逻辑  
  
![Pasted image 20240927174047](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020240927174047.png)  
  
因为 20 年 ~ 24 年无数次的需求迭代，没有人去梳理和维护这个状态机，只是不停地用各种 JS 奇技淫巧的在上面打补丁，所谓的状态机只剩一个美好的外壳而已  
  
我们需要的不是口头的「约定」，而是代码层面的「约束」  
  
比如跟后端接口约定  
  
- ❌ API 文档  
- ✅ Zod / GraphQL  
  
要么就别用，要么用了就严格执行，把所有钻空子的可能性封死  
  
##### 状态爆炸问题  
  
虽然已经具备了梳理业务流程的**可能性**  
  
**但真正的梳理过程依然没有那么简单，毕竟复杂度不会凭空消失**  
  
> 数百上千行的状态机代码你挡得住吗？  
  
状态机里有一个术语专门用来描述这种情况  
  
> 状态爆炸：当状态机中的状态数量增加时，状态之间的转换也会呈指数增长  
  
解决方案就是状态图  
  
思路很直接：既然人脑很难从繁杂的代码中还原出业务流程图，那就直接根据代码自动生成出业务流程图  
  
![Pasted image 20240927173059](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020240927173059.png)  
  
所以要想实现代码到状态图的转换，首先就要在语法上做约束/约定，比如：  
  
- 将状态放在 `states` 字段中  
  - 渲染节点  
- 将事件转换放在 `on` 字段中  
  - 渲染线  
- 状态转换必须通过 `target` 字段完成  
  - 连线  
- 等等...  
  
![Pasted image 20241011104833](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020241011104833.png)  
  
### 总结  
  
1. 唯一可信的只有代码  
2. 所以期望代码可以尽可能精确的描述业务逻辑，且能方便理解  
3. 然后发现状态机这种思路，比较符合预期  
  
相比自己造一遍轮子，社区的热门方案更完备、健壮，有充足的文档、学习资料，还有各种配套的工具等等  
  
## 状态机框架：X-State  
  
X-State 带来的是  
  
1. 符合 [W3C 标准、语义化](https://www.w3.org/TR/scxml/) 的状态机模型  
2. 完备的 TS 类型推导  
3. 配套工具：代码 <-> 状态图；图和代码的双向生成 1. [可视化编辑器](https://stately.ai/editor)    
   ![Pasted image 20240927180618](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020240927180618.png) 2. [VSCode 插件](https://marketplace.visualstudio.com/items?itemName=statelyai.stately-vscode)    
   ![Pasted image 20241011135522](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020241011135522.png)  
  
技术方案阶段不是在写文档，而是在画图。图画完，最核心、最容易出错的逻辑代码也已经写（生成）完了  
  
### 用法示例  
  
还用上面订单的例子，我们把它写全  
  
```ts  
import { assign, fromPromise, setup } from "xstate";  
  
const orderMachine = setup({  
  types: {  
    context: {} as {  
      agreementAccepted: boolean;  
    },  
    events: {} as  
      | {  
          type: "AGREE";  
        }  
      | {  
          type: "ACCEPT";  
        }  
      | {  
          type: "REFUSE";  
        }  
      | {  
          type: "EXPIRED";  
        },  
  },  
  actions: {  
    acceptAgreement: assign(({ context }) => ({  
      ...context,  
      agreementAccepted: true,  
    })),  
  },  
  actors: {  
    requestBackend: fromPromise(async () => {  
      const response = await fetch("https://api.example.com/order/accept", {  
        method: "POST",  
        headers: {  
          "Content-Type": "application/json",  
        },  
      });  
      const data = await response.json();  
      return data;  
    }),  
  },  
}).createMachine({  
  context: {  
    agreementAccepted: false,  
  },  
  id: "Order",  
  initial: "pending",  
  description: "订单状态机",  
  states: {  
    pending: {  
      on: {  
        AGREE: {  
          description: "同意协议",  
          target: ".agreement",  
          actions: { type: "acceptAgreement" },  
        },  
        REFUSE: { target: "refuse" },  
        EXPIRED: { target: "expired" },  
      },  
      states: {  
        agreement: {  
          on: {  
            ACCEPT: {  
              description: "接受订单",  
              target: "accepting",  
            },  
          },  
        },  
      },  
    },  
    accepting: {  
      invoke: {  
        src: "requestBackend",  
        onDone: { target: "accepted", actions: emit("acceptSuccess") },  
        onError: { target: "pending" },  
      },  
    },  
    accepted: {  
      // entry: ['notifyUser'],  
      // exit: ['notifyUser'],  
      type: "final",  
    },  
    refuse: {  
      type: "final",  
    },  
    expired: {  
      type: "final",  
    },  
  },  
});  
```  
  
- `types` 纯 TS 类型代码，帮助类型推断  
- `actions` 瞬时发生的动作，同步运行的逻辑，多数情况用来改变上下文状态使用  
  - 调用时机是：事件触发时、进入状态时、离开状态时  
  - 操作符（函数）：  
    - `assign`：改变 context 状态  
      - `emit`：触发事件  
      - `log`：打印日志  
- `actors`，[概念](https://stately.ai/docs/actors)  
  - 异步运行的逻辑，一般就是用来调用后端接口  
    - `fromPromise`  
    - `fromTransition`: Redux reducer  
    - `fromObservable`: 对接 RxJs  
    - `fromEventObservable`: 对接 RxJs  
  
视图中的使用  
  
```tsx  
import { useMachine } from "@xstate/react";  
  
export function Order() {  
  const [state, send, actor] = useMachine(orderMachine);  
  
  useActorOn(actor, "acceptSuccess", () => console.log("接单成功！"));  
  
  useTimeout(() => {  
    send({ type: "EXPIRED" });  
  }, 1000);  
  
  return (  
    <div>  
      <label>  
        <input  
          type="checkbox"  
          checked={state.context.agreementAccepted}  
          onChange={() => send({ type: "AGREE" })}  
        />  
        同意协议  
      </label>  
  
      {state.matches("accepting") && <div>loading...</div>}  
  
      <button  
        disabled={!state.can({ type: "ACCEPT" })}  
        onClick={() => send({ type: "ACCEPT" })}  
      >  
        接受  
      </button>  
      <button  
        disabled={!state.can({ type: "REFUSE" })}  
        onClick={() => send({ type: "REFUSE" })}  
      >  
        拒绝  
      </button>  
    </div>  
  );  
}  
```  
  
- `send` 等同 `dispatch`  
- `state.context` 访问上下文信息  
- `state.matches` 判断是否当前处于指定状态  
- `state.can` 判断当前状态下，是否可以触发相应事件  
- `useActorOn` 自行实现如下  
  
```ts  
export function useActorOn<  
  T extends Actor<AnyActorLogic>,  
  TLogic extends T["logic"],  
  TType extends EmittedFrom<TLogic>["type"] | "*",  
>(  
  actor: T,  
  type: TType,  
  handler: (  
    emitted: EmittedFrom<TLogic> &  
      (TType extends "*"  
        ? {}  
        : {  
            type: TType;  
          }),  
  ) => void,  
) {  
  const fn = useHandler(handler);  
  
  useEffect(() => {  
    const sub = actor.on(type, fn);  
  
    return () => sub.unsubscribe();  
  }, [type, actor, fn]);  
}  
```  
  
### 日志打点  
  
在这套代码下，想要实现日志打点，可以有多简单呢  
  
![Pasted image 20240927173513](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020240927173513.png)  
  
![Pasted image 20240927173412](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020240927173412.png)  
  
## 额外收益  
  
- 团队视角  
  - Code Review 精力主要聚焦状态机逻辑  
    - AI 辅助 Review  
- 逻辑复用，跨平台  
  - 单纯的 JS，任何可以运行 JS 的地方  
- 个人视角  
  - 复杂度不会因为无视就消失，强制关注创建过程，提前发现逻辑漏洞  
- AI 赋能  
  - 越强的约束，越多的规则，对 AI 越友好  
  
AI 逻辑代码生成：    
![Pasted image 20241011143122](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020241011143122.png)  
  
AI 逻辑解读：    
![Pasted image 20241011153135](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020241011153135.png)  
  
![Pasted image 20241011153157](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020241011153157.png)  
  
## 经验/踩坑  
  
### 命名  
  
区分开常规代码命名（驼峰），方便快速分辨状态、事件  
  
- 状态：`create_task`  
- 事件：`LOAD_DATA`  
  
![Pasted image 20241011154811](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020241011154811.png)    
避免 `onChange/loading/onSuccess` 这类太过通用的命名，建议在前面搭配上状态，以作命名空间  
  
- 事件响应机制，从当前节点开始向上递归查找，一旦命中后就不会再向上冒泡  
  - 如果使用 `state.can({type: 'ON_CHANGE'})` 判断逻辑，就可能会有隐藏的 BUG 产生  
  - ![Pasted image 20241011154304](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020241011154304.png)  
- 保持文本检索友好  
  
### 搜索场景  
  
搜索场景肯定是无论什么状态下都可以搜的，所以要把搜索相关事件放在根状态下，否则就会出现某些状态下搜索功能失效的问题  
  
### 接口全局错误提示  
  
```ts  
/**  
 * 统一加入错误处理逻辑  
 * */  
const inspect: ActorOptions<any>["inspect"] = {  
  next: (e) => {  
    browserInspect.next?.(e);  
    if (isDev) {  
      if (new URLSearchParams(window.location.search).get("m_log") !== null) {  
        console.log(e);  
      }  
    }  
    if (e.type === "@xstate.event") {  
      // actor promise.reject  
      if (e.event.type === "xstate.promise.reject") {  
        // 所有通过 @cheese/libs/request 的请求都会有 message  
        // 所以这里只处理有 message 的情况  
        // 自定义的 actor promise 如果没有 message，不会被处理  
        const errMessage = e.event.data.message;  
        if (errMessage) {  
          onErrorMessage({ message: errMessage });  
        }  
      }  
    }  
  },  
  error: browserInspect.error,  
  complete: browserInspect.complete,  
};  
  
// 加入通用的逻辑  
export const useMachine: typeof oUseMachine = (machine, options) => {  
  const m = oUseMachine(machine, {  
    inspect,  
    ...options,  
  });  
  
  if (isDev) {  
    (window as any).__machine__ = m;  
  }  
  
  return m;  
};  
```  
  
### 图生成时的技术噪音  
  
难免会有因为技术问题不得已加入的状态逻辑，这些技术噪音会让生成的状态图可读性下降  
  
![Pasted image 20240927180748](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020240927180748.png)  
  
一个订单从「创建 -> 审核 -> 接受 -> 执行 -> 完成」，要经历多个系统，多个角色，天、甚至月的时间才能完成  
  
你前端状态页面一刷新后就全部丢失了  
  
状态同步需要依赖后端接口的响应，所以会有很多「跳状态」的场景  
  
从一个初始状态（接口加载）跳转到任意状态（同步后端状态）  
  
自行实现图渲染逻辑，可以解决此问题  
  
## 扩展  
  
- [你不需要状态机库](https://dev.to/davidkpiano/you-don-t-need-a-library-for-state-machines-k7h)  
- [Redux 模式](https://dev.to/davidkpiano/redux-is-half-of-a-pattern-1-2-1hd7)  
- [状态模式](https://refactoringguru.cn/design-patterns/state)  
