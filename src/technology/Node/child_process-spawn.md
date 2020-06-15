# child_process spawn模块详解

[官方文档](http://nodejs.cn/api/child_process.html#child_process_child_process_spawn_command_args_options)

> `child_process.spawn()` 方法使用给定的 command 衍生新的进程，并传入 args 中的命令行参数。

## 函数签名
```typescript
interface SpawnOptions {
  cwd: string
  env: Object
  argv0: string[]
  stdio: string[] | string
  detached: boolean
  uid: number
  gid: number
  serialization: string
  shell: boolean
  windowsVerbatimArguments: boolean
  windowsHide: boolean
}
function spawn(command: string, options: SpawnOptions): ChildProcess;
function spawn(command: string, args: ReadonlyArray<string>, options: SpawnOptions): ChildProcess;
```

## 参数详解

### command

`spawn`模块会创建一个子进程，并在这个进程中调用传入的系统命令。

这里的系统命令`command`就是指你可以在终端中输入的命令，比如`npm`、`node`、`bash`、`ls`、`pwd`、`mongod`等等等等，你可以在终端中输入，就可以在这里传入

比如我们可以这样调用`ls`命令
```js
const {spawn} = require('child_process')
spawn('ls')
```

### args

如果需要给命令传递参数，可以传入args属性，此属性默认为空数组

```js
spawn('ls', ['-a'])
```

### options

常用这两个：`shell` `stdio`

- shell: boolean | string = false
  - 如果为 true，则在 shell 中运行 command。
  - 在 Unix 上使用 '/bin/sh'，在 Windows 上使用 process.env.ComSpec。
  - 可以将不同的 shell 指定为字符串。 参见 shell 的要求和默认的 Windows shell
- stdio: string[] | string = 'pipe'
  - 默认情况下，子进程的输入输出流都会在子进程中处理，我们可以将其设置为`inherit`，来把子进程的输入输出放到副进程中处理。详见[options_stdio](http://nodejs.cn/api/child_process.html#child_process_options_stdio)
  - 举个例子
    ```js
      // index.js 文件
        require('child_process').spawn('ls')

      node index.js
      // 如果我们直接这样执行代码，那么在终端中我们是看不到任何输出的
      // 这是因为输出信息都传递给了子进程，而子进程并没有打印处理
      // 我们加上下面的代码进行打印
      require('child_process').spawn('ls').stdout.on('data', console.log)
      // 此时再执行就可以在终端中看到输出的信息了

      // 而如果我们将 stdio 设置为 inherit，则会将输入输出交由父进程处理，子进程不需要监听事件也可以在终端中看到输出的信息了
    ```
- cwd: string
  - 设置子进程的工作目录，默认值：当前目录
- env: object
  - 环境变量的键值对。 默认值: process.env
- argv0: string
  - 可以通过设置这个参数重写`command`参数的值，如果没有传入，则会被设置为传入的`command`值
- detached: boolean
  - 使子进程独立于其父进程运行, 具体行为取决于平台。详见[options_detached](http://nodejs.cn/api/child_process.html#child_process_options_detached)
= uid: number
  - 设置进程的用户标识
= gid: number
  - 设置进程的群组标识
- serialization: string = json
  - 指定用于在进程之间发送消息的序列化类型。 可能的值为 'json' 和 'advanced'。
- windowsVerbatimArguments: boolean
  - 在 Windows 上不为参数加上引号或转义。
  - 在 Unix 上会被忽略。
  - 如果指定了 shell 并且是 CMD，则自动设为 true。 默认值: false。
- windowsHide: boolean
  - 隐藏子进程的控制台窗口（在 Windows 系统上通常会创建）。 默认值: false。

## 跨平台

在unix系统中，我们可以这样使用`spawn('npm')`，这场可以正常运行的。但在windows系统中则会报错，这是因为在windows中我们实际执行的是`npm.cmd`批处理，而在windows上，`.cmd` `.bat`批处理需要使用`cmd.exe`来运行。

所以我们需要显示的调用cmd：`spawn('cmd', ['/c', 'npm'])`，或者我们可以设置`shell`参数来隐式调用cmd `spawn('npm', {shell: true})`

虽然在unix中，我们设置`shell`为true也不妨碍命令的执行，但是这样就会额外产生一个不必要的shell进程。

所以我们可以这么来写，如果系统是windows则打开`shell`
```js
spawn('npm', {
  shell: process.platform === 'win32'
})
```

## 执行shell命令

从上面的文章我们可以了解到, 默认情况下，`spawn`并不会创建一个`shell`来执行我们传入的命令。

这个行为使得它比`exec`函数效率更高，但是有时我们又确实需要执行`shell`命令，那这个时候我们怎么使用`spawn`来执行呢？要知道`exec`函数会缓存输出结果一次性返回给我们，而`spawn`则是使用流的形式。如果我们的命令数据数据规模较小，那使用exec的确是个不错的选择，但在大多数情况下，使用`spawn`将会是更合理、更安全的方式

那么如果使用`spawn`来执行shell命令呢？

1. 最简单的，就是设置shell参数
```js
// 设置为true
spawn('npm run dev', {shell: true})
// 指定终端
spawn('npm run dev', {shell: 'bash'})
```

2. 也可以运行指定终端来执行命令
```js
// 直接传入shell命令
spawn('bash', ['npm', 'run', 'dev'])
// 通过stdin.write写入命令
const bash = spawn('bash')
bash.stdin.write('npm run dev')
bash.stdin.end()
```