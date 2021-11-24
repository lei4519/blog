# Webpack

## 目标

运行 `node wp.js`，会打包`src`中的代码，并输出一个`dist.js`，`dist.js`正常运行。

```tree
- wp.js
- src
  - entry.js
  - a.js
  - b.js
  - c.js
```

## 打包

- 使用 `nodejs` 的 `fs` API读取入口文件并打包
- 分析入口文件依赖：require，并打包依赖文件
- 输出

### wp.js

```js
const fs = require('fs')
```

## 运行