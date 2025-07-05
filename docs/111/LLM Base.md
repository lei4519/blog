---
id: llm-base
aliases:
  - LLM 基础
tags:
  - LLM
  - AI
  - Explanation
created: 2025-02-21T17:46
updated: 2025-07-05T12:54
share: "true"
issue: "111"
---
  
从大模型的训练开始串一下相关概念，token、context、sft、agent...  
  
## TL;DR  
  
LLM 本质就是一个 Token 生成器，根据**概率**来产出下一个 Token  
  
## Pre Training  
  
### Dataset  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20250303130429.png)  
  
第一步，准备训练数据集，基本都是爬取互联网上的公开数据  
  
数据集示例：[Fine Web](https://huggingface.co/datasets/HuggingFaceFW/fineweb)，50TB（~ 15 万亿 token）  
  
- 数据源：    
	-  2013 ~ 2024 年间由 CommonCrawl Foundation 爬取的网页  
- 数据清洗：    
	- 提取主体内容（过滤菜单栏、），过滤 HTML 标记、CSS 等    
    - 过滤：语言、恶意网站、个人信息等    
    - 去重  
  
这一步的结果是得到一个所有内容拼接在一起的巨大文档  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20250303130707.png)  
  
### Tokenization  
  
对文档进行数字化，以供后续的训练  
  
提到这个，第一反应当然是 Unicode 编码  
  
#### [UTF-8](https://zh.wikipedia.org/wiki/UTF-8)  
  
可变长度字符编码，用**一至四个字节**对 Unicode 字符集中的所有有效编码点进行编码（一个字节无法表示的就用多个字节表示）  
  
```js  
const encoder = new TextEncoder(); // utf-8  
const str = "Me我";  
const encodedString = encoder.encode(str);  
console.log(JSON.stringify([...encodedString]));  
//    M   e    我  
// [ 77, 101,  230,136,145]  
```  
  
- 「我」字在 UTF-8 中占 3 个字节  
  
---  
  
UTF-8 编码后的文档 👇  
  
![UTF-8 encode](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20250303132759.png)  
  
每一个空格分割的数字的范围是 `0~255`  
  
- `1 byte == 8 bit == 00110011 == 0~255`  
  
如果使用这种方式，模型要预测下一个 Token，就是从 `0~255` 中选一个概率高的  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20250304132656.png)  
  
##### UTF-8 的问题  
  
直接使用 UTF-8 的问题是，Token 粒度/范围（`0~255`）太小了，这会导致如下问题  
  
1. 训练成本大：训练的过程中，每一个 token 都要参与运算，以这样的粒度划分，会导致训练集的 token 总量太多（「我」变成了 3 个 token），意味着训练成本变大  
2. 计算成本大：模型要输出（计算）多次才能组成对人类有意义的词语  
	- 比如输入 `hello, ` ，模型要依次计算输出 5 次：`w、o、r、l、d` 才能组成有意义的话；如果是中文这种多字节表示，会需要更多次  
3. 不利于注意力机制  
  
所以我们期望把 token 的范围（`0~255`）增大，让每个 token 包含更多的信息（`字母 -> 词/词组`）  
  
可以使用 BPE 算法来实现这个目的  
  
#### [Byte pair encoding](https://zh.wikipedia.org/wiki/%E5%AD%97%E8%8A%82%E5%AF%B9%E7%BC%96%E7%A0%81)  
  
**字节对编码** 是一种简单的数据压缩形式，这种方法用数据中不存的一个字节表示最常出现的连续字节数据  
  
- 将出现概率高的连续字节，合并为一个新字节表示  
  
##### 示例  
  
假设我们要压缩如下数据：`aaabdaaabac`  
  
- Token 词表：`[a, b, c, d]`  
- 数据长度：11  
  
```  
aaabdaaabac  
  
Z <- aa  
ZabdZabac  
  
Y <- Za  
YbdYbac  
  
X <- Yb  
XdXac  
```  
  
压缩后：  
  
- Token 词表：`[a, b, c, d, X, Y, Z]`  
- 数据长度：5  
  
---  
  
使用 BPE 重复压缩概率高的连续字节，直到符合要求，最终的范围是根据训练集大小和 Token 语义进行权衡的（实验出的结果）  
  
