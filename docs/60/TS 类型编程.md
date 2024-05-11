---  
tags:  
  - TypeScript  
  - FE  
  - Explanation  
share: "true"  
issue: 60
created: 2023-02-03
title: TS 类型编程
description: TS 类型编程
permalink: "60"
---  
  
现如今 TS 已经完全走进了前端社区，纵观流行的前端框架/库，都有 TS 类型支持，不少框架/库更是对于源码是使用 TypeScript 开发，完美支持 TypeScript 类型提示当作一大亮点去宣传。  
  
在业务中用 TS 写写页面、表格等上层逻辑，基本就是把后端数据定义/转换成 interface，往后一把梭就完了，不需要对 TS 的类型系统有深入的了解。  
  
但当封装公用组件/函数时，如果想封装的代码能够支持 TS 类型，就需要了解类型编程的一些技巧，本文就分享一些常用的类型编程技巧。  
  
## 好的 TS 类型支持  
  
良好的类型推断，避免重复的类型定义  
  
```ts  
// string[]  
const result = [1, 2, 3]  
  .map((item) => () => item)  
  .map((fn) => ({ value: fn() }))  
  .map((item) => ({ label: `${item.value}` }))  
  .map((item) => item.label)  
  
// ---  
interface ResponseData {  
  is_success: boolean  
  data: {  
    id: number  
    pu_info: Record<string, string>  
    service_price: number  
    order_price: number  
  }[]  
}  
  
const fetchListData = async () => {  
  let data = await request<ResponseData>("/api/list") // ResponseData  
  
  data = transformKeys(data) // ResponseData1: isSuccess puInfo orderPrice  
  
  return transformMoney(data, ["orderPrice"]) // ResponseData2: orderPrice: string  
}  
  
const { data, isLoading, isError } = useSWR(fetchListData) // data: ResponseData2  
  
const id = get(data, "data.id") // number  
```  
  
常见套路：提取 → 转换 → 重组 → 递归（循环）  
  
## 前置知识  
  
### 基础知识  
  
```ts  
// 类型  
type T = string | number | boolean | class | interface // ...  
  
// 类型推断  
{  
  let A = 1 // number  
  let B = "hello" // string  
  let C = [1, 2, 3] // number[]  
}  
  
// 常量类型推断  
{  
  const A = 1 // 1  
  const B = "hello" // 'hello'  
  const C = [1, 2, 3] as const // readonly [1, 2, 3]  
}  
  
// 联合类型：｜  
type Union = { hello: string } | { world: number }  
  
// 交叉类型： &  
type Intersect = { hello: string } & { world: number }  
  
// .....  
```  
  
### 对象操作：keyof、in  
  
```ts  
// 返回对象 key 的常量联合类型  
keyof T // hello | world  
  
// 返回对象值的联合类型  
T[keyof T] // string | number  
T['hello'] // string  
T['world'] // number  
  
// in 操作符遍历联合类型  
interface A {  
    [K in string | number]: never  
    [K in 'hello' | 'world']: never  
    [K in keyof T]: T[K]  
}  
  
// ------ 源码 ------  
  
/**  
 * Make all properties in T required  
 */  
type Required<T> = {  
    [P in keyof T]-?: T[P];  
};  
  
/**  
 * From T, pick a set of properties whose keys are in the union K  
 */  
type Pick<T, K extends keyof T> = {  
    [P in K]: T[P];  
};  
  
/**  
 * Construct a type with a set of properties K of type T  
 */  
type Record<K extends keyof any, T> = {  
    [P in K]: T;  
}  
```  
  
### 类型约束、条件类型：extends  
  
```ts  
// 泛型参数约束  
type T<P extends string> = {}  
  
// 条件类型  
type IsString<T> = T extends string ? true : false  
type A = IsString<"1"> // true  
type B = IsString<2> // false  
```  
  
### 条件类型推断：infer  
  
1. 声明一个类型  
2. 如果类型约束成功  
3. 将模式匹配后的类型分配给 1  
  
```ts  
// 条件类型推断  
type Example<T> = T extends infer R ? R : never  
type A = Example<"1"> // '1'  
type B = Example<2> // 2  
```  
  
### 模式匹配  
  
