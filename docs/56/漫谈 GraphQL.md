---  
tags:  
  - GraphQL  
  - FE  
  - Explanation  
share: "true"  
issue: "56"  
created: 2023-10-27T20:12  
updated: 2024-05-12T12:36  
---  
  
本篇文章不会去过多的讨论技术细节，只是从核心概念上去说明 GraphQL 解决了什么问题，是如何怎么做到的  
  
## GraphQL 设计思路  
  
### GraphQL 是什么？  
  
现在只需要知道，对于前端来说，它是一种资源请求方式，可以用来代替 RESTful 风格的 API 请求。  
  
那为什么要去代替 RESTful 的 API 请求呢？因为遇到了一些问题  
  
1. 数据获取  
2. 数据校验  
  
### 数据获取  
  
前端的多个功能可能会依赖一份数据源的不同部分  
  
1. 后端需要频繁的修改字段获取逻辑  
2. 不管前端功能中实际用到了几个字段，接口都会返回所有的字段  
   - 对于字段很多的接口，网络传输的效率会有很大差别  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415185307.png)  
  
#### 按需获取字段  
  
把需要的字段传进去  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415185343.png)  
  
#### 获取不同表的字段  
  
把表名传进去  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415185358.png)  
  
#### 同时查询不同的表  
  
重构传输结构  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415185413.png)  
  
#### 不同的数据源 & 数据处理  
  
数据源：数据库、redis、ES、RPC 等等  
  
数据处理：多数情况从数据源拿到的数据，还需要进行逻辑处理才会返回  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415185428.png)  
  
#### 嵌套查询 / 子查询  
  
子查询：先执行父级的查询，再用父级的信息查找子级  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415185457.png)  
  
重构传输结构  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415185511.png)  
  
封装、分层  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415185525.png)  
  
### 数据校验  
  
拿到的数据和 API 文档不一致  
  
- 文档写的是 number，返回的是 string  
- 文档写的不会为空，返回了空  
  - 99% 不为空，1% 为空  
  
可不可以如果返回的和需要的不一致，就直接报错，接口 500，这样可以更快的定位问题（~~更好的甩锅~~）  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415185545.png)  
  
问题：  
  
- 数据类型是数据源决定的，前端是决定不了的，所以不应该前端去写（写了反而再坑后端）  
  
#### 类型定义  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415185600.png)  
  
#### 总结  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415185628.png)  
  
## GraphQL 官方设计  
  
[GraphQL | A query language for your API](https://graphql.org/)  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted_image_20240415185640.png)  
  
### 类型定义  
  
#### 内置根类型  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415185649.png)  
  
| Query 类型定义                                                                                             | Query 查询                                                                                                 |  
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |  
| ![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415185702.png) | ![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415185710.png) |  
  
### 字段解析  
  
从 `resolves`  中找到对应  `type`  的各字段解析方法，如果字段的类型不是标量类型（基础类型），就递归对 `type`  进行解析  
  
> 内置标量类型：Int、Float、String、Boolean、ID  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415185719.png)  
  
## N + 1 问题  
  
考虑上述代码示例，如果 1 条回答中，有 20 条评论，各 `fetch`  方法分别会被调用多少次？  
  
```ts  
fetchAnswer: 1  
fetchReviews: 1  
fetchUser: 21  
```  
  
如果我们查询的是 1 个回答列表，列表中有 20 条回答，每个回答有 20 条评论，上述方法有会被调用多少次？  
  
```ts  
fetchAnswer: 1  
fetchReviews: 20  
fetchUser: 420  
```  
  
### 问题  
  
1. 过多的 IO  
2. 重复请求  
  
遇事不决加抽象  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415185742.png)  
  
简单实现  
  
```ts  
const arr = new Set()  
let flag = true  
  
const fetchUser = (user_id) => {  
  arr.add(user_id)  
  
  if (flag) {  
    flag = false  
  
    setTimeout(() => {  
      batch_fetch_user([...arr])  
  
      arr.clear()  
      flag = true  
    })  
  }  
}  
```  
  