- GPT-3 Token: 50257  
- GPT-4 Token: 100277  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20250303140652.png)  
  
#### 总结  
  
- 输入的文本全部被 Token 化  
- Token 的定义是根据训练集中的词频统计出来的  
- 已经失去了与原始的文本直接对应关系，只能将其看成一个 ID  
- 不同模型的 Token 不一样  
  
##### 天然不擅长的事  
  
> [Tiktokenizer](https://tiktokenizer.vercel.app/)  
  
Token 的原理决定了某些事情是 LLM 天然不擅长的  
  
- `Count the number of points .....................................................`  
- strawberry 中有多少个 r ?  
  - `302,1618,19772` 中有多少 `428`?  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20250303142715.png)  
  
---  
  
模型：简单 & 困难  
  
人类：简单 & 困难  
  
- 困难的问题是易解的，简单的问题是难解的 ——— [莫拉维克悖论](https://zh.wikipedia.org/wiki/%E8%8E%AB%E6%8B%89%E7%B6%AD%E5%85%8B%E6%82%96%E8%AB%96)  
  
### Embedding  
  
对于现实世界，一个词/词组会有很多种语义，如何表示一个词（Token）的不同语义呢？  
  
🌰  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20250305135235.png)  
  
![300](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20250305135459.png)  
  
将 Token 被映射到高维向量空间中  
  
```js  
[  
  [1.1, 0.2, 1.8, ...], // Token 0  
  [5.2, 2.7, 3.1, ...], // Token 1  
  [3.1, 0.2, 1.4, ...], // ...  
  [8.1, 2.2, 1.9, ...], // Token N  
]  
```  
  
把 Token ID 看成二维数组的索引 `Array<Array<number>>`  
  
数组中每一个 `number` 相当于一个维度的空间坐标，用于表示 Token 的各种语义信息  
  
| ![300](../attachments/Pasted%20image%2020250315192851.png) | ![300](../attachments/Pasted%20image%2020250315192928.png) |  
| ----------------------------------------------------- | ----------------------------------------------------- |  
  
通过训练，Embedding 会将相似意义的词映射到相近的向量位置  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20250304182041.png)  
  
向量可以进行计算，父亲和母亲的距离，大致等于男人和女人  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/20250309165829035.png)  
  
将日本和德国的距离，放到寿司上搜索，可以找到德国小香肠  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/20250309171212087.png)  
  
这样就可以回答：日本的寿司，相当于德国的什么？  
  
#### Embedding 参数量  
  
这个二维数组，外层数组的长度对应了 Token 词表的大小（GPT-3: 50257）  
  
内层数组的长度则对应了一个 Token 可以记录多少种不同的语义，数字越大，能够记录的信息也就越多  
  
对于 GPT-3 来说，这个值是 12288  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/20250309171724163.png)  
  
LLM 中经常提到的参数量，就是指这些向量的数量（二维数组的大小）  
  
完整的 LLM 是由不同区域的参数组成的，就 Embedding 区域而言，GPT-3 一共有 6 亿的参数  
  
对于 GPT-3 的参数总量（1750 亿）而言，这是一个很小的数量  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20250307174430.png)  
  
### Transformer  
  
LLM 的核心（大脑），跳过细节以理解概念为主  
  
> LLM 可视化  
> - [Transformer Explainer: LLM Transformer Model Visually Explained](https://poloclub.github.io/transformer-explainer/)  
> - [LLM Visualization](https://bbycroft.net/llm)  
  
![Pasted image 20250315195649](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020250315195649.png)  
  
- 多头自注意力：捕捉上下文信息，使每个 Token 获得更丰富、更具体的语义  
- 多层感知器/前馈层：对自注意力输出进行非线性变换和特征提取，提高预测 Next Token 的准确率  
  
---  
  
Embedding 记录的是词本身的语义，一个词的语义是会被上下文所影响的  
- 🌰 评论区：结尾的一个狗头，会把整段话的含义反转掉  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/20250309172440388.png)  
  
King 这个 Token 的坐标会根据上下文 Token 的计算，在空间中移动到一个更具体的位置上（麦克白）  
  
- 上下文：苏格兰，杀害前任，莎士比亚语言  
	- 国王 ≈ 麦克白  
- 上下文：哈利·波特，讨厌的  
	- 教授 ≈ 斯内普  
  
---  
  
上下文中所有的 Token 信息通过向量计算，最终会传递到最后一个 Token 上  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/20250309170157524.png)  
  
