---  
tags:  
  - JavaScript  
issue: 57
created: 2024-01-03
share: "true"  
title: JS Engine 的差异和优化
description: JS Engine 的差异和优化
permalink: "57"
---  
  
## 整体流程  
  
JavaScript 引擎解析 `source code` 并将其转换为 AST（抽象语法树）  
  
基于该 AST，解释器可以开始执行并生成 bytecode（字节码）  
  
为了使其运行得更快，字节码与分析数据一起发送到优化编译器  
  
优化编译器根据其拥有的分析数据做出某些假设，然后生成高度优化的机器代码  
  
如果在某个时刻，其中一个假设被证明是不正确的，优化编译器就会取消优化并返回到解释器  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240515131029.png)  
  
## 不同引擎的差异  
  
主要是黄色部分  
  
![Kanban--2024-04-14_16.41.19-5.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Kanban--2024-04-14_16.41.19-5.png)  
  
早期的 V8 只有一个解释器 Ignition 和一个 优化编译器 TurboFan（21 年加入了 Sparkplug 编译器）  
  
而 SpiderMonkey（在 Firefox 和 SpiderNode 中使用的 Mozilla JavaScript 引擎）拥有两个优化编译器  
  
解释器优化为基线编译器，生成某种程度优化的代码。结合运行代码时收集的分析数据，IonMonkey 编译器可以生成高度优化的代码。如果推测性优化失败，IonMonkey 将回退到基线代码  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240515134859.png)  
  
JSC（JavaScriptCore）是苹果公司在 Safari 和 React Native 中使用的 JavaScript 引擎，通过三种不同的优化编译器将其发挥到了极致  
- LLInt（低级解释器）可优化为 Baseline 编译器  
- 然后该编译器可优化为 DFG（数据流图）编译器  
- DFG 编译器又可优化为 FTL（超光速）编译器  
  
![Kanban--2024-04-14_16.41.28-3.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Kanban--2024-04-14_16.41.28-3.png)  
  
虽然差异存在，但是整体上都是相同的架构：**有一个解析器和某种解释器/编译器管道**  
  
为什么引擎之间会有这些差异呢？核心都是 trade-off  
  
### 优化层和执行  
  
在快速运行（启动）代码（解释器）或花费更多时间但最终以最佳性能运行代码（优化编译器）之间存在权衡  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240516132154.png)  
  
- interpret（解释器）生成字节码的速度很快，但字节码的执行速度相对较慢  
- compiler（编译器）生成代码需要更长的时间，但它提供了更好的运行时性能  
- optimizing compiler（优化编译器）需要最长的时间来生成机器代码，但该代码可以非常高效地运行  
  
启动延迟和执行速度之间的权衡是 JavaScript 引擎选择在两者之间添加优化层的原因  
  
### 内存使用  
  
还有一个原因就是内存使用  
  
这里有一个简单的 JavaScript 程序，它将两个数字相加  
  
```javascript  
function add(x, y) {    
  return x + y;    
}    
add(1, 2);  
```  
  
这是我们使用 V8 中的 Ignition 解释器为 `add` 函数生成的字节码：  
  
```  
StackCheck    
Ldar a1    
Add a0, [0]    
Return  
```  
  
不用关注确切的字节码——你只需要知道这只是四个指令  
  
当代码变热（hot）时，TurboFan 会生成以下高度优化的机器代码：  
  
```  
leaq rcx,[rip+0x0]    
movq rcx,[rcx-0x37]    
testb [rcx+0xf],0x1    
jnz CompileLazyDeoptimizedCode    
push rbp    
movq rbp,rsp    
push rsi    
push rdi    
cmpq rsp,[r13+0xe88]    
jna StackOverflow    
movq rax,[rbp+0x18]    
test al,0x1    
jnz Deoptimize    
movq rbx,[rbp+0x10]    
testb rbx,0x1    
jnz Deoptimize    
movq rdx,rbx    
shrq rdx, 32    
movq rcx,rax    
shrq rcx, 32    
addl rdx,rcx    
jo Deoptimize    
shlq rdx, 32    
movq rax,rdx    
movq rsp,rbp    
pop rbp    
ret 0x18  
```  
  
