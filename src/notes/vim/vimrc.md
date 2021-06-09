# Vim 相关配置

## Vundle 插件管理工具
用来管理vim插件的安装、删除、升级，安装方式参考 [官方github](https://github.com/VundleVim/Vundle.vim)

### 基本用法

1. 将想要安装的包写到 `call vundle#begin()` 和 `call vundle#end()` 之间
2. 保存 `.vimrc` 文件后再次进入 `vim`，然后执行 `:PluginInstall`
3. 移除插件时将插件名称删除，然后保存并运行 `:BundleClean`


## 中文输入法切换问题（Mac 解决方案）

使用 [ybian/smartim](https://github.com/ybian/smartim) 进行输入法的自动切换，进入 `normal` 模式后自动切换至默认输入法。

1. 使用 Vundle 安装插件
   - `Plugin 'ybian/smartim' `
2. 配置 `normal` 模式的默认输入法
   1. 使用命令获取输入法名称 `~/.vim/bundle/smartim/plugin/im-select`
   2. 将名称配置到 `.vimrc` 中：`let g:smartim_default = 'com.apple.keylayout.ABC'`

## surround

快速的给选中文本两侧添加符号：`"`/`'`/`()` 等等，参考 [官方github](https://github.com/tpope/vim-surround)

使用 Vundle 安装：`Plugin 'surround.vim'`