将这组向量数据会与所有的 Token 进行运算，就可以得出下一个 Token 的概率分布  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/20250309174609648.png)  
  
#### Temperature  
  
从概率分布中采样来生成下一个 Token 时， `temperature` 参数可以对结果产生影响  
  
从数学上讲，这是一个非常简单的操作：将模型输出对数除以 `temperature` 即可  
  
- `temperature = 1` ：除以 1 对输出没有影响  
- `temperature < 1` ：较低​​的温度，通过锐化概率分布使模型更加可信和确定，从而产生更可预测的输出  
- `temperature > 1` ：较高的温度，会产生较柔和的概率分布，从而使生成的文本具有更多的随机性 —— 有些人称之为模型「创造力」  
---  
  
> [Transformer Explainer: LLM Transformer Model Visually Explained](https://poloclub.github.io/transformer-explainer/)  
  
拖动滑块，观察概率分布的变化    
![Pasted image 20250316140310|500](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020250316140310.png)  
  
---  
  
[Deepseek API 文档](https://api-docs.deepseek.com/zh-cn/quick_start/parameter_settings)  
  
`temperature` 参数默认为 1.0。我们建议您根据如下表格，按使用场景设置 `temperature`  
  
| 场景         | 温度  |  
| ---------- | --- |  
| 代码生成/数学解题  | 0.0 |  
| 数据抽取/分析    | 1.0 |  
| 通用对话/翻译    | 1.3 |  
| 创意类写作/诗歌创作 | 1.5 |  
  
#### LLM 参数量  
  
以 GPT-3 为例，175B 参数  
  
Embedding 上面说过了，Unembedding 是相反的操作，将向量转换回 Token  
  
中间的区域就是 Transform 的参数了  
- Key/Query/Value/Output：自注意力机制  
- Up-projection/Down-projection：多层感知器  
	- `49152 = 12288 * 4`  
  
![image.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images20250307174256.png)  
  
### Training  
  
这么多参数，在初始化阶段都是随机生成的  
  
训练过程：  
  
![Pasted image 20250310191033](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020250310191033.png)  
  
1. 从训练集中提取一段 Token 输入 LLM，让 LLM 预测输出下一个 Token  
2. 对比输出 Token 与正确答案的差异，通过损失函数得到损失值  
3. 反向传播通过损失值修改参数  
  
![Pasted image 20250316212055|500](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020250316212055.png)  
  
训练的过程就像是 DJ 在根据音色反馈旋转调音板上的旋钮  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/20250309175650287.png)  
  
### Base Model  
  
当我们把整个训练集全部训练完成，就得到了基础模型  
- Fineweb ~ 15 万亿 Token / 50 TB  
  
#### 有损压缩  
  
我们可以把预训练的过程，看成是一个**有损压缩**算法，假设训练完成的模型大小是 1TB  
- 满血版（671b-fp16）的 deepseek 大小是 1.3TB  
  
那这个算法就是把 50TB 的训练数据压缩到了 1TB 的模型中  
  
#### 成语接龙  
  
Base Model 只懂得根据输入预测下一个 Token，**是不会对话的**  
  
所以解压缩的方法就是输入一段前缀 Token（提示词），让模型进行续写  
  
比如把 wiki 词条的开头输入模型，模型就可以向后续写  
- **有损**压缩：在某个时刻，输出一定会偏离原文    
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/20250309185042657.png)  
  
翻译：给出多个示例后，放入真正想要翻译的英文  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/20250309185218201.png)  
  
