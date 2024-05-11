---  
tags:  
  - Git  
  - Explanation  
share: "true"  
issue: 40
created: 2020-09-14
title: Git Book 笔记
description: Git Book 笔记
permalink: "40"
---  
  
1. Git & Svn 差异点，理解 Git 工作模式  
2. Git 的基本原理，如果进行版本控制，分支是什么？  
3. 模拟实际开发场景  
4. 梳理日常开发时的 Git 使用流程  
5. 使用 Vscode 对第三步进行实操  
  
## Git & Svn 区别  
  
### Svn: 集中化版本控制系统  
  
<img src="https://git-scm.com/book/en/v2/images/centralized.png" alt="集中化的版本控制图解" style="zoom:50%;" />  
  
### Git: 分布式版本控制系统  
  
 <img src="https://git-scm.com/book/en/v2/images/distributed.png" alt="分布式版本控制图解" style="zoom:50%;" />  
  
- 拉取项目命令差异点  
  - `svn checkout http://...`  
  - `git clone  http://...`  
  
### 版本库  
  
- 工作（项目）目录有一个隐藏目录 `.git`，这个就是 Git 的版本库。  
  
### 本地操作  
  
- 远程仓库同步版本库  
- 版本控制操作都是本地操作  
- 查看 log、回退版本、提交版本、合并分支、创建分支  
- 分功能点进行提交，确保后续开发不会影响已开发完成的功能，快速定位 功能 Bug。  
  - 主题色功能实现 commit  
  - 历史记录功能实现 commit  
  - 拖拽区功能实现 commit  
- Svn commit 依赖于网络和 VPN  
  
## Git 的设计目标（特点）  
  
> Linus 用来管理 Linux 源码。（Linus 自己用 C 语言花了两周时间写的）  
>  
> Linux 系统：开源项目，由全世界的热心志愿者共同完成的。  
  
- 速度  
- 简单的设计  
- 完全分布式  
- 有能力高效管理类似 Linux 内核一样的超大规模项目（速度和数据量）  
- **对非线性开发模式的强力支持（允许成千上万个并行开发的分支）**  
  - 分支工作流  
  
## Git 基本工作原理，如何进行版本控制？  
  
> Git 对每一次提交直接记录文件快照，而非差异比较  
  
### Svn **记录差异**  
  
- 存储的信息是一组基本文件和每个文件每次提交所产生的差异  
  