与四个字节码指令相比，机器码无疑会有更多的内存占用  
  
但字节码需要解释器才能运行，而优化后的代码可以直接由处理器执行  
  
这也是引擎选择优化时所要考虑的主要原因，生成优化的机器代码需要很长时间，还需要更多的内存  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240516150549.png)  
  
基于上述问题，不同引擎间选择添加多个具有不同时间/效率特征的优化编译器，允许对进行更细粒度的控制，但代价是增加了复杂性和开销  
  
## 统一的优化方向  
  
虽然引擎在架构上都有所不同，但有些优化手段是共有的  
  
### Object Model  
  
JavaScript 引擎如何实现 JavaScript 对象模型，以及它们使用哪些技巧来加速访问 JavaScript 对象的属性  
  
ECMAScript 规范本质上将所有对象定义为字典，其中字符串键映射到属性属性，纵观 JavaScript 程序，访问属性是最常见的操作  
  
对于 JavaScript 引擎来说，**快速访问属性**至关重要  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240515135829.png)  
  
#### Shapes  
  
```javascript  
const object1 = { x: 1, y: 2 };  
const object2 = { x: 3, y: 4 };  
// `object1` and `object2` have the same shape.  
```  
  
在 JavaScript 程序中，多个对象具有相同的属性键是很常见的，我们称这些物体具有相同的形状（shapes）  
  
```javascript  
function logX(object) {  
  console.log(object.x)  
}  
  
const object1 = { x: 1, y: 2 };  
const object2 = { x: 3, y: 4 };  
  
logX(object1);  
logX(object2);  
```  
  
访问具有相同形状的对象的相同属性也很常见  
  
考虑到这一点，JavaScript 引擎会根据对象的形状优化对象属性访问  
  
##### How To  
  
考虑下面这个结构，当访问 `object.y` 时，会在 `Object` 上查找 `y`，并返回其中存储的 `[[Value]]` 属性  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240515135829.png)  
  
但如果现在有 N 个形状相同的 `Object` 呢？在每一个 `Object` 上都存储完整、重复的属性表显然是不必要和浪费的  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240515144920.png)  
  
所以我们可以单独存储对象的 `Shape`，并将所有形状相同的对象与这个 Shape 进行关联，这样每个 `JSObject` 只需存储该对象唯一的值  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240515173617.png)  
  
`Shape` 包含所有属性名称和属性，除了 `[[Value]]`，它包含了 `JSObject` 内部值的偏移量，以便找到 `[[Value]]`  
  
所有 JavaScript 引擎都使用 `Shape` 作为优化，但不一定都称其为 `Shape`：  
  
- 学术论文称为 _Hidden Classes_  
- V8 称为 _Maps_  
- Chakra 称为 _Types_  
- JavaScriptCore 称为 _Structures_    
- SpiderMonkey 称为 _Shapes_    
  
#### Transition Chains and Trees  
  
如果向一个具有特定形状的对象添加了属性，会发生什么情况，JavaScript 引擎如何对新属性进行查找呢？  
  
```javascript  
const object = {};  
object.x = 5;  
object.y = 6;  
```  
  
上面的代码中每一行都会创建一个独立的 `Shape`，这就形成了 _transition chains_ （转换链）  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240515190049.png)  
  
每个 `Shape` 只需要知道它引入的新属性，并通过链表进行链接，当进行属性查找时会从底部向上查找（这是一个问题，见下）  
  
> **Warning**  
>  
> 所以添加属性的顺序会影响形状。例如 `{ x: 4, y: 5 }` 会产生与 `{ y: 5, x: 4 }` 不同的形状  
  
