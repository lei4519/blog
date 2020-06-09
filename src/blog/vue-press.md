# 博客配置

## 配置
改变docs为src后，修改文件不在自动变化，需要配置
extraWatchFiles: [
    '**/*.md',
    '**/*.vue'
  ]
## slidebar自动配置
使用nodejs fs模块，来自动读取目录生成slidebar配置。

