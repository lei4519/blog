# vscode debug

## 当前文件debug
正常的配置，需要指定运行的文件路径，为了防止麻烦，我们可以配置为debug当前文件
核心代码：
```json
"args": [
  "${relativeFile}"
]
```

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "启动程序",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "args": [
        "${relativeFile}"
      ],
      "runtimeExecutable": "nodemon"
    }
  ]
}
```