如果无法创建转换链，我们必须进行分支，最终会得到一个 _transition tree_ （转换树）  
  
例如，对两个空对象分别添加不同的属性  
  
```javascript  
const object1 = {};  
object1.x = 5;  
  
const object2 = {};  
object2.y = 6;  
```  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240515190948.png)  
  
##### 问题  
  
```javascript  
const point = {};  
point.x = 4;  
point.y = 5;  
point.z = 6;  
```  
  
上述代码会产生如下 transition chain  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240515191254.png)  
  
可以想到，如果我们访问 `x`（顶部的值），就需要从底部向上查找。找到属性的时间是 `O(n)` ，即与对象的属性数量成线性关系  
  
为了加快属性搜索速度，JavaScript 引擎添加了 `ShapeTable` 数据结构。这个 `ShapeTable` 是一个字典，将属性键映射到引入给定属性的相应 `Shape`  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240515191449.png)  
  
等等，我们似乎回到了原点 [Object Model](JS%20Engine%20%E7%9A%84%E5%B7%AE%E5%BC%82%E5%92%8C%E4%BC%98%E5%8C%96.md#Object%20Model)，这不就是添加 `Shape` 之前的内存结构吗？  
  
所以为什么还要引入 `Shape` 呢？  
  
### Inline Caches  
  
原因是 `Shape` 可以实现一种称为  _Inline Caches_ （内联高速缓存）的优化，这是 JavaScript 快速运行的关键因素  
  
引擎使用 IC 来缓存查找对象属性的信息，以减少昂贵的查找次数  
  
考虑 `getX` 函数，它会被编译成字节码（绿色部分），其中两个红色的 `N/A` 就是缓存信息所使用的 `slots` （槽）    
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240516110228.png)  
  
每次函数运行时，都会记录传入对象的 `Shape` 和 `offset`  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240516110158.png)  
  
当函数再次运行时，会比较当前传入的 `Shape` 和之前的 `Shape`，如果它们是一致的，就可以直接使用缓存的 `offset` 读取值，省去查找的过程  
  
> **NOTE**  
>  
> 所以固定的 `Shape` 是会提高运行效率的，尽量在对象初始化的时候就将所有字段添加完整，避免后续的动态添加和删除（可以置为 null or undefined）  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240516110302.png)  
  
#### 数组  
  
一个原始的数组，会有一个具有 `length` 属性的 `Shape`，并有一个单独的 _Elements_ 用来存储其中的值  
  
> 数组天然就是使用 offset 访问的，所以不需要额外记录 offset  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240516111639.png)  
  
注意到我们并没有为 `Elements` 中的每一个值单独记录其属性 `[[Writable]]/[[Enumerable]]/[[Configurable]]`，而是将其与整个 `Elements` 做了关联，这是因为数组索引属性默认情况下可写、可枚举和可配置的事实  
  
但如果我们故意给某个索引的值修改了默认配置，会怎么样呢？  
  
引擎会将整个 `Elements` 替换为以索引为键的字典结构，分别记录每一个索引的属性  
  
即使只有一个数组元素具有非默认属性，整个 `Elements` 就会进入这种缓慢低效的模式  
  
> **IMPORTANT**  
>  
> 所以不要！不要！不要去修改数据索引的默认属性  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240516112508.png)  
  
### Optimizing Prototypes  
  
上面讲了使用 `Shape` 和 `IC` 优化对象属性加载，下面来看原型属性访问是如何进行优化的  
  
#### Class  
  
我们都知道 ES6 中的 `Class` 只是 ES5 构造函数 & 原型链的语法糖而已，所以我们直接来看脱糖后的示例：  
  
```javascript  
function Bar(x) {    
  this.x = x;    
}   
    
Bar.prototype.getX = function getX() {    
  return this.x;    
}  
```  
  
当我们创建实例时，结构图如下  
  
