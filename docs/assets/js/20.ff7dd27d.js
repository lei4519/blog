(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{397:function(s,t,a){"use strict";a.r(t);var n=a(11),e=Object(n.a)({},(function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h1",{attrs:{id:"child-process-spawn模块详解"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#child-process-spawn模块详解"}},[s._v("#")]),s._v(" child_process spawn模块详解")]),s._v(" "),a("p",[a("a",{attrs:{href:"http://nodejs.cn/api/child_process.html#child_process_child_process_spawn_command_args_options",target:"_blank",rel:"noopener noreferrer"}},[s._v("官方文档"),a("OutboundLink")],1)]),s._v(" "),a("blockquote",[a("p",[a("code",[s._v("child_process.spawn()")]),s._v(" 方法使用给定的 command 衍生新的进程，并传入 args 中的命令行参数。")])]),s._v(" "),a("h2",{attrs:{id:"函数签名"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#函数签名"}},[s._v("#")]),s._v(" 函数签名")]),s._v(" "),a("div",{staticClass:"language-typescript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("interface")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("SpawnOptions")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  cwd"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("string")]),s._v("\n  env"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" Object\n  argv0"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("string")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n  stdio"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("string")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("string")]),s._v("\n  detached"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("boolean")]),s._v("\n  uid"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("number")]),s._v("\n  gid"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("number")]),s._v("\n  serialization"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("string")]),s._v("\n  shell"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("boolean")]),s._v("\n  windowsVerbatimArguments"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("boolean")]),s._v("\n  windowsHide"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("boolean")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("spawn")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token parameter"}},[s._v("command"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("string")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" options"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" SpawnOptions")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" ChildProcess"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("spawn")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token parameter"}},[s._v("command"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("string")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" args"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" ReadonlyArray"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),a("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("string")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" options"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" SpawnOptions")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" ChildProcess"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])]),a("h2",{attrs:{id:"参数详解"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#参数详解"}},[s._v("#")]),s._v(" 参数详解")]),s._v(" "),a("h3",{attrs:{id:"command"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#command"}},[s._v("#")]),s._v(" command")]),s._v(" "),a("p",[a("code",[s._v("spawn")]),s._v("模块会创建一个子进程，并在这个进程中调用传入的系统命令。")]),s._v(" "),a("p",[s._v("这里的系统命令"),a("code",[s._v("command")]),s._v("就是指你可以在终端中输入的命令，比如"),a("code",[s._v("npm")]),s._v("、"),a("code",[s._v("node")]),s._v("、"),a("code",[s._v("bash")]),s._v("、"),a("code",[s._v("ls")]),s._v("、"),a("code",[s._v("pwd")]),s._v("、"),a("code",[s._v("mongod")]),s._v("等等等等，你可以在终端中输入，就可以在这里传入")]),s._v(" "),a("p",[s._v("比如我们可以这样调用"),a("code",[s._v("ls")]),s._v("命令")]),s._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("spawn"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("require")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'child_process'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("spawn")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'ls'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])])]),a("h3",{attrs:{id:"args"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#args"}},[s._v("#")]),s._v(" args")]),s._v(" "),a("p",[s._v("如果需要给命令传递参数，可以传入args属性，此属性默认为空数组")]),s._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("spawn")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'ls'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'-a'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])])]),a("h3",{attrs:{id:"options"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#options"}},[s._v("#")]),s._v(" options")]),s._v(" "),a("p",[s._v("常用这两个："),a("code",[s._v("shell")]),s._v(" "),a("code",[s._v("stdio")])]),s._v(" "),a("ul",[a("li",[s._v("shell: boolean | string = false\n"),a("ul",[a("li",[s._v("如果为 true，则在 shell 中运行 command。")]),s._v(" "),a("li",[s._v("在 Unix 上使用 '/bin/sh'，在 Windows 上使用 process.env.ComSpec。")]),s._v(" "),a("li",[s._v("可以将不同的 shell 指定为字符串。 参见 shell 的要求和默认的 Windows shell")])])]),s._v(" "),a("li",[s._v("stdio: string[] | string = 'pipe'\n"),a("ul",[a("li",[s._v("默认情况下，子进程的输入输出流都会在子进程中处理，我们可以将其设置为"),a("code",[s._v("inherit")]),s._v("，来把子进程的输入输出放到副进程中处理。详见"),a("a",{attrs:{href:"http://nodejs.cn/api/child_process.html#child_process_options_stdio",target:"_blank",rel:"noopener noreferrer"}},[s._v("options_stdio"),a("OutboundLink")],1)]),s._v(" "),a("li",[s._v("举个例子"),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[s._v("  "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// index.js 文件")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("require")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'child_process'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("spawn")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'ls'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n\n  node index"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("js\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 如果我们直接这样执行代码，那么在终端中我们是看不到任何输出的")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 这是因为输出信息都传递给了子进程，而子进程并没有打印处理")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 我们加上下面的代码进行打印")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("require")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'child_process'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("spawn")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'ls'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("stdout"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("on")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'data'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" console"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("log"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 此时再执行就可以在终端中看到输出的信息了")]),s._v("\n\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 而如果我们将 stdio 设置为 inherit，则会将输入输出交由父进程处理，子进程不需要监听事件也可以在终端中看到输出的信息了")]),s._v("\n")])])])])])]),s._v(" "),a("li",[s._v("cwd: string\n"),a("ul",[a("li",[s._v("设置子进程的工作目录，默认值：当前目录")])])]),s._v(" "),a("li",[s._v("env: object\n"),a("ul",[a("li",[s._v("环境变量的键值对。 默认值: process.env")])])]),s._v(" "),a("li",[s._v("argv0: string\n"),a("ul",[a("li",[s._v("可以通过设置这个参数重写"),a("code",[s._v("command")]),s._v("参数的值，如果没有传入，则会被设置为传入的"),a("code",[s._v("command")]),s._v("值")])])]),s._v(" "),a("li",[s._v("detached: boolean\n"),a("ul",[a("li",[s._v("使子进程独立于其父进程运行, 具体行为取决于平台。详见"),a("a",{attrs:{href:"http://nodejs.cn/api/child_process.html#child_process_options_detached",target:"_blank",rel:"noopener noreferrer"}},[s._v("options_detached"),a("OutboundLink")],1),s._v("\n= uid: number")]),s._v(" "),a("li",[s._v("设置进程的用户标识\n= gid: number")]),s._v(" "),a("li",[s._v("设置进程的群组标识")])])]),s._v(" "),a("li",[s._v("serialization: string = json\n"),a("ul",[a("li",[s._v("指定用于在进程之间发送消息的序列化类型。 可能的值为 'json' 和 'advanced'。")])])]),s._v(" "),a("li",[s._v("windowsVerbatimArguments: boolean\n"),a("ul",[a("li",[s._v("在 Windows 上不为参数加上引号或转义。")]),s._v(" "),a("li",[s._v("在 Unix 上会被忽略。")]),s._v(" "),a("li",[s._v("如果指定了 shell 并且是 CMD，则自动设为 true。 默认值: false。")])])]),s._v(" "),a("li",[s._v("windowsHide: boolean\n"),a("ul",[a("li",[s._v("隐藏子进程的控制台窗口（在 Windows 系统上通常会创建）。 默认值: false。")])])])]),s._v(" "),a("h2",{attrs:{id:"跨平台"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#跨平台"}},[s._v("#")]),s._v(" 跨平台")]),s._v(" "),a("p",[s._v("在unix系统中，我们可以这样使用"),a("code",[s._v("spawn('npm')")]),s._v("，这场可以正常运行的。但在windows系统中则会报错，这是因为在windows中我们实际执行的是"),a("code",[s._v("npm.cmd")]),s._v("批处理，而在windows上，"),a("code",[s._v(".cmd")]),s._v(" "),a("code",[s._v(".bat")]),s._v("批处理需要使用"),a("code",[s._v("cmd.exe")]),s._v("来运行。")]),s._v(" "),a("p",[s._v("所以我们需要显示的调用cmd："),a("code",[s._v("spawn('cmd', ['/c', 'npm'])")]),s._v("，或者我们可以设置"),a("code",[s._v("shell")]),s._v("参数来隐式调用cmd "),a("code",[s._v("spawn('npm', {shell: true})")])]),s._v(" "),a("p",[s._v("虽然在unix中，我们设置"),a("code",[s._v("shell")]),s._v("为true也不妨碍命令的执行，但是这样就会额外产生一个不必要的shell进程。")]),s._v(" "),a("p",[s._v("所以我们可以这么来写，如果系统是windows则打开"),a("code",[s._v("shell")])]),s._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("spawn")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'npm'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  shell"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" process"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("platform "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("===")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'win32'")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])])]),a("h2",{attrs:{id:"执行shell命令"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#执行shell命令"}},[s._v("#")]),s._v(" 执行shell命令")]),s._v(" "),a("p",[s._v("从上面的文章我们可以了解到, 默认情况下，"),a("code",[s._v("spawn")]),s._v("并不会创建一个"),a("code",[s._v("shell")]),s._v("来执行我们传入的命令。")]),s._v(" "),a("p",[s._v("这个行为使得它比"),a("code",[s._v("exec")]),s._v("函数效率更高，但是有时我们又确实需要执行"),a("code",[s._v("shell")]),s._v("命令，那这个时候我们怎么使用"),a("code",[s._v("spawn")]),s._v("来执行呢？要知道"),a("code",[s._v("exec")]),s._v("函数会缓存输出结果一次性返回给我们，而"),a("code",[s._v("spawn")]),s._v("则是使用流的形式。如果我们的命令数据数据规模较小，那使用exec的确是个不错的选择，但在大多数情况下，使用"),a("code",[s._v("spawn")]),s._v("将会是更合理、更安全的方式")]),s._v(" "),a("p",[s._v("那么如果使用"),a("code",[s._v("spawn")]),s._v("来执行shell命令呢？")]),s._v(" "),a("ol",[a("li",[s._v("最简单的，就是设置shell参数")])]),s._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 设置为true")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("spawn")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'npm run dev'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("shell"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("true")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 指定终端")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("spawn")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'npm run dev'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("shell"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'bash'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])])]),a("ol",{attrs:{start:"2"}},[a("li",[s._v("也可以运行指定终端来执行命令")])]),s._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 直接传入shell命令")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("spawn")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'bash'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'npm'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'run'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'dev'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 通过stdin.write写入命令")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" bash "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("spawn")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'bash'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\nbash"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("stdin"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("write")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'npm run dev'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\nbash"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("stdin"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("end")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])])])])}),[],!1,null,null,null);t.default=e.exports}}]);