---
created: 2025-03-17T22:21
updated: 2025-07-05T13:26
tags:
  - LLM
  - AI
  - Explanation
share: "true"
issue: "112"
---
  
Retrieval-augmented generation    
检索增强生成  
  
---  
  
## 概念  
  
[LLM Base](../111/LLM%20Base.md) 幻觉中提到，解决幻觉最简单的方法就是直接**把相关知识放在上下文**中，去除模糊记忆的依赖  
- 开卷考试  
  
RAG 要做的就是把这一步自动化，由程序来根据问题自动拼接相关的上下文知识，提交给 LLM  
  
![Pasted image 20250319112547](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020250319112547.png)  
  
总的来说分几步  
  
1. 知识库文档划分成块（Chunk）  
	- 最终检索出的内容将以块为维度就行提取  
2. 向量嵌入（Embedding）  
	- 维度：768/1024/1536  
	- 向量数据库存储  
3. 文档获取（Retrieve）  
	- 向量检索  
	- ReRank  
4. Prompt 工程（Prompt Engineering）  
5. 大模型问答（LLM）  
  
## [Perplexity](https://www.perplexity.ai/)  
  
![Pasted image 20250319153915](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020250319153915.png)  
  
以 perplexity 为例，提问并不会直接由大模型回复，而是先对网页进行索引后，将相关网页放入上下文中，大模型对网页内容进行总结回复，同时会在回复中标明引用的网页，方便内容核实  
  
## 落地  
  
> [一文整理20多种目前常用的 RAG 创新方法](https://mp.weixin.qq.com/s/-_1vkfXXQAb_zbShDhinIQ)    
> [为什么RAG系统"一看就会，一做就废"？](https://mp.weixin.qq.com/s/OEAAzbuCvG3gf_mq_mrlfg)  
  
实际落地并不简单，不是将文档上传到某个框架/平台里就完事了  
- 只是 Embedding，语义搜索，不具备大模型的理解能力，不能像大模型那样完全理解提问和内容的关系  
- 怎么分块？  
	- 分的太大，无关信息太多，浪费上下文长度  
	- 分的太小，完整信息可能截断，上下文不完整  
  
### Chunk  
  
#### 传统分块  
  
- 按照固定长度分割  
- 按照段落分割  
- ...  
  
#### AST  
  
代码场景，使用 AST 来进行分割，确保上下文完整  
  
#### LLM  
  
让 LLM 先对文档进行一次处理，将语义关系梳理出来  
- 构建问答块  
- 句子整容，确保每个句子独立完整  
- 构建知识图谱  
  
#### 父子模式  
  
> 多级索引  
  
父区块（Parent-chunk）保持较大的文本单位（如段落），提供丰富的上下文信息  
  
子区块（Child-chunk）则是较小的文本单位（如句子），用于精确检索  
  
首先通过子区块进行精确检索以确保相关性，然后获取对应的父区块来补充上下文信息  
  
- [2. 指定分段模式 \| Dify](https://docs.dify.ai/zh-hans/guides/knowledge-base/create-knowledge-and-upload-documents/chunking-and-cleaning-text)  
  
### Rerank  
  
对检索出的 chunk 进行排序  
  
![Pasted image 20250319161115](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020250319161115.png)  
  
[RAG检索增强之Reranker重排序模型详解](https://mp.weixin.qq.com/s/wMeWQZMnjBTcoDa_Da3OzA)  
