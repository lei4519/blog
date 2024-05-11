---  
tags:  
  - Vim  
  - HowTo  
share: "true"  
issue: 54
created: 2024-03-25
title: Vim ESC 键的解决方案
description: Vim ESC 键的解决方案
permalink: "54"
---  
  
`esc` 键的便利性直接决定了 vim 的使用体验，多数的解决方案是将 `caps lock` 映射为 `esc`，或者使用 `jj` / `jk` 等方案  
  
我的方案是将 `command(Mac)` 单击时映射为 `esc` 键，组合时仍然是原始功能  
  
思路是：`ctrl` / `alt` / `command` / `shift` 正常情况下都是组合使用的，单独点击是无意义的，所以通过映射将单击行为利用起来  
  
## Mac  
  
使用 [karabiner-elements](https://karabiner-elements.pqrs.org/) 的 `complex_modifications` 功能进行如下配置  
  
```json  
{  
  "profiles": [  
    {  
      "complex_modifications": {  
        "rules": [  
          {  
            "description": "Alone Command to Esc",  
            "manipulators": [  
              {  
                "from": {  
                  "key_code": "left_gui",  
                  "modifiers": {  
                    "optional": ["any"]  
                  }  
                },  
                "to": [  
                  {  
                    "key_code": "left_gui",  
                    "lazy": true  
                  }  
                ],  
                "to_if_alone": [  
                  {  
                    "key_code": "escape"  
                  }  
                ],  
                "type": "basic"  
              }  
            ]  
          }  
        ]  
      }  
    }  
  ]  
}  
```  
  
## Linux  
  
参考 [Arch Linux 系统配置篇 > 按键映射](./75)，或者使用 [xcape](https://github.com/alols/xcape)  
  
## Windows  
  
可以使用 [Capsicain](https://github.com/cajhin/capsicain) 实现，但是我用了这个之后老是出现按键延迟、粘连的现象  
  
> 这也是弃用 Windows 的一大原因  
  
 [AHK](https://www.autohotkey.com/) 也可以实现，但是我自己没玩明白  