```ts  
type A = [1, 2, 3]  
type ExampleA = A extends [infer First, ...infer Rest] ? First : never // 1  
  
type B = "123"  
type ExampleB = B extends `${infer FirstChar}${infer Rest}` ? FirstChar : never // '1'  
  
type C = (p: number) => string  
type ExampleB = C extends (p: infer R) => any ? R : never // number  
  
// ------ 源码（删减了类型约束） ------  
  
/**  
 * Obtain the parameters of a function type in a tuple  
 */  
type Parameters<T> = T extends (...args: infer P) => any ? P : never  
  
/**  
 * Obtain the return type of a function type  
 */  
type ReturnType<T> = T extends (...args: any) => infer R ? R : any  
  
/**  
 * Obtain the parameters of a constructor function type in a tuple  
 */  
type ConstructorParameters<T> = T extends abstract new (...args: infer P) => any  
  ? P  
  : never  
  
/**  
 * Obtain the return type of a constructor function type  
 */  
type InstanceType<T> = T extends abstract new (...args: any) => infer R  
  ? R  
  : any  
```  
  
### 函数参数泛型推导  
  
```ts  
function f<A, B, C extends string>(a: A, b: B, c: C) {}  
  
f("a", "b" as const, "c") // function f<string, "b", "c">(): void  
  
interface Api {  
  "/api/phone": { phone: string }  
  "/api/email": { email: string }  
}  
  
function request<T extends keyof Api>(url: T): Api[T] {  
  return "" as any  
}  
  
request("/api/phone") // { phone: string }  
request("/api/email") // { email: string }  
```  
  
## 示例  
  
### Get  
  
#### Infer 在字符串模板中的小细节  
  
1. 如果模版中只有一个 infer，它会尽可能多的匹配（贪婪模式）。比如用 ${infer T}x 去匹配 'abcxxx'，T 为 'abcxx'。  
2. 如果有多个 infer，最后一个 infer 是贪婪模式，前面的是非贪婪模式。比如 ${infer A}${infer B}${infer C} 去匹配 'abcdefg'，结果为：A: 'a'，B: 'b'，C: 'cdefg'  
  
```ts  
type Get<T, Paths extends string> = Paths extends keyof T // 递归出口  
  ? T[Paths]  
  : Paths extends `${infer K}.${infer R}` // 匹配 . 语法  
  ? K extends keyof T  
    ? Get<T[K], R> // 递归  
    : unknown  
  : unknown  
  
// _.get(obj, 'a.b.c')  
type R = Get<{ a: { b: { c: { d: number } } } }, "a.b.c">  
```  
  
### [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)  
  
#### Api 设计  
  
```ts  
// @ts-nocheck  
// Define a service using a base URL and expected endpoints  
export const pokemonApi = createApi({  
  endpoints: (builder) => ({  
    getPokemonByName: builder.query<Pokemon[], string>({  
      query: (name) => `pokemon/${name}`,  
    }),  
    getPokemonById: builder.query<Pokemon, string>({  
      query: (id) => `pokemon/${id}`,  
    }),  
  }),  
})  
  
// Export hooks for usage in functional components, which are  
// auto-generated based on the defined endpoints  
export const { useGetPokemonByNameQuery, useGetPokemonByIdQuery } = pokemonApi  
  
const { data, isLoading, isError } = useGetPokemonByNameQuery()  
```  
  
#### 实现  
  
```ts  
interface Endpoints {  
  getPokemonByName: string  
  getPokemonById: number  
}  
  
// 转化 key 字符串  
// 问题：无法取出准确的值类型  
type _B = {  
  [K in `use${Capitalize<keyof Endpoints>}Query`]: Endpoints[keyof Endpoints]  
}  
  
// 准确的值类型：双重遍历  
// 问题：结构不是我们想要的  
type B = {  
  [P in keyof Endpoints]: {  
    [K in `use${Capitalize<P>}Query`]: Endpoints[P]  
  }  
}  
  
// 取出值类型  
// 问题：联合类型，无法使用  
type C = B[keyof B]  
  
// 联合类型转交叉类型  
type UnionToIntersect<T> = (T extends any ? (k: T) => any : never) extends (  
  k: infer P  
) => any  
  ? P  
  : never  
  
type E = UnionToIntersect<C>  
  
const e = {} as E  
  
e.useGetPokemonByNameQuery // ✅  
```  
  
### Redux  
  
#### Api 设计  
  
```ts  
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit"  
  
export const counterSlice = createSlice({  
  name: "counter",  
  initialState: {  
    value: 0,  
  },  
  reducers: {  
    increment: (state) => {  
      state.value += 1  
    },  
    incrementByAmount: (state, action: PayloadAction<number>) => {  
      state.value += action.payload  
    },  
  },  
})  
  
export default configureStore({  
  reducer: {  
    counter: counterSlice.reducer,  
  },  
})  
  
// @ts-ignore  
dispatch({ type: "counter/incrementByAmount", payload: 1 })  
```  
  
实现：略  
  
### TransformKeys  
  