封装  
  
```ts  
class Loader {  
  constructor(callback) {  
    this.arr = new Set()  
    this.flag = true  
    this.callback = callback  
  }  
  
  load(key) {  
    this.arr.add(key)  
  
    if (this.flag) {  
      this.flag = false  
  
      setTimeout(() => {  
        this.callback([...this.arr])  
  
        this.arr.clear()  
        this.flag = true  
      })  
    }  
  }  
}  
```  
  
### DataLoader  
  
```ts  
const DataLoader = require("dataloader")  
  
const userLoader = new DataLoader((ids) => {  
  console.log(ids)  
  // `SELECT * FROM user WHERE id IN (${ids.join(',')})`  
  // rpc.client.fetchUsers(ids)  
  return Promise.resolve(["123"])  
})  
  
Array(20)  
  .fill(1)  
  .map((_, i) => userLoader.load(i))  
  
Array(20)  
  .fill(1)  
  .map((_, i) => userLoader.load(0))  
```  
  
| [DataLoader](https://github.com/graphql/dataloader/blob/d336bd15282664e0be4b4a657cb796f09bafbc6b/src/index.js#L239) | [Vue](https://github.com/vuejs/vue/blob/8d3fce029f20a73d5d0b1ff10cbf6fa73c989e62/src/core/util/next-tick.js#L42) |  
| ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |  
| ![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415185758.png)          | ![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415185804.png)       |  
  
### 总结  
  
- 解析字段时都应该使用 dataloader  
- 要求后端提供批量查询的 RPC 方法  
  
## Code First Schema  
  
### 类型语言的问题  
  
重复的写 schema 和 类型（结构）定义，并且两者又是很像的  
  
GraphQL Schema  
  
```gql  
type Answer {  
  id: Int  
  content: String  
}  
```  
  
Go  
  
```go  
type Answer struct {  
  id int  
  content string  
}  
```  
  
Rust  
  
```rust  
struct Answer {  
  id: i32  
  content: string  
}  
```  
  
TS  
  
```ts  
class Answer {  
  id: Number  
  content: string  
}  
```  
  
### Schema First  
  
先写 schema，生成类型（结构）  
  
### Code First  
  
先写类型（结构），生成 schema  
  
#### 调用式  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415185822.png)  
  
#### 结构式  
  
![](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Pasted%20image%2020240415185828.png)  
  
#### JS  
  
| lib                                                             | star         | modal                            |  
| --------------------------------------------------------------- | ------------ | -------------------------------- |  
| [graphql-js](https://github.com/graphql/graphql-js)             | 19.7k        | 两种都支持：code first（调用式） |  
| [apollo-server](https://github.com/apollographql/apollo-server) | 13.5k        | schema first                     |  
| [type-graphql](https://github.com/MichalLytek/type-graphql)     | 7.9k         | code first（结构式）             |  
| [graphql-yoga](https://github.com/dotansimha/graphql-yoga)      | 7.8k         | schema first                     |  
| [nestjs](https://github.com/nestjs/nest)                        | 60.4k / 1.3k | 两种都支持：code first（结构式） |  
  
#### Go  
  
| lib                                                 | star | modal                |  
| --------------------------------------------------- | ---- | -------------------- |  
| [graphql-go](https://github.com/graphql-go/graphql) | 9.5k | code first（调用式） |  
| [gqlgen](https://github.com/99designs/gqlgen)       | 9.3k | schema first         |  
  
#### Rust  
  
| lib                                                             | star | modal                |  
| --------------------------------------------------------------- | ---- | -------------------- |  
| [juniper](https://github.com/graphql-rust/juniper)              | 5.3k | code first（结构式） |  
| [async-graphql](https://github.com/async-graphql/async-graphql) | 3k   | code first（结构式） |  
