---
tags:
  - Blog
  - Obsidian
  - HowTo
description: 利用 obsidian 发布文章到 github issue、jekyll blog、知乎等
created: 2024-04-16T20:00
issue: "77"
share: "true"
updated: 2024-05-17T16:52
---
  
## 前言  
  
在 [卡片笔记法](../73/%E5%8D%A1%E7%89%87%E7%AC%94%E8%AE%B0%E6%B3%95.md) 中提到我是如何开始、进行个人知识管理，与自己对话  
  
其中的知识体（永久笔记）是可以分享出来，所以就有了这篇文章，记录下自己是如何使用 Obsidian 来方便的将文章进行发布、分享  
  
## 流程  
  
利用 `obsidian-github-publisher` 插件对内链和附件进行转换处理，自动提交合并 MR  
  
然后在 github actions 中利用代码对内容做二次处理（这是因为插件功能太少，不够灵活）  
  
github actions 内容处理完成，进行发布动作（issue/Blog/知乎/公众号...）  
  
具体代码参考 [blog](https://github.com/lei4519/blog) 仓库  
  
## Issue Blog  
  
先说一下为什么要把文章（主要）发到 issue  
  
1. 希望博客的地址稳定、方便评论交流、方便别人查看自己其他信息，所以 github 固然是最好的选择  
2. 方便观看者 `star/watch`  
3. issue 天然对内链的预览、引用处理  
  
发到其他地方纯粹是为了 SEO  
  
## 插件配置  
  
> [!tip]    
> 踩坑：publisher 的链接转换必须是 `[[]]` 风格的才行    
> 所以要先关闭 ob 本身的链接格式转换，避免自转换成 `[]()` 格式  
  
Github 仓库配置根据教程来就行，不赘述  
  
### File Path  
  
根据 `property - issue` 生成目录  
  
发布前先在 Github issue 创建一个对应的 issue，记录下 issue id 放在文章的 metadata 中  
  
---  
  
这一步其实也可以自动化，但是我个人觉得没有必要，就没有做  
  
因为发布的整个流程中我一定会打开 GitHub 的，所以多做一步新建也无所谓  
  
而且这个主动的操作可以防止误发（比如内链了未发布的文章）  
  
### Content  
  
将 `Convert internal links pointing to unpublished notes` 打开  
  
> 因为我觉得链接了内链，说明其是有承上启下的作用的，所以不能直接删除或不做处理  
>  
> 但其实我还留了个后门，对于某些文章我可能先写了「上篇」，想先发布，此时可以给内链前加上 TODO 的标记 `- [ ]` 也可以跳过检查  
  
插件只负责内容的转换，校验相关的事情放在 `github actions` 中做  
  
### Attachment - Embed Notes  
  
选择 `transform link` 内容填空  
  
将内嵌的链接从 `![[]]` 变成 `[[]]`，这样发布之后就是一个正常的内链了  
  
---  
  
其他配置根据自己的需要配置  
  
`metadata` 中最好记录上文章的创建/发布时间，方便后续排序/展示使用，可以使用 `Update time on edit` 插件  
  
## Workflow  
  
文章写完通过 `obsidian-github-publisher ` 发布，其会创建 、自动合并 PR（需要配置）  
  
触发 `github actions` 后，流程如下  
  
### Action  
  
代码合并之后会触发主分支的 github action 构建流程  
  
综上所述在发布文章时一定会先获得并填入一个 issue id，所以如果内链的地址没有 issue id，说明这篇文章还没有准备好发布  
  
此时就校验失败，阻断 Workflow 就好  
  
首先通过 git diff 找出本次提交中变更的文件列表，筛选出文章路径后，依次进行处理  
  
#### 文章内容处理  
  
主要是内链和 metadata 的处理，Blog 与 issue 之间并不相同，所以要存两份数据单独处理  
  
以及处理过程中收集每一篇文章的 metadata 信息，后面要用  
  
##### 内链  
  
首先是本地图片路径，直接转换成 git 仓库的绝对路径，示例如下  
  
```  
https://github.com/$username/$blogname/blob/main/$assets_path.png  
```  
  
然后是文章的内链，对于 Blog 可以直接转换成 `./issue_id` 的相对路径  
  
而对于 `issue` 来说则必须是绝对路径，否则无法触发 hover 预览  
  
```  
https://github.com/$username/$blogname /issues/$issue_id  
```  
  
##### Metadata  
  
issue 不需要 metadata，所以直接丢弃掉即可  
  
而对 Blog 则根据情况自动补充一些冗余的属性  
  
比如我用的 jekyll blog，其可以配置 permalink 来生成固定的文章地址，所以我就会把 issue 映射到 permalink 上  
  
---  
  
每篇内容处理完后，把 blog 的内容写入到仓库的对应 md 文件中，后续 jekyll 会根据这些文件生成博文  
  
此时可以通过 API 把 issue 内容发布到 issue 上，这样 issue 的部分就处理完毕了  
  
##### Jekyll Blog 文件  
  
当所有内容处理结束后，将收集的 metadata 信息写入到仓库中，以方便下次更新时使用  
  
通过 metadata 生成博客首页数据（index.md），其实就是根据时间排序的文章链接列表  
  
然后把修改后的 Blog 文件内容写入到 `docs/` 文件夹下，后面合并到主分支后会自动触发部署动作  
  
##### Github Readme  
  
同样再通过 metadata 生成 Github 首页数据（README.md），将跳转链接指向 issue 中  
  
此时 Github issue 上的工作就已经全部完成了  
  
之后通过 job 开始部署 Jekyll Blog 就完成了所有部分  
  
### Jekyll 补充  
  
由于我不熟悉 ruby 的语法，以及 github-pages 中有很多插件的限制，所以有些不重要（SEO）的功能就直接用 JS 去实现了  
  
> [!tip]    
> 最主要是 ruby 的依赖问题搞得心累，装上个插件就各种崩…  
  
#### 分页  
  
上面说到所有文章的 Metadata 信息都被收集并保存在了本地，这个会被 jekyll 发布到网站中，进而可以通过 JS 直接获取  
  
能拿到所有文章的信息，再和当前文章做对比，自然就可以渲染出「上一篇」「下一篇」了  
  
#### Tags  
  
同上，创建一个单独的 `tags` 页面，其中用 JS 做分类渲染、筛选功能  
  
从 `tags` 页进入的文章，URL 上会携带 `tag` query，进而调整分页的渲染逻辑  
  
### 知乎、掘金，公众号…  
  
actions 中是可以使用无头浏览器的，所以理论上都可以做，但我目前还没时间搞，后面搞了再补充  
