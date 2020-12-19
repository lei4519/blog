# 模版字符语法

## 基本用法
```ts
type EventName<T extends string> = `${T}Changed`;
type T0 = EventName<'foo'>;  // 'fooChanged'
type T1 = EventName<'foo' | 'bar' | 'baz'>;  // 'fooChanged' | 'barChanged' | 'bazChanged'
```

## 关键字
```ts
uppercase, lowercase, capitalize, uncapitalize
```

## join实现

```ts
type Join<T extends (string | number | boolean | bigint)[], D extends string> =
  T extends [] ? // 空数组
    '' :
    T extends [unknown] ? // 只有一位
      `${T[0]}` :
      T extends [unknown, ...infer U] ? // 多位
        `${T[0]}${D}${Join<U, D>}` : // 递归返回
        string
```

## lodash get实现
```ts
type PropType<T, Paths extends string> =
  string extends Paths ? // 不能传入 string 只能传入 ''
    unknown :
    Paths extends keyof T ? // 如果只是单个属性，就直接返回
      T[Paths] :
      Paths extends `${infer K}.${infer R}` ? // 如果有 . 语法
        K extends keyof T ? // 提取出第一个 key
          PropType<T[K], R> // 递归
          : unknown
        : unknown
```

## infer 细节行为

1. 字符串模板中的 infer 会一直匹配到字符串的结尾，比如用 ${infer T}x 去匹配 'abcxxx' 会把 T 推断为 'abcxx'。

2. 字符串模板中两个 infer 相邻，第一个 infer 只会推断出单个字符，这有助于一些递归操作，比如 ${infer H}${infer T} 去推断 abcd，H 会推断为 a，而 T 会推断为 bcd。

## 参考资料

- [TypeScript 4.1 新特性：字符串模板类型，Vuex 终于有救了？](https://juejin.im/post/6867785919693832200)

