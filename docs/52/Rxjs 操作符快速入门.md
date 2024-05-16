---  
tags:  
  - JavaScript  
  - Reference  
share: "true"  
issue: "52"  
created: 2021-03-01T20:12  
---  
  
## 前言  
  
好的程序员懂得如何从重复的工作中逃脱：  
  
    - 操作DOM时，发现了Jquery。  
  
    - 操作JS时，发现了lodash。  
  
    - 操作事件时，发现了Rx。  
  
Rxjs 本身的 [概念](https://cn.rx.js.org/manual/overview.html) 并不复杂，简单点说就是对观察者模式的封装，观察者模式在前端领域大行其道，不管是使用框架还是原生 JS，你一定都体验过。  
  
在我看来，Rxjs 的强大和难点主要体现对其近 120 个操作符的灵活运用。  
  
可惜官网中对这些操作符的介绍晦涩难懂，这就导致了很多人明明理解 Rxjs 的概念，却苦于不懂的使用操作符而黯然离场。  
  
本文总结自《深入浅出 Rxjs》一书，**旨在于用最简洁、通俗易懂的方式来说明 Rxjs 常用操作符的作用。学习的同时，也可以做为平时快速查阅的索引列表**。  
  
## 阅读提醒  
  
- 流的概念  
  
<img src="https://cn.rx.js.org/manual/asset/marble-diagram-anatomy.svg"/>  
  
- 订阅：调用 `subscribe`  
- 吐出：调用 `next`  
- 完成：调用 `complete`  
  
> 需要注意流的完成和订阅时间，某些操作符必须等待流完成之后才会触发。  
>  
> 其实根据操作符的功能我们也可以大致推断出结果：如果一个操作符需要拿到所有数据做操作、判断，那一定是需要等到流完成之后才能进行。  
  
## 创建流操作符  
  
创建流操作符最为流的起点，不存在复杂难懂的地方，这里只做简单的归类，具体使用查阅官网即可，不再赘述。  
  
### 同步流  
  
- create：new Observable  
- of  
- range  
- repeat  
- empty  
- never  
- throw  
- generate  
  
### 异步流  
  
- interval/timer  
- form：string/number/数组/类数组/promise/generator  
- formPromise  
- formEvent  
- formEventPattern  
- ajax  
- repeatWhen  
- defer：订阅时再创建  
  
## 合并类操作符  
  
订阅多条流，将接收到的数据向下吐出。  
  
### Concat  
  
首尾连接  
  
- 依次订阅：前一个流完成，再订阅之后的流。  
- 当流全部完成时 concat 流结束。  
  
  <img src="https://cn.rx.js.org/img/concat.png" height=200 />  
  
```js  
concat(source1$, source2$)  
```  
  
### Merge  
  
先到先得  
  
- 订阅所有流，任意流吐出数据后，merge 流就会吐出数据。  
- 对异步数据才有意义。  
- 当流全部完成时 merge 流结束。  
  
  <img src="https://cn.rx.js.org/img/merge.png" height=200 />  
  
```js  
merge(source1$, source2$)  
```  
  
### Zip  
  
一对一合并（像拉链一样）  
  
- 订阅所有流，等待所有的流都触发了 `i` 次，将第 `i` 次的数据合并成数组向下传递。  
- 其中一个流完成之后，等待另一个流的同等数量数据到来后完成 zip 流。  
- 当我们使用 zip 时，期望第一次接受到的数据是所有的流第一次发出的数据，第二次接受的是所有的流第二次发出的数据。  
  
```js  
zip(source1$, source2$)  
```  
  
### combineLatest  
  
合并所有流的最后一个数据  
  
- 订阅所有流，任意流触发时，获取其他所有流的最后值合并发出。  
- 因为要获取其他流的最后值，所以在刚开始时，必须等待所有流都吐出了值才能开始向下传递数据。  
- 所有的流都完成后，combineLatest 流才会完成。  
  
  <img src="https://cn.rx.js.org/img/combineLatest.png" height=200 />  
  
```js  
combineLatest(source1$, source2$)  
```  
  
### withLatestFrom  
  
合并所有流的最后一个数据，功能同 combineLatest，区别在于：  
  
- combineLatest：当所有流准备完毕后（都有了最后值），任意流触发数据都会导致向下吐出数据。  
- withLatestFrom：当所有流准备完毕后（都有了最后值），只有调用 withLatestFrom 的流吐出数据才会向下吐出数据，其他流触发时仅记录最后值。  
  
  <img src="https://cn.rx.js.org/img/withLatestFrom.png" height=200 />  
  
```js  
source1$.pipe(withLatesFrom(source2$, source3$))  
```  
  
### Race  
  
胜者通吃  
  
- 订阅所有的流，当第一个流触发后，退订其他流。  
  
```js  
race(source1$, source2$)  
```  
  
### startWith  
  
在流的前面填充数据  
  
<img src="https://cn.rx.js.org/img/startWith.png" height=200 />  
  
```js  
source1$.pipe(startWith(1))  
```  
  
### forkJoin  
  
合并所有流的最后一个数据  
  
- 订阅所有流，等待所有流全部完成后，取出所有流的最后值向下发送。  
  
```js  
forkJoin(source1$, source2$)  
```  
  
## 辅助类操作符  
  
### Count  
  
当前流完成之后，统计流一共发出了多少个数据。  
  
<img src="https://cn.rx.js.org/img/count.png" height="200"/>  
  
```js  
source$.pipe(count())  
```  
  
### mix/max  
  
当前流完成之后，计算 最小值/最大值。  
  
<img src="https://cn.rx.js.org/img/max.png" height="200"/>  
  
```js  
source$.pipe(max())  
```  
  
### Reduce  
  
同数组用法，当前流完成之后，将接受的所有数据依次传入计算。  
  
<img src="https://cn.rx.js.org/img/reduce.png" height="200"/>  
  
```js  
source$.pipe(reduce(() => {}, 0))  
```  
  
## 布尔类操作符  
  
### Every  
  
同数组，需要注意的是：如果条件都为 true，也要等到流完成才会吐出结果。  
  
原因也很简单，如果流没有完成，那怎么保证后面的数据条件也为 true 呢。  
  
<img src="https://cn.rx.js.org/img/every.png" height="200"/>  
  
```js  
source$.pipe(every(() => true / false))  
```  
  
### find、findIndex  
  
同数组，注意点同 every  
  
<img src="https://cn.rx.js.org/img/find.png" height="200"/>  
  
```js  
source$.pipe(find(() => true / false))  
```  
  
### isEmpty  
  
判断流是不是一个数据都没有吐出就完成了。  
  
<img src="https://cn.rx.js.org/img/isEmpty.png" height="200"/>  
  
```js  
source$.pipe(isEmpty())  
```  
  
### defaultIfEmpty  
  
如果流满足 isEmpty，吐出默认值。  
  
<img src="https://cn.rx.js.org/img/defaultIfEmpty.png" height="200"/>  
  
```js  
source$.pipe(defaultIfEmpty(1))  
```  
  
## 过滤类操作符  
  
### Filter  
  
同数组  
  
<img src="https://cn.rx.js.org/img/filter.png" height="200"/>  
  
```js  
source$.pipe(filter(() => true / false))  
```  
  
### First  
  
取第一个满足条件的数据，如果不传入条件，就取第一个  
  
<img src="https://cn.rx.js.org/img/first.png" height="200"/>  
  
```js  
source$.pipe(first(() => true / false))  
```  
  
### Last  
  
取第一个满足条件的数据，如果不传入条件，就取最后一个，流完成才会触发。  
  
<img src="https://cn.rx.js.org/img/last.png" height="200"/>  
  
```js  
source$.pipe(last(() => true / false))  
```  
  
### Take  
  
拿够前 `N` 个就完成  
  
<img src="https://cn.rx.js.org/img/take.png" height="200"/>  
  
```js  
source$.pipe(take(N))  
```  
  
### takeLast  
  
拿够后 `N` 个就结束，因为是后几个所以只有流完成了才会将数据一次发出。  
  
<img src="https://cn.rx.js.org/img/takeLast.png" height="200"/>  
  
```js  
source$.pipe(takeLast(N))  
```  
  
### takeWhile  
  
给我传判断函数，什么时候结束你来定  
  
<img src="https://cn.rx.js.org/img/takeWhile.png" height="200"/>  
  
```js  
source$.pipe(takeWhile(() => true / false))  
```  
  
### takeUntil  
  
给我一个流 (A)，什么时候这个流 (A) 吐出数据了，我就完成  
  
<img src="https://cn.rx.js.org/img/takeUntil.png" height="200"/>  
  
```js  
source$.pipe(takeUntil(timer(1000)))  
```  
  
### Skip  
  
跳过前 `N` 个数据  
  
<img src="https://cn.rx.js.org/img/skip.png" height="200"/>  
  
```js  
source$.pipe(skip(N))  
```  
  
### skipWhile  
  
给我传函数，跳过前几个你来定  
  
<img src="https://cn.rx.js.org/img/skipWhile.png" height="200"/>  
  
```js  
source$.pipe(skipWhile(() => true / false))  
```  
  
### skipUntil  
  
给我一个流 (A)，什么时候这个流 (A) 吐出数据了，我就不跳了  
  
<img src="https://cn.rx.js.org/img/skipUntil.png" height="200"/>  
  
```js  
source$.pipe(skipUntil(timer(1000)))  
```  
  
## 转化类操作符  
  
### Map  
  
- 接受上游传入的值，返回一个其他的值给下游。（如果你还返回上游的值，那就没有任何意义了）  
  
<img src="https://cn.rx.js.org/img/map.png" height="200"/>  
  
```js  
source$.pipe(map(() => {}))  
```  
  
### mapTo  
  
- 将传入的值给下游。  
  
<img src="https://cn.rx.js.org/img/mapTo.png" height="200"/>  
  
```js  
source$.pipe(mapTo("a"))  
```  
  
### Pluck  
  
- 提取上游吐出对象的某个 key，传给下游。  
  
<img src="https://cn.rx.js.org/img/pluck.png" height="200"/>  
  
```js  
source$.pipe(pluck("v"))  
```  
  
## 有损回压控制  
  
> 对防抖、节流不了解的请自行查阅相关说明。  
  
### Throttle  
  
传入一个流 (A)，对上游数据进行节流，直到流 (A) 吐出数据时结束节流向下传递数据，然后重复此过程  
  
<img src="https://cn.rx.js.org/img/throttle.png" height="200"/>  
  
```js  
source$.pipe(throttle(interval(1000)))  
```  
  
### throttleTime  
  
根据时间 (ms) 节流  
  
<img src="https://cn.rx.js.org/img/throttleTime.png" height="200"/>  
  
```js  
source$.pipe(throttleTime(1000))  
```  
  
### Debounce  
  
传入一个流 (A)，对上游数据进行防抖，直到流 (A) 吐出数据时结束防抖向下传递数据，然后重复此过程  
  
<img src="https://cn.rx.js.org/img/debounce.png" height="200"/>  
  
```js  
source$.pipe(debounce(interval(1000)))  
```  
  
### debounceTime  
  
根据时间 (ms) 防抖  
  
<img src="https://cn.rx.js.org/img/debounceTime.png" height="200"/>  
  
```js  
source$.pipe(debounceTime(1000))  
```  
  
### Audit  
  
audit 同 throttle，区别在于：  
  
- throttle：将节流期间接受的第一个数据发出  
- audit：将节流期间接受的最后一个数据发出  
  
<img src="https://cn.rx.js.org/img/audit.png" height="200"/>  
  
```js  
source$.pipe(audit(interval(1000)))  
```  
  
### auditTime  
  
同上，不再赘述  
  
<img src="https://cn.rx.js.org/img/auditTime.png" height="200"/>  
  
```js  
source$.pipe(auditTime(1000))  
```  
  
### Sample  
  
- 正常的流，上游触发，下游就会收到数据。  
- 使用了 sample 之后的流，会将上游发出的最新一个数据缓存，然后按照自己的节奏从缓存中取。  
- 换句话说，不管上游发出数据的速度是快是慢。sample 都不管，他就按照自己的节奏从缓存中取数，如果缓存中有就向下游吐出。如果没有就不做动作。  
  
传入一个流 (A)，对上游数据吐出的最新数据进行缓存，直到流 (A) 吐出数据时从缓存中取出数据向下传递，然后重复此过程  
  
<img src="https://cn.rx.js.org/img/sample.png" height="200"/>  
  
```js  
source$.pipe(sample(interval(1000)))  
```  
  
### sampleTime  
  
根据时间 (ms) 取数  
  
<img src="https://cn.rx.js.org/img/sampleTime.png" height="200"/>  
  
```js  
source$.pipe(sampleTime(1000))  
```  
  
### Distinct  
  
- distinct 前缀表示去重操作  
  
所有元素去重，返回当前流中从来没有出现过的数据。  
  
传入函数时，根据函数的返回值分配唯一 key。  
  
```js  
source$.pipe(distinct())  
Observable.of({ age: 4, name: "Foo" }).pipe(distinct((p) => p.name))  
```  
  
### distinctUntilChanged  
  
相邻元素去重，只返回与上一个数据不同的数据。  
  
传入函数时，根据函数的返回值分配唯一 key。  
  
<img src="https://cn.rx.js.org/img/distinctUntilChanged.png" height="200"/>  
  
```js  
source$.pipe(distinctUntilChanged())  
```  
  
### distinctUntilKeyChanged  
  
- distinctUntilChanged 的简化版，帮你实现了取对象 key 的逻辑。  
  
<img src="https://cn.rx.js.org/img/distinctUntilKeyChanged.png" height="200"/>  
  
```js  
source$.pipe(distinctUntilKeyChanged("id"))  
```  
  
### ignoreElements  
  
忽略上游的所有数据，当上游完成时，ignoreElements 也会完成。（我不关心你做了什么，只要告诉我完没完成就行）  
  
<img src="https://cn.rx.js.org/img/ignoreElements.png" height="200"/>  
  
```js  
source$.pipe(ignoreElements())  
```  
  
### elementAt  
  
只获取上游数据发出的第 N 个数据。  
  
第二个参数相当于默认值：当上游没发出第 N 个数据就结束时，发出这个参数给下游。  
  
<img src="https://cn.rx.js.org/img/elementAt.png" height="200"/>  
  
```js  
source$.pipe(elementAt(4, null))  
```  
  
### Single  
  
- 检查上游的所有数据，如果满足条件的数据只有一个，就向下发送这个数据。否则向下传递异常。  
  
<img src="https://cn.rx.js.org/img/single.png" height="200"/>  
  
```js  
source$.pipe(single(() => true / false))  
```  
  
## 无损回压控制  
  
- buffer 前缀：将值缓存到数组中，吐出给下游。  
- window 前缀：将值缓存到一个流中，吐出给下游。  
  
### bufferTime、windowTime  
  
缓存上游吐出的数据，到指定时间后吐出，然后重复。  
  
<img src="https://cn.rx.js.org/img/bufferTime.png" height="200"/>  
  
```js  
source$.pipe(bufferTime(1000))  
```  
  
### bufferCount、windowCount  
  
缓存上游吐出的数据，到指定个数后吐出，然后重复。  
  
第二个参数用来控制每隔几个数据开启一次缓存区，不传时可能更符合我们的认知。  
  
<img src="https://cn.rx.js.org/img/bufferCount.png" height="200"/>  
  
```js  
source$.pipe(bufferCount(10))  
```  
  
### bufferWhen、windowWhen  
  
传入一个返回流 (A) 的工厂函数  
  
流程如下：  
  
1. 触发订阅时，调用工厂函数拿到流 (A)，开始缓存  
2. 等待流 (A) 发出数据时，将缓存的值向下吐出  
3. 重新调用工厂函数，拿到一个新的流 (A)，开启缓存，循环往复。  
  
<img src="https://cn.rx.js.org/img/bufferWhen.png" height="200"/>  
  
```js  
randomSeconds = () => timer((Math.random() * 10000) | 0)  
source$.pipe(bufferWhen(randomSeconds))  
```  
  
### bufferToggle、windowToggle  
  
第一个参数为开启缓存流 (O)，第二个参数为返回关闭缓存流 (C) 的工厂函数  
  
流程如下：  
  
1. 当开启流 (O) 吐出数据时，调用工厂函数获取关闭流 (C)，开始缓存  
2. 等待关闭流 (C) 吐出数据后，将缓存的值向下吐出  
3. 等待开启流 (O) 吐出数据，然后重复步骤 1  
  
<img src="https://cn.rx.js.org/img/bufferToggle.png" height="200"/>  
  
```js  
source$.pipe(bufferToggle(interval(1000), () => randomSeconds))  
```  
  
### buffer、window  
  
传入一个关闭流 (C)，区别与 bufferWhen：传入的是流，而不是返回流的工厂函数。  
  
触发订阅时，开始缓存，当关闭流 (C) 吐出数据时，将缓存的值向下传递并重新开始缓存。  
  
<img src="https://cn.rx.js.org/img/buffer.png" height="200"/>  
  
```js  
source$.pipe(buffer(interval(1000)))  
```  
  
## 累计数据  
  
### Scan  
  
scan 和 reduce 的区别在于：  
  
- reduce：只有当流完成后才会触发  
- scan：每一次流接受到数据后都会触发  
  
区别于其他流，scan 拥有了保存、记忆状态的能力。  
  
<img src="https://cn.rx.js.org/img/scan.png" height="200"/>  
  
```js  
source$.pipe(scan(() => {}, 0))  
```  
  
### mergeScan  
  
同 scan，但是返回的不是数据而是一个流。  
  
- 当上游吐出数据时，调用规约函数得到并订阅流 (A)，将流 (A) 返回的数据向下游传递，并缓存流 (A) 返回的最后一个数据。当上游再次吐出数据时，将缓存的最后一个数据传给规约函数，循环往复。  
  
```js  
source$.pipe(mergeScan(() => interval(1000)))  
```  
  
## 错误处理  
  
### Catch  
  
捕获错误  
  
<img src="https://cn.rx.js.org/img/catch.png" height="200"/>  
  
```js  
source$.pipe(catch(err => of('I', 'II', 'III', 'IV', 'V')))  
```  
  
### Retry  
  
传入数字 `N`，遇到错误时，重新订阅上游，重试 `N` 次结束。  
  
```js  
source$.pipe(retry(3))  
```  
  
### retryWhen  
  
传入流 (A)，遇到错误时，订阅流 (A)，流 (A) 每吐出一次数据，就重试一次。流完成，retrywfhen 也完成。  
  
```js  
source$.pipe(retryWhen((err) => interval(1000)))  
```  
  
### Finally  
  
```js  
source$.pipe(finally())  
```  
  
## 多播操作符  
  
### Multicast  
  
接收返回 `Subject` 的工厂函数，返回一个 `hot observable`（HO）  
  
当链接开始时，订阅上游获取数据，调用工厂函数拿到 `Subject`，上游吐出的数据通过 `Subject` 进行多播。  
  
- 返回的 HO 拥有 `connect`、`refCount` 方法。  
- 调用 `connect` 才会真正开始订阅顶流并发出数据。  
- 调用 `refCount` 则会根据 `subscribe` 数量自动进行 `connect` 和 `unsubscribe` 操作。  
- 多播操作符的老大，较为底层的设计，日常使用不多。  
- 后面的多播操作符都是基于此操作符实现。  
  
<img src="https://cn.rx.js.org/img/multicast.png" height="200"/>  
  
```js  
source$.pipe(multicast(() => new Subject()))  
```  
  
### Publish  
  
- 封装了 multicast 操作符需要传入 Subject 工厂函数的操作，其他保持一致。  
  
<img src="https://cn.rx.js.org/img/publish.png" height="200"/>  
  
```js  
source$.pipe(publish())  
```  
  
### Share  
  
基于 publish 的封装，返回调用 refCount 后的结果（看代码）  
  
<img src="https://cn.rx.js.org/img/share.png" height="200"/>  
  
```js  
source$.pipe(share())  
// 等同于  
source$.pipe(publish().refCount())  
```  
  
### publishLast  
  
当上游完成后，多播上游的最后一个数据并完成当前流。  
  
<img src="https://cn.rx.js.org/img/publishLast.png" height="200"/>  
  
```js  
source$.pipe(publishLast())  
```  
  
### publishReplay  
  
传入缓存数量 `N`，缓存上游最新的 `N` 个数据，当有新的订阅时，将缓存吐出。  
  
- 上游只会被订阅一次。  
  
<img src="https://cn.rx.js.org/img/publishReplay.png" height="200"/>  
  
```js  
source$.pipe(publishReplay(1))  
```  
  
### publishBehavior  
  
缓存上游吐出的最新数据，当有新的订阅时，将最新值吐出。如果被订阅时上游从未吐出过数据，就吐出传入的默认值。  
  
<img src="https://cn.rx.js.org/img/publishBehavior.png" height="200"/>  
  
```js  
source$.pipe(publishBehavior(0))  
```  
  
## 高阶合并类操作符  
  
- **高阶**操作符不是高级操作符  
- 当一个流吐出的不是数据，而是一个流时，这就是一个高阶流，就像如果一个函数的返回值还是一个函数的话，我们就称之为高阶函数  
- 高阶操作符就是操作高阶流的操作符  
  
如下代码示例，顶层的流吐出的并不是普通的数据，而是两个会产生数据的流，那么此时下游在接受时，就需要对上游吐出的流进行订阅获取数据，如下：  
  
```  
of(of(1, 2, 3), of(4, 5, 6))  
	.subscribe(  
		ob => ob.subscribe((num) => {  
			console.log(num)  
		})  
	)  
```  
  
上面的代码只是简单的将数据从流中取出，如果我想对吐出的流运用前面讲的操作符应该怎么办？  
  
```  
cache = []  
of(of(1, 2, 3), of(4, 5, 6))  
	.subscribe({  
		next: ob => cache.push(ob),  
		complete: {  
			concat(...cache).subscribe(console.log)  
			zip(...cache).subscribe(console.log)  
		}  
	})  
```  
  
先不管上述实现是否合理，我们已经可以对上游吐出的流运用操作符了，但是这样实现未免也太过麻烦，所以 Rxjs 为我们封装了相关的操作符来帮我们实现上述的功能。  
  
总结一下：**高阶操作符操作的是流，普通操作符操作的是数据。**  
  
### concatAll  
  
对应 concat，缓存高阶流吐出的每一个流，依次订阅，当所有流全部完成，concatAll 随之完成。  
  
<img src="https://cn.rx.js.org/img/concatAll.png" height="200"/>  
  
```js  
source$.pipe(concatAll())  
```  
  
### mergeAll  
  
对应 merge，订阅高阶流吐出的每一个流，任意流吐出数据，mergeAll 随之吐出数据。  
  
<img src="https://cn.rx.js.org/img/mergeAll.png" height="200"/>  
  
```js  
source$.pipe(mergeAll())  
```  
  
### zipAll  
  
对应 zip，订阅高阶流吐出的每一个流，合并这些流吐出的相同索引的数据向下传递。  
  
<img src="https://cn.rx.js.org/img/zipAll.png" height="200"/>  
  
```js  
source$.pipe(zipAll())  
```  
  
### combineAll  
  
对应 combineLatest，订阅高阶流吐出的每一个流，合并所有流的最后值向下传递。  
  
<img src="https://cn.rx.js.org/img/combineAll.png" height="200"/>  
  
```js  
source$.pipe(combineAll())  
```  
  
## 高阶切换类操作符  
  
### Switch  
  
切换流 - 喜新厌旧  
  
高阶流每吐出一个流时，就会退订上一个吐出的流，订阅最新吐出的流。  
  
<img src="https://cn.rx.js.org/img/switch.png" height="200"/>  
  
```js  
source$.pipe(switch())  
```  
  
### Exhaust  
  
切换流 - 长相厮守  
  
当高阶流吐出一个流时，订阅它。在这个流没有完成之前，忽略这期间高阶流吐出的所有的流。当这个流完成之后，等待订阅高阶流吐出的下一个流订阅，重复。  
  
<img src="https://cn.rx.js.org/img/exhaust.png" height="200"/>  
  
```js  
source$.pipe(exhaust())  
```  
  
## 高阶 Map 操作符  
  
看完例子，即知定义。  
  
### 例子  
  
实现如下功能：  
  
- `mousedown` 事件触发后，监听 `mousemove` 事件  
  
#### 普通实现  
  
```js  
mousedown$ = formEvent(document, "mousedown")  
mousemove$ = formEvent(document, "mousemove")  
  
mousedown$.pipe(  
  map(() => mousemove$),  
  mergeAll()  
)  
```  
  
1. 当 `mousedown` 事件触发后，使用 `map` 操作符，将向下吐出的数据转换成 `mousemove` 事件流。  
2. 由于返回的是流而非数据，所以需要使用 `mergeAll` 操作符帮我们将流中的数据展开。  
3. 这样我们最终接受到的就是 `mousemove` 的 `event` 事件对象了。  
  
注：由于只有一个事件流，所以使用上面介绍的任意高阶合并操作符都是一样的效果。  
  
#### 高阶 Map 实现  
  
```js  
mousedown$.pipe(mergeMap(() => mousemove$))  
```  
  
不难看出，所谓高阶 map，就是  
  
```  
concatMap 	= map + concatAll  
mergeMap 		= map + mergeAll  
switchMap 	= map + switch  
exhaustMap 	= map + exhaust  
concatMapTo = mapTo + concatAll  
mergeMapTo 	= mapTo + mergeAll  
switchMapTo = mapTo + switch  
```  
  
### Expand  
  
类似于 `mergeMap`，但是，所有传递给下游的数据，同时也会传递给自己，所以 expand 是一个递归操作符。  
  
<img src="https://cn.rx.js.org/img/expand.png" height="200"/>  
  
```js  
source$.pipe(expand((x) => (x === 8 ? EMPTY : x * 2)))  
```  
  
## 数据分组  
  
### groupBy  
  
输出流，将上游传递进来的数据，根据 key 值分类，为每一个分类创建一个流传递给下游。  
  
key 值由第一个函数参数来控制。  
  
<img src="https://cn.rx.js.org/img/groupBy.png" height="200"/>  
  
```js  
source$.pipe(groupBy((i) => i % 2))  
```  
  
### Partition  
  
groupBy 的简化版，传入判断条件，满足条件的放入第一个流中，不满足的放入第二个流中。  
  
简单说：  
  
- groupBy 根据 key 的分类，可能会向下传递 N 条流。  
- partition 只会向下传递两条流：满足条件的和不满足条件的。  
  
<img src="https://cn.rx.js.org/img/partition.png" height="200"/>  
  
```js  
source$.pipe(partition())  
```  
  
## 结语  
  
以上就是本文的全部内容了，希望你看了会有收获。  
  
如果有不理解的部分，可以在评论区提出，大家一起成长进步。  
  
祝大家早日拿下 Rxjs 这块难啃的骨头。  
  
## 参考资料  
  
- [官方文档](https://cn.rx.js.org/manual/overview.html)  
- 《深入浅出 Rxjs》  
