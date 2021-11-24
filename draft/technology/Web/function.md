# 函数式编程

## 什么是函数式编程？

> ​	函数式编程关心数据的映射，命令式编程关心解决问题的步骤 - [nameoverflow](https://www.zhihu.com/people/nameoverflow)

- 命令式编程：数据遍历

  ```js
  const arr = [1, 2, 3] // 数组
  const double = num => num * 2 // 要做的事情
  for (let i = 0, l = arr.length; i < l; i++) { // 一步一步的告诉计算机如何遍历数据
    double(arr[i])
  }
  ```

- 函数式编程：数据遍历

  ```js
  const arr = [1, 2, 3]
  arr.forEach((item) => item * 2) // 隐藏遍历过程至forEach内部，使用者只关心如何处理数据
  ```

命令式编程：需要将每一步的实现写出，不同功能的代码混在一起。如上的遍历，程序流转代码和业务逻辑代码混合在一起。

函数式编程：每个功能都封装成相应的函数，隐藏内部实现。只需要关心数据的输入和输出。

## 纯函数

> 相同的输入，相同的输出

函数式编程时，我们将每个功能的实现放在函数内部，使用者无需关心内部的处理流程。这之中有个信任问题，使用者将数据输入，得到处理之后的输出。我们要保证数据的输入和输出的一致性。如果每次的输入一样，得到的输出却不同，就会导致程序运转出现难以估算的问题。

```js
// 纯函数
function add1(x, y) {return x + y}

// 非纯函数
let z = 3
function add2(x, y) {return x + y + z}
```

可以看到`add2`函数依赖了外部变量`z`，这就导致如果`z`的值发生变化，那么运行的结果就会不一致。

在书写函数时，尽量使函数内部不依赖外部变量，不实用`Date.now()`、`Math.random()`之类的函数。

## 柯里化

> 柯里化让我们的函数拥有“记忆”的能力，技术层面就是通过闭包记住之前传入的参数，来实现阶段性的传参。

来看一下curry的用法（假设我们已经实现了curry函数，后面会给出代码的实现）

```js
// 来定义一个接受两个参数的函数
function add(x, y){
  return x + y
}
// add 函数需要两个参数才可以正常运行，每次使用时都需要传入两个参数
add(1, 1)

// 如果是下面这种情况呢？
add(1, 1)
add(1, 2)
add(1, 3)

// 我们发现第一个参数是固定没变的，但是却需要每次都传入，curry可以帮助改变这种情况
// 使用curry函数包装后，函数就拥有了记忆的功能
// 每次函数调用都可以记住当前传入的参数，如果传入的参数个数没有达到正常运行的标准，就不会运行
// 来尝试一下
const curryAdd = curry(add)
curryAdd(1, 1) // 2
curryAdd(1)(1) // 2
curryAdd()(1)(1) // 2

// 是的，上面的代码都可以正常运行，有人会奇怪这么做的意义何在？让我们来看一些实际用例
```

来看一下curry的常用场景：

 - Ajax

   ```js
   // 正常写法
   $.ajax('/list', {data: 1})
   $.ajax('/list', {data: 2})
   $.ajax('/list', {data: 3})

   // curry写法
   const curryAjax = curry((url, options) => {
     $.ajax(url, options)
   })

   const listAjax = curryAjax('/list')
   listAjax({data: 1})
   listAjax({data: 2})
   listAjax({data: 3})
   // 看，我们省去了每次传入url的步骤
   ```



 - 找到类名是`item`的DOM元素

   ```js
   // 正常写法
   const domList = [/*这里是很多dom元素*/]
   domList.find(el => el.classList.contains('item'))

   // curry
   const hasClass = curry((className, el) => el.classList.contains(className))
   const findItem = hasClass('item')
   domList.find(findItem)
   ```

curry化使我们可以在传入每个参数都可以进行缓存，直到传入的参数个数达到运行标准。

## 组合