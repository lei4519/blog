---  
tags:  
  - JavaScript  
  - TODO  
draft: "true"  
issue: 57
created: 2024-01-03
share: "true"  
title: JS Engine
description: JS Engine
permalink: "57"
---  
  
## 流程  
  
不同引擎的差异是黄色部分  
  
解释器（interpret）：将 AST 转化为字节码  
  
编译器（compiler）：将字节码转化为机器码  
  
优化编译器（optimizing compiler）：对常用的字节码进行优化，转化为更高效的机器码  
  
- 优化、翻译是有成本的，所以要考虑性价比，只会对适合的字节码进行优化  
  
![Kanban--2024-04-14_16.41.19-5.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Kanban--2024-04-14_16.41.19-5.png)  
  
## 两个方向  
  
解释器（interpret）：AST -> 字节码的翻译工作很快，但是字节码的执行速度很慢  
  
优化编译器（optimizing compiler）：字节码 -> 机器码的翻译（优化）工作很慢，但是机器码的执行速度很快  
  
![Kanban--2024-04-14_16.41.20-4.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Kanban--2024-04-14_16.41.20-4.png)  
  
JS 引擎需要就两个方向做出权衡和取舍  
  
## V8  
  
## JSC（JavaScriptCore）  
  
LLInt: AST -> 字节码  
  
Baseline：字节码 -> 机器码（未优化）  
  
DFG：字节码 -> 机器码（少量优化）  
  
FTL：字节码 -> 机器码（完全优化）  
  
![Kanban--2024-04-14_16.41.21-4.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Kanban--2024-04-14_16.41.21-4.png)  
  
![Kanban--2024-04-14_16.41.24-7.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Kanban--2024-04-14_16.41.24-7.png)  
  
![Kanban--2024-04-14_16.41.28-3.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Kanban--2024-04-14_16.41.28-3.png)  
  
![Kanban--2024-04-14_16.41.19-2.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Kanban--2024-04-14_16.41.19-2.png)  
  
优化什么？  
  
考虑一个 add 函数，对两个参数进行相加，其中会涉及到不同操作数的类型判断（字符串、数字、布尔等），以及隐式转换，所以需要进行大量的 if else 判断处理，这些判断不会随着单纯的将 AST 转换为字节码或机器码而消失  
  
也就是说即使转换成机器码，还是要做大量判断，即使 add 函数始终只会传入数字，其余的判断条件依旧会执行，  
  
![Kanban--2024-04-14_16.41.33-5.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Kanban--2024-04-14_16.41.33-5.png)  
  
![Kanban--2024-04-14_16.41.29.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Kanban--2024-04-14_16.41.29.png)  
  
![Kanban--2024-04-14_16.41.28-4.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Kanban--2024-04-14_16.41.28-4.png)  
  
怎么进入下一阶段？  
  
counting triggers 计数触发器  
  
![Kanban--2024-04-14_16.41.32.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Kanban--2024-04-14_16.41.32.png)  
  
OSR(on stack replace)  
  
在执行过程中，Truffle 将安排“热”调用目标进行编译。一旦编译了目标，以后对该目标的调用就可以执行编译后的版本。但是，调用目标的持续执行不会从此编译中受益，因为它无法将执行转移到已编译的代码。这意味着长时间运行的目标可能会“卡在”解释器中，从而损害预热性能  
  
栈上替换 (OSR) 是 Truffle 中使用的一种技术，用于“突破”解释器，将执行从解释代码转移到编译代码  
  
---  
  
堆栈替换 (OSR) 是一种在同一函数的不同实现之间进行切换的技术。例如，您可以使用 OSR 在完成编译后立即从解释或未优化的代码切换到 JIT 代码。  
  
当您将某个函数在运行时识别为“热”函数时，OSR 非常有用。这可能不一定是因为该函数被频繁调用；它可能只被调用一次，但它会在一个大循环中花费大量时间，这可以从优化中受益。当 OSR 发生时，VM 暂停，目标函数的堆栈帧被替换为可能在不同位置具有变量的等效帧。  
  