```ts  
interface ResponseData {  
  is_success: boolean  
  data: {  
    id: number  
    pu_info: Record<string, string>  
    service_price: number  
    order_price: number  
  }[]  
}  
  
// 下划线转驼峰  
type Camelize<  
  S extends string,  
  V extends string = ""  
> = S extends `${infer A}_${infer B}${infer C}`  
  ? Camelize<C, `${V}${A}${Capitalize<B>}`>  
  : `${V}${S}`  
  
type A = Camelize<"hello_java_script">  
  
// 工具函数：取出 Value 的类型  
type ValueType<T> = T[keyof T]  
  
// 联合转交叉  
type UnionToIntersect<T> = (T extends any ? (k: T) => any : never) extends (  
  k: infer P  
) => any  
  ? P  
  : never  
  
// 转换 keys  
type TransformKeys<T> = UnionToIntersect<  
  ValueType<{  
    [K in keyof T]: K extends string  
      ? {  
          [P in `${Camelize<K>}`]: T[K] extends any[]  
            ? Array<TransformKeys<T[K][0]>>  
            : T[K] extends Record<string, any>  
            ? TransformKeys<T[K]>  
            : T[K]  
        }  
      : never  
  }>  
>  
  
type R1 = TransformKeys<ResponseData>  
  
const a = {} as R1  
  
a.data[0].id  
```  
  
### TransformMoney  
  
```ts  
transformMoney(data, ["orderPrice"]) // ResponseData2: orderPrice: string  
  
// 元祖转联合  
type A = ["A", "B"]  
  
type B = A[number] // A | B  
  
// ---  
  
interface Data {  
  id: number  
  servicePrice: number  
  orderPrice: number  
}  
  
// 转换 keys  
type Transform<T, Keys> = {  
  [K in keyof T]: K extends Keys ? string : T[K]  
}  
  
type R = Transform<Data, "orderPrice">  
```  
  
## 扩展知识  
  
### 字符串类型处理  
  
```ts  
/**  
 * Convert string literal type to uppercase  
 */  
type Uppercase<S extends string> = intrinsic  
  
/**  
 * Convert string literal type to lowercase  
 */  
type Lowercase<S extends string> = intrinsic  
  
/**  
 * Convert first character of string literal type to uppercase  
 */  
type Capitalize<S extends string> = intrinsic  
  
/**  
 * Convert first character of string literal type to lowercase  
 */  
type Uncapitalize<S extends string> = intrinsic  
```  
  
### 联合类型转交叉类型  
  
函数参数逆变   + 分配条件类型  
  
```ts  
// 类型推断时，在逆变位置的同一类型变量中的多个候选会被推断成交叉类型（函数签名重载的参数位置类型会被推断为交叉类型）  
// https://github.com/Microsoft/TypeScript/pull/21496  
type Func = ((arg: { a: string }) => void) | ((arg: { b: number }) => void)  
type U = Func extends (arg: infer A) => any ? A : never // { a: string } & { b: number }  
  
// {a: string} | {b: number} 如何变为函数签名重载？  
  
// 分配条件类型  
// 官网：当泛型类型是联合类型时，条件判断会变得具有分配性  
// 人话：extends 左边的范型联合类型，会拆开分别处理  
type ToArray<Type> = Type extends any ? Type[] : never  
type StrArrOrNumArr = ToArray<string | number> // string[] | number[] 而非是 (string | number)[]  
```  
  
### 逆变、协变  
  
类型系统中的概念，表达父子类型关系  
  
TS 中参数位置是逆变的，返回值是协变的  
  
![逆变协变.excalidraw](https://raw.githubusercontent.com/lei4519/blog/main/docs/Excalidraw/%E9%80%86%E5%8F%98%E5%8D%8F%E5%8F%98.svg)  
  
![Kanban--2024-04-14_16.41.24-6.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/images/Kanban--2024-04-14_16.41.24-6.png)  
  
[https://github.com/sl1673495/blogs/issues/54](https://github.com/sl1673495/blogs/issues/54)  
  
[https://jkchao.github.io/typescript-book-chinese/tips/covarianceAndContravariance.html](https://jkchao.github.io/typescript-book-chinese/tips/covarianceAndContravariance.html)  
  
#### 元祖转联合  
  
```ts  
type A = ["A", "B"]  
  
type B = A[number]  
```  
  
## 类型体操  
  
- 条件判断：`T extends string ? T : never`  
- 循环: 递归  
- 运算: 数组长度  
- 变量: 泛型、infer  
- 数据结构  
  
[TypeScript 类型体操天花板，用类型运算写一个 Lisp 解释器](https://zhuanlan.zhihu.com/p/427309936)  
  
[用 TypeScript 类型运算实现一个中国象棋程序](https://zhuanlan.zhihu.com/p/426966480)  
  
[Type Challenges](https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md)  