![存储每个文件与初始版本的差异。](https://git-scm.com/book/en/v2/images/deltas.png)  
  
### Git 记录快照  
  
- 对提交的文件创建一个快照（blob 对象）  
  
![Git 存储项目随时间改变的快照。](https://git-scm.com/book/en/v2/images/snapshots.png)  
  
## 快照的创建  
  
### 首次提交  
  
- 假设有一个新的 git 仓库，我们来创建三个新的文件：README、test.rb、LICENSE，并将这三个文件提交到版本库。  
  
```console  
$ touch README test.rb LICENSE  
$ git add README test.rb LICENSE  
$ git commit -m 'The initial commit of my project'   git cz  
```  
  
- `git add` 暂存操作：为工作区中已修改的文件创建快照  
  - 暂存操作会为每一个修改文件计算校验和（SHA-1 算法），然后会把当前版本的文件快照保存到 Git 仓库中，最终将校验和（索引）加入到暂存区等待提交  
  - 暂存区：暂时存储文件快照，并未提交至版本库  
  - 场景：某一个功能开发到了 60%，觉得有另一种实现方案想去尝试。但是 60% 的功能不值得我们做一次提交记录，如果直接尝试新的方案，等发现方案不可行的时候，需要自己一步步的回退代码。暂存区可以暂时存储这 60% 的代码，一旦发现新方案不可行，直接将新方案的修改进行全部撤回即可。  
- `git commit` 提交版本库  
  - 创建树对象，记录着目录结构和文件快照索引（可以理解为整个项目的快照）  
  - 创建提交对象，保存**树**对象和所有的提交信息（作者姓名、邮箱、提交信息）  
  
    ![首次提交对象及其树结构。](https://git-scm.com/book/en/v2/images/commit-and-tree.png)  
  
### 再次提交  
  
- 重复上述操作，这次的提交对象会包含一个指向上次提交对象的指针  
  
![提交对象及其父对象。](https://git-scm.com/book/en/v2/images/commits-and-parents.png)  
  
## 分支的原理  
  
- Git 分支的本质，记录了某一个提交对象索引（校验和）的文件。  
- `.git/refs/heads`  
- Git 初始化时会自动创建一个默认分支 `master`，`.git/refs/heads/master`  
- 每次提交时当前分支会自动指向最新的提交对象。  
  
### 分支创建  
  
```console  
$ git branch testing  
```  
  
- 在 `.git/refs/heads` 中创建了 `testing` 文件  
- 通过 `HEAD` 的指针区分所在分支，`HEAD` 总是指向当前所在的分支  
- `git branch` 命令仅仅 **创建** 一个新分支，并不会自动切换到新分支中去  
  
![HEAD 指向当前所在的分支。](https://git-scm.com/book/en/v2/images/head-to-master.png)  
  
### 分支切换  
  
```console  
$ git checkout testing  
```  
  
- `HEAD` 就指向 `testing` 分支  
  
![HEAD 指向当前所在的分支。](https://git-scm.com/book/en/v2/images/head-to-testing.png)  
  
### 分支总结  
  
- Git 的分支实质上仅是包含所指对象校验和（长度为 40 的 SHA-1 值字符串）的文件，所以它的创建和销毁都异常高效。创建一个新分支就相当于往一个文件中写入 41 个字节（40 个字符和 1 个换行符）  
- 其他大多数版本控制系统在创建分支时，需要将所有的项目文件都复制一遍，并保存到一个特定的目录。完成这个过程所需时间的长短，完全取决于项目的规模。  
- 而在 Git 中，任何规模的项目都能在瞬间创建新分支。同时，由于每次提交都会记录父对象，所以在分支合并时也是同样的简单和高效。  
- 这些高效的特性使得 Git 鼓励开发人员频繁地创建和使用分支。  
  
## 实际场景模拟  
  
- marset 分支：线上分支  
- iss53 分支：开发分支  
- 起点：项目 1.0 版本开发测试完成，将开发分支的代码合并到主分支上，部署上线  
  
![创建一个新分支指针。](https://git-scm.com/book/en/v2/images/basic-branching-2.png)  
  
- 开发 2.0 版本，并进行一些功能提交，线上版本依旧指向发版时的提交对象  
  
  ![`iss53` 分支随着工作的进展向前推进。](https://git-scm.com/book/en/v2/images/basic-branching-3.png)  
  
- 线上版本紧急 BUG  
  
  1. 切换回 `master` 分支  
  
     - 当前开发分支工作目录和暂存区里还有没被提交的修改，这些改动可能会和主分支产生冲突，从而阻止 Git 切换到主分支。  
     - 切换时需要将修改进行暂存操作 `git stash` 或者提交操作 `git commit`  
     - 永远不会在 `master` 分支中进行代码开发，`master` 分支的代码都是合并的别的分支，以此保证 `master` 分支的稳定性（线上版本的稳定性）  
  
  2. 新建紧急修复 `hotfix` 分支，在该分支上工作直到问题解决，并提交修改。  
  
     ![基于 `master` 分支的紧急问题分支（hotfix branch）。](https://git-scm.com/book/en/v2/images/basic-branching-4.png)  
  
  3. `master` 合并 `hotfix` 分支，测试部署上线  
  
     ```console  
     $ git checkout master  
     $ git merge hotfix  
     Fast-forward  
     ```  
  
     - 快进（Fast-forward）  
       - 要合并的分支所指向的提交对象是你所在分支的提交对象的直接后继，Git 会直接将指针向前移动，因为这种情况下的合并操作没有需要解决的分歧  
  
     ![`master` 被快进到 `hotfix`。](https://git-scm.com/book/en/v2/images/basic-branching-5.png)  
  
  4. 删除 `hotfix` 分支，因为我们已经不再需要它了——`master` 分支已经指向了同一个位置  
  
     ```console  
     $ git branch -d hotfix  
     ```  
  
  5. 回到开发分支继续工作  
  
     - `hotfix` 分支所做的修改，并没有合并到开发分支上  
  
1. 使用 `git merge master` 命令将 `master` 分支合并入 开发分支（推荐）  
2. 等到 开发分支开发完成，再将其合并回 `master` 分支  
  
- 以上两种操作，在 git 的使用上没有区别，都是合并操作。  
  
![继续在 `iss53` 分支上的工作。](https://git-scm.com/book/en/v2/images/basic-branching-6.png)  
  
1. 2.0 开发测试完成，将开发分支的代码合并到主分支上，部署上线  
  
   ```console  
     $ git checkout master  
     $ git merge iss53  
     Merge made by the 'recursive' strategy. 通过“递归”策略进行合并。  
   ```  
  
   - `master` 分支所在提交对象并不是 `iss53` 分支所在提交对象的直接祖先，Git 会使用两个分支的末端所指的快照（`C4` 和 `C5`）以及这两个分支的公共祖先（`C2`），做一个三方合并  
  
   ![一次典型合并中所用到的三个快照。](https://git-scm.com/book/en/v2/images/basic-merging-1.png)  
  
   - Git 会将合并的结果做了一个新的快照并且自动创建一个新的提交指向它。  
   - 这种提交被称为合并提交，因为他不止有一个父提交对象。  
  
     ![一个合并提交。](https://git-scm.com/book/en/v2/images/basic-merging-2.png)  
  
### 合并冲突  
  
- 如果我们在两个不同的分支中，对同一个文件的同一个部分进行了不同的修改，Git 就没法干净的合并它们。  
- 此时 Git 做了合并，但是没有自动地创建一个新的合并提交。Git 会暂停下来，等待你去解决合并产生的冲突。  
- 确定之前有冲突的的文件都已经暂存了，输入 `git commit` 来完成合并提交。默认情况下提交信息看起来像下面这个样子：  
  
  ```console  
  Merge branch 'iss53'  
  
  Conflicts:  
      index.html  
  #  
  # It looks like you may be committing a merge.  
  # If this is not correct, please remove the file  
  #	.git/MERGE_HEAD  
  # and try again.  
  
  
  # Please enter the commit message for your changes. Lines starting  
  # with '#' will be ignored, and an empty message aborts the commit.  
  # On branch master  
  # All conflicts fixed but you are still merging.  
  #  
  # Changes to be committed:  
  #	modified:   index.html  
  #  
  ```  
  
- 如果你觉得上述的信息不够充分，不能完全体现分支合并的过程，你可以修改上述信息，添加一些细节给未来检视这个合并的读者一些帮助，告诉他们你是如何解决合并冲突的，以及理由是什么。  
  
### 中断一次合并  
  
- 我们可能不想处理冲突这种情况，可以通过 `git merge --abort` 来简单地退出合并  
  
  ```console  
  $ git merge --abort  
  ```  
  
  - `git merge --abort` 选项会尝试恢复到运行合并前的状态。  
  - 合并前确保工作目录中的修改都被提交或暂存。不然此命令会导致那些未被保存的修改也被恢复到修改之前的状态。  
  
### 忽略空白  
  
- 如果一次合并中有大量关于空白的问题，你可以直接中止它并重做一次，这次带上以下参数之一  
  - `-Xignore-all-space whitespace`：在比较行时 **完全忽略** 空白修改  
  - `-Xignore-space-change whitespace`：将一个空白符与多个连续的空白字符视作等价的  
  - 如果你的团队中的某个人可能不小心重新格式化空格为制表符或者相反的操作，这会是一个救命稻草  
  
### 变基  
  
- 和 `merge` 一样，用来合并分支  
- 合并方案是：将当前分支的所有提交操作，在变基分支上重新执行一遍。  
- 需要合理使用，否则会导致别人提交的代码丢失。  
- `merge` 合并时会产生很多无用的 Merge 信息，尤其是多分支开发合并时，时间长了之后整个项目提交信息会非常杂乱。  
- 历史记录清晰，看起来就像是在一个分支中开发的代码。方便版本回退和 bug 追查。  
- 黄金法则：在本地分支中对使用变基来更新线上分支代码。  
- 大多数公司不使用变基，只是用合并  
  - merge 可以实现结果，不在乎日志是否杂乱。  
  - 变基概念不好理解，在错误的工作流上使用，会导致别人的工作成果完全丢失。  
  
## 运程仓库  
  
- 下载远程仓库  
  
  1. `git clone 仓库地址`  
  2. 本地初始化 git 仓库  
  
  ```console  
  $ git init  
  $ git add .  
  $ git commit -m 'initial project version'  
  $ git remote add origin git@github.com  
  $ git push -u origin master  
  ```  
  
- `git pull` 拉取远程仓库代码  
- `git push` 推送本地仓库至远程仓库  
  
### 分支开发工作流  
  
- `master` 线上分支：绝对稳定，此版本代码可以随时发布线上，总是合并 `test` 测试分支或紧急修复分支代码。  
- `test` 测试分支：提交测试线的代码，总是合并 `develop` 测试分支代码。  
- `develop` 开发分支：共享分支，总是合并本地分支代码。  
- 临时、修复、功能分支：本地分支，各功能开发，开发完成合并入开发分支。  
  - 三个线上分支总是在合并代码，不要直接在这三个分支上进行代码开发。  
  
  ![趋于稳定分支的工作流（“silo”）视图。](https://git-scm.com/book/en/v2/images/lr-branches-2.png)  
  
## 打标签  
  
- 提交对象的索引是 hash 值，不容易记录，标签就是给提交对象定义个别名。  
- `git tag <tagname>` 给当前分支打标签，也可以在后面指定一个 commit id，给对应的提交对象打标签。  
- `git tag -a <tagname> -m "blablabla..."` 可以指定标签信息。  
- 命令 `git tag` 可以查看所有标签。  
- 命令 `git push origin <tagname>` 可以推送一个本地标签。  
- 命令 `git push origin --tags` 可以推送全部未推送过的本地标签。  
- 命令 `git tag -d <tagname>` 可以删除一个本地标签。  
- 命令 `git push origin :refs/tags/<tagname>` 可以删除一个远程标签。  
  
## 实际开发流程  
  
1. 使用 `git clone` 下载仓库  
2. 基于 `develop` 分支创建本地分支，开发过程中针对每个功能点进行提交记录。  
3. 开发完成后：  
   1. 切换至开发分支，使用 `git pull`，拉取开发分支最新代码。  
   2. 切换至本地分支，并确保本地分支的代码已全部提交或暂存，这使得我们变基过程中可以随时变基过程中所尝试的所有事情。  
   3. 使用 `git rebase develop` 合并开发分支的代码，如有代码冲突，解决后需要重新提交合并对象。  
   4. 切换至开发分支，使用 `git merge` 合并本地分支，使用 `git push` 推送远程仓库。  
4. 切换至测试分支，使用 `git pull` 拉取最新代码。  
5. 使用 `git merge develop` 合并开发分支代码，使用 `git push` 推送远程仓库，部署测试。  
6. 测试完成，切换至 `master` 分支，使用 `git pull` 拉取最新代码。  
7. 使用 `git merge test` 合并测试分支代码，使用 `git push` 推送远程仓库，部署上线。  
8. 需要修复紧急线上 bug，在 `master` 分支新建紧急修复分支，修复问题直到完成。  
9. 使用 `master` 分支合并紧急修复分支，推送远程仓库并部署。  
10. 在紧急修复分支执行第 3 步操作。将代码同步至开发分支。  
  
> 以上操作只会在 `git rebase` 时有可能会遇到代码冲突。所以上述所有 `merge` 操作都是快进操作。  
  
> git rebase -i 可以修改提交记录，具体可以查看官网教程 - 重写历史。应该只对本地分支进行操作。  
  
## Commit Message 规范  
  
> Commit message 一般包括三部分：Header、Body 和 Footer。  
  
### Header  
  
```  
type(scope):subject  
feat(表格): 增加表格下载功能  
```  
  
- type：用于说明 commit 的类别，规定为如下几种  
  - feat：新增功能；  
  - fix：修复 bug；  
  - docs：修改文档；  
  - refactor：代码重构，未新增任何功能和修复任何 bug；  
  - build：改变构建流程，新增依赖库、工具等（例如 webpack 修改）；  
  - style：仅仅修改了空格、缩进等，不改变代码逻辑；  
  - perf：改善性能和体现的修改；  
  - chore：非 src 和 test 的修改；  
  - test：测试用例的修改；  
  - ci：自动化流程配置修改；  
  - revert：回滚到上一个版本；  
- scope：【可选】用于说明 commit 的影响范围  
- subject：commit 的简要说明，尽量简短  
  
### Body  
  
对本次 commit 的详细描述，可分多行  
  
### Footer  
  
- 不兼容变动：需要描述相关信息  
- 关闭指定 Issue：输入 Issue 信息  
  
## 配置 Commit 提示工具  
  
首先，全局安装工具：  
  
```  
cnpm install commitizen cz-conventional-changelog-chinese -g  
```  
  
生成配置文件：  
  
```  
echo '{ "path": "cz-conventional-changelog-chinese" }' > ~/.czrc  
```  
  
提交时使用 `git cz` 代替 `git commit`  
  
⚠️ 注意要使用命令行进行代码提交，不要再使用 vscode 中的 Git 提交功能 (这个还是 `git commit`)  
  
## 为项目加入提交信息检查  
  
- 每次提交版本时自动检查提交信息是否符合规范  
  
  1. 安装依赖  
  
  ```  
  cnpm install --save-dev @commitlint/config-conventional @commitlint/cli husky  
  ```  
  
  2. 在项目根目录执行，生成配置文件  
  
     ```  
     echo 'module.exports = {  
       extends: ["@commitlint/config-conventional"],  
       rules: {  
         "type-enum": [  
           2,  
           "always",  
           [  
             "feat",  
             "fix",  
             "docs",  
             "refactor",  
             "build",  
             "style",  
             "perf",  
             "chore",  
             "deps",  
             "test",  
             "ci",  
             "revert"  
           ]  
         ]  
       }  
     }' > commitlint.config.js  
     echo '{  
       "hooks": {  
           "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"  
         }  
     }' > .huskyrc  
     ```  
  
## 为项目增加提交时 Eslint 检查和修复  
  
​ ⚠️ 只会校验和修复暂存区中的文件，如果想修复本地，可以执行 `npx eslint --fix --ext .js,.jsx,.ts,.tsx,.vue src`  
  
1. 安装依赖  
  
```shell  
cnpm i lint-staged --save-dev  
```  
  
1. 生成配置文件 `.lintstagedrc`  
  
```shell  
echo '{  
  "src/**/*.{js,jsx,txs,ts,vue}": "eslint --fix"  
}' > .lintstagedrc  
```  
  
1. 配置 `.huskyrc`，增加预提交钩子  
  
   ```shell  
   "hooks": {  
   	"pre-commit": "lint-staged --no-stash"  
   }  
   ```  
  
2. 配置完成后，提交代码时会自动做 Eslint 检查和修复，此步骤如果无法通过则需要重新提交代码。  
   1. 如有错误性 (errors) 问题，需要解决错误重新提交。  
   2. 如有提示性 (warning) 问题（代码格式化），会自动修复并将修改暂存（只是暂存，还是需要重新提交代码）。  