OSR 也可以发生在另一个方向：从优化代码到未优化代码或解释代码。优化的代码可能会根据过去的行为对程序的运行时行为做出一些假设。例如，如果您只见过一种类型的接收者对象，则可以将虚拟或动态方法调用转换为静态调用。如果后来发现这些假设是错误的，则可以使用 OSR 回退到更保守的实现：优化的堆栈帧转换为未优化的堆栈帧。如果虚拟机支持内联，您甚至可能最终将优化的堆栈帧转换为多个未优化的堆栈帧。  
  
将运行时仍在堆栈上运行的解释代码替换为编译代码。  
  
时间表是：  
  
解释器开始解释 main() 方法。  
  
计数器达到 10,000，编译开始，但仍在解释 main()。  
  
编译完成，仍在解释中 main()。  
  
main() 完成。  
  
因为该 main 方法永远不会重新进入，所以编译后的版本永远不会被执行。这就是堆栈替换的用武之地。该方法的特殊版本被编译，允许从循环中间继续执行。  
  
堆栈更换到位后，我们的时间表现在是：  
  
解释器开始解释 main() 方法  
  
计数器达到 10,000，编译开始，但仍在解释 main()  
  
编译完成，仍在解释中 main()  
  
计数器达到 14,000（在 HotSpot 1.0 中），并且解释停止—OSR 时间到了！  
  
main() 通过 OSR 进行第二次编译，以允许在循环中间进入  
  
main() 在编译后的代码中恢复  
  
main() 结束  
  
生成的代码将解释器帧作为要执行的输入的行为称为“堆栈替换”  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/IMG_2879.jpeg)  
  
Profiling  
  
- 收集优化的信息  
  
Speculation 推测  
  
inline cache  
  
## 参考资料  
  
<https://mathiasbynens.be/notes/shapes-ics>  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020231222132643.png)  
  
### 为什么 JSC 启动速度比 V8 快？  
  
#### JSC  
  
> JSC 没有 JIT  
  
LLInt 解释器：AST → 字节码，同时执行字节码（执行效率不高）  
  
BaseLine 编译器：字节码 → 机器码（未优化）  
  
DFG 优化编译器：字节码 → 机器码（少量优化）  
  
FTL 优化编译器：字节码 → 机器码（完全优化）  
  
**优化是一场赌博，通过收集信息（长时间运行）来增加获胜的概率**  
  
#### V8  
  
相比 JSC 拥有三个可以在不同时间/效率特征的优化编译器，V8 只有~~一个~~完整优化编译器  
  
这意味在未触发「抬升」前，要一直在效率不高的解释器上运行；而且有可能代码在触发抬升前就已经结束了  
  
![](https://mathiasbynens.be/_img/js-engines/pipeline-detail-v8.svg)  
  
#### But  
  
非优化编译器（21 年 5 月）：[https://v8.dev/blog/sparkplug](https://v8.dev/blog/sparkplug)  
  
优化编译器（23 年 12 月）：[https://v8.dev/blog/maglev](https://v8.dev/blog/maglev)  
  
## Ref  
  
- [Sea of Nodes](https://darksi.de/d.sea-of-nodes/)    
- [Digging into the TurboFan JIT · V8](https://v8.dev/blog/turbofan-jit)    
- [V8 and How It Listens to You - Michael Stanton - YouTube](https://www.youtube.com/watch?app=desktop&v=u7zRSm8jzvA&ab_channel=JavaScriptConferencesbyGitNation)    
- [Ignition · V8](https://v8.dev/docs/ignition)    
- [Maglev - V8’s Fastest Optimizing JIT · V8](https://v8.dev/blog/maglev)    
- [Sparkplug — a non-optimizing JavaScript compiler · V8](https://v8.dev/blog/sparkplug)  
