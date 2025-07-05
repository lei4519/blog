---
tags:
  - Vim
  - Rime
  - IME
created: 2024-05-13T15:09:00
share: "true"
issue: "85"
updated: 2024-05-14T07:29
---
  
## TL;DR  
  
借助 `lua_processor`，自行实现 `vim_mode` 的中英文切换逻辑，使其支持：  
- Linux 系统  
- 重新进入 `insert mode` 时自动切换回中文模式（如果离开时是处于中文模式的话）  
  
> 这并不是一个完美的解决方案，可能达不到 100% 的使用效果，但是在普通的情况下已经足以使用  
  
## 使用方法  
  
可以参考此 [feat: vim\_mode](https://github.com/lei4519/rime-ice/commit/6a5db99263f5e2fef9fcddc628cbe1a639bdf18d)I  
  
### 引入 `vim_mode.lua` 文件  
  
首先将 [vim_mode.lua](https://github.com/lei4519/rime-ice/blob/main/lua/vim_mode.lua) 文件放入自己的 `lua` 文件夹中，并在 `rime.lua` 中进行导出  
  
```lua  
vim_mode = require("vim_mode")  
```  
  
### 加入 `lua_processor`  
  
在自己的中文输入方案中，加入 `lua_processor`  
  
比如我使用的是小鹤双拼，所以我修改 `double_pinyin_flypy.custom.yaml`，加入如下逻辑  
  
```yaml  
patch:  
  # 加入 lua_processor  
  engine/processors/@before 0: lua_processor@vim_mode  
  # 默认关闭 vmode，只在对应的 app 中打开  
  switches/+:  
    - name: vmode  
      reset: 0  
```  
  
### 配置 `app_options`  
  
在对应平台的 `.custom.yaml` 中配置在什么应用下启用 `vmode`  
  
比如 macOS 的 `squirrel.custom.yaml`  
  
```yaml  
patch:  
  app_options:  
    org.alacritty:  
      ascii_mode: true  
      vmode: true  
    net.kovidgoyal.kitty:  
      ascii_mode: true  
      vmode: true  
```  
  
## 实现思路与原因  
  
### 起因  
  
我觉得 `vim_mode` 的确是一个非常好的功能，尤其是我这种既要用 `Obsidian`，又要用 `Terminal`，偶尔还要用 `VSCode` 的人  
  
虽然这些软件中都有类似 `im-select` 之类的切换插件，但是每个软件中都需要单独安装，且不同的操作系统，配置还可能不一样（比如我自己就在 macOS 和 Linux 下频繁切换）  
  
所以如果能有一个 IM 级别的 `vim_mode` 切换解决方案，那真是再好不过了  
  
可是目前的 `vim_mode` 有两个问题：  
1. 由前端实现，Linux 中不支持此功能  
2. 在中文模式下，切换到 `normal mode`，再进入 `insert mode`，会保持 `ascii mode`，而不会自动切换会中文模式  
	- 像 `im-select` 就会自动切换回中文模式  
  
### 思路  
  
搜索之后发现并没有一个现成的解决方案，但是却有大佬写过类似的逻辑，比如  
- [如何在Windows/Linux下的Rime使用Vim模式 - 知乎](https://zhuanlan.zhihu.com/p/654489636)  
- [能否获取当前在什么应用下嘛 · Issue #294 · hchunhui/librime-lua · GitHub](https://github.com/hchunhui/librime-lua/issues/294)  
  
稍微组合一下，就有了本文的解决方案  
  
---  
  
通过 `switches` 配置 `vmode`，再通过 `app_options` 配置在相应应用下打开 `vmode` ，即可实现原生的 `vim_mode` 在指定应用下开启的效果  
  
利用 `lua_processor` 对按键输入进行处理，如果当前应用处于 `vmode` 下，就进行相关的逻辑处理  
  
> 如 [有考虑加入win端和macos端的vim mode · Issue #84 · fcitx/fcitx5-rime · GitHub](https://github.com/fcitx/fcitx5-rime/issues/84) 中所说，rime 是无法感知应用处于什么模式的（vim）    
> 同样我们也无法知道应用处于什么模式，只能是根据 vim 的常规操作逻辑去大致的处理一下  
  
思路如下：  
  
在开启了 `vmode` 的应用中  
- 如果按下了 `esc` 键，就认为要切换到 `normal mode`  
	- 如果此时处于中文模式，就自动切换到英文模式，并记录中文状态  
- 如果处于 `normal mode`，并且按下了 `i/a/o/c` 等会进入插入模式的按键  
	- 如果之前是中文状态，就自动切换回中文状态  
  
## Ref  
  
- [请问linux 下支持“针对特定程序使用英文模式”功能吗？ · Issue #40 · fcitx/fcitx5-rime · GitHub](https://github.com/fcitx/fcitx5-rime/issues/40)  
- [请问 fcitx5-rime 有没有切换中英文的命令 · Issue #30 · fcitx/fcitx5-rime · GitHub](https://github.com/fcitx/fcitx5-rime/issues/30)  
