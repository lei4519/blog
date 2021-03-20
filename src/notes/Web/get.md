# 安全的对象属性获取 - get

```js
const get = (obj, propStr, defaultValue) => {
  try {
    const props = propStr.split('.')
    let value = obj
    while (props.length) {
      value = value[props.shift()]
    }
    return value || defaultValue
  } catch (e) {
    return defaultValue
  }
}
```