```javascript  
const foo = new Bar(true);  
```  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240516135157.png)  
  
`foo` 本身具有 `Shape-x`，`Bar.prototype` 具有 `Shape-getX`，当我们创建另一个实例时，其会共享已存在的 `Shape`  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240516135415.png)  
  
#### Prototype Property Access  
  
JS 中属性的访问规则是先从自身查找，如果没有则顺着原型链向上逐级查找  
  
> 原型 `Class.prototype` 也只是一个普通的对象，只是上述的查找规则赋予其共享的能力  
  
当我们访问原型属性时  
  
```javascript  
const $getX = foo.getX  
```  
  
引擎会从 `foo` 开始查找，并意识到 `foo` 的 `Shape` 上没有 `'getX'` 属性  
  
因此它沿着原型链向上走，最终在 `Bar.prototype` 的 `Shape` 中发现了 `'getX'` 属性  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240516140602.png)  
  
##### `setPrototypeOf`  
  
JavaScript 提供了 `setPrototypeOf` 用以改变原型链  
  
```javascript  
const foo = new Bar(true);    
foo.getX();    
// → true    
    
Object.setPrototypeOf(foo, null);    
foo.getX();    
// → Uncaught TypeError: foo.getX is not a function  
```  
  
这也导致了，虽然 `prototype` 只是 JavaScript 中的普通对象，但与常规对象的自身属性访问相比， 加速原型属性访问需要考虑更多的事情  
  
为了在可能修改原型链的情况下进行访问缓存，必须需要知道以下三件事：  
  
1. `foo` 的 `Shape` 不包含 `getX`，并且没有被修改过：这意味着没有人通过添加、删除、更改属性来变更对象 `foo`   
2. `foo` 的原型仍然是最初的 `Bar.prototype` 。这意味着没有人通过使用 `Object.setPrototypeOf()` 或分配给特殊的 `__proto__` 属性来更改 `foo` 的原型  
3. `Bar.prototype` 的 `Shape` 包含 `getX` ，并且没有被修改过：这意味着没有人通过添加、删除、更改属性来变更 `Bar.prototype`   
  
这意味着我们必须对实例本身执行 1 次检查，再加上对每个原型执行 2 次检查（原型是否还是最初的，以及是否还包含属性）  
  
这意味着 `1+2N` 的检查次数（其中 `N` 是涉及的原型数量）  
  
为了优化这种情况，引擎使用一个简单技巧：不是将原型链接存储在实例上，而是将其存储在 `Shape` 上，这意味着将（实例上的）原型检查合并到（`Shape` 上的）属性检查来减少检查数量  
  
每个 `Shape` 都链接至其原型，这也意味着每次 `foo` 的原型发生变化时，引擎都会将 `foo` 的 `Shape` 转变为新的  
  
对于查找链中的每个（原型）对象，我们只需要进行 `Shape` 检查就可以了，而无需关心其原型是否被修改过  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240516150511.png)  
  
通过这种方法，我们可以将所需的检查次数从 `1+2N` 减少到 `1+N` ，以便更快地访问原型的属性  
  
但这仍然相当昂贵，因为它仍然与原型链的长度呈线性关系  
  
所以引擎继续实现其他的技巧，以进一步将其减少到常数级检查，特别是对于相同属性的访问  
  
#### Validity Cells  
  
V8 为此专门处理原型的 `Shape` ，每个原型都有一个独特的 `Shape`，不与任何其他对象共享（尤其是不与其他原型共享）  
  
并且每个原型形状都有一个与其关联的 `ValidityCell`（有效单元格），每当更改关联的原型或**其之上的任何**原型时， `ValidityCell` 就会失效    
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240516153717.png)  
  
让我们看一下它到底是如何工作的  
  
为了加速原型属性的访问，V8 给会给查找对象的 `Shape` 放置了一个内联缓存，其中包含四个字段：  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240516153727.png)  
  