某些场景我们不需要模型的对话能力，就可以直接基于 Base Model 做微调  
- Copilot  
- Cursor-Tab  
- [Zed now predicts your next edit with Zeta, our new open model — Zed's Blog](https://zed.dev/blog/edit-prediction)  
  
## Post Training  
  
Base Model 只会续写，如果你直接向它提出问题，它可能会续写出更多问题  
- 字体偏灰色的是 LLM 输出的内容    
![Pasted image 20250316223641](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020250316223641.png)  
  
但我们可以通过示例的方式，让模型模仿问答的行为  
- 先给出几个问答示例，最后提出真正的问题    
![Pasted image 20250316223556](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020250316223556.png)  
  
注意：此时的模型**并不懂的如何停下**，它在回答完问题之后，继续模仿人类进行提问了  
  
我们期望强化这个行为，让 LLM 变为一个问答助手，可以回答我们的问题，而非只是续写  
  
这就是后训练阶段，本质上它与预训练没有区别，只是换了一个训练集而已  
  
### SFT  
  
Supervised Fine-Tuning - 监督微调  
  
![Pasted image 20250310190740](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020250310190740.png)  
  
这个阶段训练数据集的来源是人工构建，有专门的公司来提供服务，他们可能会请专业领域的人员来构造相关的问答  
  
- 如果你对 AI 的某个回答惊为天人，也许并不是 AI 产生了什么「智能」，只是背后有个领域大佬写出了这样的答案  
- 现在也有使用 AI 来构建的对话集 [UltraChat](https://github.com/thunlp/UltraChat)  
  
对话数据示例：[OpenAssistant/oasst1 · Datasets at Hugging Face](https://huggingface.co/datasets/OpenAssistant/oasst1)  
- 161443 条问答示例  
  
#### Special Token  
  
真正训练时，还需要构建一些新的 Token，让模型能够区分出这是一次对话，而非续写或者其他行为  
- `<|im_start|>`/`<|im_seq|>`/`<|im_end|>`  
  
![Pasted image 20250310191156](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020250310191156.png)  
  
同时 `<|im_end|>` Token 也可以让模型意识到对话结束  
  
---  
  
当你想训练一种新的行为时，总是要构建一些新的 Token，来让模型进行区分  
  
比如在 FIM (Fill In the Middle) 补全中，用户可以提供前缀和后缀（可选），模型来补全中间的内容  
  
- `<|fim_suffix|>`/`<|fim_prefix|>`/`<|fim_middle|>`  
  
FIM 常用于内容续写、代码补全等场景  
  
#### 模拟人类  
  
LLM 回答问题，只是对人类标注者的模拟  
  
🌰  
  
![Pasted image 20250317131934](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020250317131934.png)  
  
LLM 并没有真正的去记忆中搜寻所有关于北京景点的信息，然后排序给出建议等等  
  
也许这里的答案直接来自某个人工标注者  
  
也可能人工标注者回答过类似的问题：推荐 5 个云南的旅游景点？这就像是提供了一个模版，LLM 根据预训练中的知识对相关的信息进行了替换  
  
---  
  
这也能说明，为什么有时候 LLM 会一本正经的胡说八道  
  
因为人工标注者在写下答案的时候，是自信的、确定的，LLM 模拟了这种风格，可参数中的记忆又不足以 LLM 真正的回答这些问题  
  
#### I Don't Know  
  
训练集：AI 不知道的数据  
- 事实性的错误  
- 多个问题重复提问，概率统计  
  
通过这些数据让 AI 将某些参数运算规律与「我不知道」关联在一起  
  
#### Who Are You  
  
user：你是谁？    
deepseek：我是 GPT-4  
  
模型不知道自己是谁，这类问题都是硬编码进去的（微调/系统提示词）  
- [allenai/olmo-2-hard-coded · Datasets at Hugging Face](https://huggingface.co/datasets/allenai/olmo-2-hard-coded)  
  
### RL  
  
RL/RLHF    
强化学习/基于人类反馈的强化学习  
  
发展适合 AI 的回答/思考风格  
  
![Pasted image 20250310193325](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020250310193325.png)  
  
> 如果让 LLM 在一两个 token 中得出结论，那这有限的计算资源肯定不如让 LLM 在产生几百给 token 之后的计算资源，更多的计算资源产生正确答案的概率肯定更大  
  
先推理/规划，再给出结论    
  
> 预训练相当于读课本上的知识，SFT 相当于看课本上的例题解答过程，RL 相当于做课后那种只有最后答案但要自己写演算过程的题  
  
## Context Window  
  
上面已经讲过，大模型需要对上下文中的 Token 进行计算，才能更好的预测下一个 Token  
  
这里的上下文具体是指：  
1. 我们输入的信息（Token）  
2. 大模型根据输入 Token，已经预测出的 Token，这些 Token 也会参与后续的运算  
  
![Pasted image 20250317224906](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020250317224906.png)  
  
同时我们也看到了，每个 Token 都需要经过非常多的参数运算  
  
所以不管从训练的角度、还是计算的角度，都不允许上下文中的 Token 无限的增加（要有个上限）  
  
这个上限是模型训练之前就定下来的，也就是上下文长度：计算 Token 关系的最大长度  
- 综上，模型的回复/推理的 Token 也算在这个长度里  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/20250304224055413.png)  
  
![Pasted image 20250321114847](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020250321114847.png)  
  
一旦上下文中的 Token 数量超过阈值，早先的 Token 就会被丢弃掉（遗忘），滑动的上下文窗口  
- 当上下文长度接近上限时，模型会变傻  
	- 可能是因为，存在很多问题无关的上下文影响了 Next Token 的计算？  
  
### 工作记忆 & 模糊记忆  
  
考虑如下场景 🌰  
  
User：请帮我总结傲慢与偏见的第一章  
  
> 假设 LLM 不会直接回复互联网上见过的总结  
  
LLM 需要  
1. 从海量的参数中，逐个 Token 的 预测/生成/回忆 第一章的内容  
	- 每预测出一个 Token，都会放入上下文窗口中，让其参与后续的运算  
2. 根据回忆的内容进行总结  
  
根据上文我们知道这个回忆的过程，是一个充满概率的事情，它的准确度完全取决于在训练数据  
  
**模糊记忆**  
- 存储在 LLM 海量参数中的记忆/知识，对训练数据的有损压缩，对事物的模糊记忆（概率）  
  
**工作记忆**  
- 已经存在于上下文窗口中的 Token，会对后续的预测产生影响  
	1. 我们输入的  
	2. 模型在回复的过程中，已经生成的 Token  
  
对 LLM 而言，也可以称为**事实记忆**，这些记忆无论对错都会对后续的预测产生影响。这意味着如果回忆的过程中某个 Token 出现了偏差，可能会导致整个结果越错越远  
  
> LLM 只会运算，没有人类的真、假、对、错的概念，不会像人打字那样，发现错误后退格重新输入  
  
这种情况也被称之为「幻觉」，本质还是在讲模型输出的 **概率性**  
  
#### 幻觉  
  
综上，解决幻觉的方法无非两种  
  
1. 强化模糊记忆：训练更多的相关知识，让预测概率增加  
2. 填充工作记忆：手动补充相关的知识，不依赖模糊记忆  
  
对于示例来说，第一种就是微调模型，把傲慢与偏见的第一章的内容重复训练上千八百次，Token 之间的概率关系自然会增加  
  
第二种就是把第一章的内容直接放在输入中，这样就可以避免模型进行回忆，直接进行总结步骤  
- User: 请帮我总结傲慢与偏见的第一章，傲慢与偏见第一章内容：${content}  
  
---  
  
一般来说，微调更适合去训练行为模式（问答行为/代码补全/思维链）  
  
而对于知识性的信息，不管是从成本角度，还是回答的真实性、实时性考虑，都会更偏向第二种方式    
  
  
## [LLM - RAG](../112/LLM%20-%20RAG.md)  
  
## [LLM - Tool Use](../113/LLM%20-%20Tool%20Use.md)  
  
## [Agent](../114/AI%20Agent.md)  
  
## [LLM - Knowledge Base](../115/LLM%20-%20Knowledge%20Base.md)  
  
## [Quantization](../116/LLM%20-%20Quantization.md)  
  
## RFC  
  
- [Deep Dive into LLMs like ChatGPT - Andrej Karpathy](https://www.youtube.com/watch?v=7xTGNNLPyMI&t=39s&ab_channel=AndrejKarpathy)  
- [Transformers (how LLMs work) explained visually](https://www.youtube.com/watch?v=9-Jl0dxWQs8&t=1027s&ab_channel=3Blue1Brown)  
  
---  
  
使用 excel 跑 GPT-2 👇    
[spreadsheets-are-all-you-need](https://github.com/ianand/spreadsheets-are-all-you-need/tree/v0.7.0)  
  
![Pasted image 20250316220938](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020250316220938.png)  
   