当第一次查找 `foo.getX` 时，V8 会记住找到 `getX` 时：  
1. 所处的原型对象（`Bar.prototype`）  
2. 在原型对象中的 `offset`  
3. 实例的形状（ `foo` 的 `Shape`）  
4. 第 1 条原型对象所关联的 `ValidityCell`  
  
下次查找时，引擎会通过内联缓存检查 `ValidityCell`，如果它仍然有效，就可以直接访问 `Prototype` 上的 `Offset` ，跳过额外的查找  
  
##### ValidityCell Invalidate  
  
当原型改变时，会为其分配一个新的 `Shape`，并将之前的 `ValidityCell` 失效。  
  
因此下次查找时，内联缓存会失效，并重新从底部开始向上查找，导致性能变差  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240516154829.png)  
  
> **IMPORTANT**  
>  
> 需要注意的是，当我们更改原型时，会将其之下所有原型的 `ValidityCell` 失效需要注意的是，当我们更改原型时，会将其之下所有原型的 `ValidityCell` 失效  
  
以 DOM 元素示例，`Object.prototype` 的任何更改，不仅会使 `Object.prototype` 本身的内联缓存失效，还会使以下任何原型失效，包括 `EventTarget.prototype` 、 `Node.prototype` 、 `Element.prototype` 等等  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20240516154846.png)  
  
> **IMPORTANT**  
>  
> 在运行代码时修改 `Object.prototype` 意味着性能会被抛到九霄云外，不要这样做！  
  
---  
  
让我们通过一个具体的例子来进一步探讨这一点  
  
假设我们有 `Class Bar` ，并且有一个函数 `loadX` ，它调用 `Bar` 对象上的方法  
  
```javascript  
class Bar { /* … */ }    
  
function loadX(bar) {    
  return bar.getX(); // IC for 'getX' on `Bar` instances.    
}    
```  
  
我们使用同一类的实例多次调用此 `loadX` 函数  
  
```javascript  
loadX(new Bar(true));  
loadX(new Bar(false));  
// IC in `loadX` now links the `ValidityCell` for `Bar.prototype`.    
```  
  
`loadX` 中的内联缓存现在指向 `Bar.prototype` 的 `ValidityCell`   
  
如果现在我们执行诸如改变 `Object.prototype` （JavaScript 中所有原型的根）之类的操作，则所有原型的 `ValidityCell` 都将变得无效，并且现有的内联缓存在下次命中时会丢失，导致性能更差  
  
```javascript  
Object.prototype.newMethod = y => y;    
// The `ValidityCell` in the `loadX` IC is invalid    
// now, because `Object.prototype` changed.  
```  
  
改变 `Object.prototype` 总是一个坏主意，因为它会使引擎在此之前的任何原型内联缓存失效  
  
---  
  
这是应该避免的另一个例子：  
  
```javascript  
Object.prototype.foo = function() { /* … */ };    
    
// Run critical code:    
someObject.foo();    
// End of critical code.    
    
delete Object.prototype.foo;  
```  
  
- 我们扩展 `Object.prototype` ，这将使引擎在此之前放置的任何原型内联缓存失效  
- 然后我们运行一些使用新原型方法的代码，引擎必须从头开始为任何原型属性访问设置新的内联缓存  
- 最后，我们 _自行清理_ 并删除之前添加的原型方法，这再次导致刚刚设置的内联缓存全部失效，又要重头开始！  
  
#### Summary  
  
虽然原型只是对象，但它们被 JavaScript 引擎特殊对待，以优化原型上方法查找的性能。  
  
尽量不要修改原型，如果必须要这么做，请在所有代码开始之前，这样至少不会在代码运行时使引擎中的所有优化失效  
  
## 参考资料  
  
- [JavaScript engine fundamentals: Shapes and Inline Caches · Mathias Bynens](https://mathiasbynens.be/notes/shapes-ics)  
