// 测试代码
#[cfg(test)]
mod tests {

    use regex::Regex;

    use crate::convert;

    #[test]
    fn test_metadata() {
        let title = "PC 端 REM 布局 - 非 Chrome 浏览器字号小于 12px 的解决方案".to_string();
        let content = r#"
---
tags:
  - FE
  - PC
share: "true"
issue: "50"
created: 2020-03-01T20:12
---

haha
"#
        .to_string();

        let (meta_data, issue_content, blog_content) = convert(title, content);

        // 写出测试代码
        assert_eq!(meta_data.get("share"), Some(&"\"true\"".to_string()));
        assert_eq!(meta_data.get("issue"), Some(&"50".to_string()));
        assert_eq!(meta_data.get("created"), Some(&"2020-03-01".to_string()));
        assert_eq!(meta_data.get("tags"), Some(&"FE,PC".to_string()));

        assert_eq!(
            blog_content,
            r#"
---
tags:
  - FE
  - PC
share: "true"
issue: 50
created: 2020-03-01
title: PC 端 REM 布局 - 非 Chrome 浏览器字号小于 12px 的解决方案
description: PC 端 REM 布局 - 非 Chrome 浏览器字号小于 12px 的解决方案
permalink: "50"
---

haha
"#
        );
        assert_eq!(
            issue_content,
            r#"
<p align="right"><time>2020-03-01</time></p>

haha
"#
        );
    }

    #[test]
    fn test_metadata_desc() {
        let title = "PC 端 REM 布局 - 非 Chrome 浏览器字号小于 12px 的解决方案".to_string();
        let content = r#"
---
title: "PC 端 REM 布局"
description: "非 Chrome 浏览器字号小于 12px 的解决方案"
---

haha
"#
        .to_string();

        let (_, issue_content, blog_content) = convert(title, content);

        assert_eq!(
            issue_content,
            "

haha
"
        );
        assert_eq!(
            blog_content,
            r#"
---
title: "PC 端 REM 布局"
description: "非 Chrome 浏览器字号小于 12px 的解决方案"
---

haha
"#
        );
    }

    #[test]
    fn test_block_quote() {
        let title = "PC 端 REM 布局".to_string();
        let content = r#"
> [!TIP]  
> 123  
> 456  
> 789  
```
"#
        .to_string();

        let (_, issue_content, blog_content) = convert(title, content);

        assert_eq!(
            blog_content,
            r#"
> **TIP**  
>  
> 123  
> 456  
> 789  
```
"#
        );
        assert_eq!(
            issue_content,
            r#"
> [!TIP]  
> 123  
> 456  
> 789  
```
"#
        )
    }

    #[test]
    fn test_link() {
        let title = "PC 端 REM 布局 - 非 Chrome 浏览器字号小于 12px 的解决方案".to_string();
        let content = r#"
测试，![IMG_3655](../attachments/IMG_3655.jpg)，测试，[ArchWiki](https://wiki.archlinux.org/) //测试，[Vim ESC 键的解决方案](../54/Vim%20ESC%20%E9%94%AE%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88.md)    

![RSC.excalidraw](../Excalidraw/RSC.svg)  
"#
        .to_string();

        let (_, issue_content, blog_content) = convert(title, content);

        assert_eq!(
            blog_content,
            r#"
测试，![IMG_3655](https://raw.githubusercontent.com/lei4519/blog/main/docs/attachments/IMG_3655.jpg)，测试，[ArchWiki](https://wiki.archlinux.org/) //测试，[Vim ESC 键的解决方案](./54)    

![RSC.excalidraw](https://raw.githubusercontent.com/lei4519/blog/main/docs/Excalidraw/RSC.svg)  
"#
        );

        assert_eq!(
            issue_content,
            r#"
测试，![IMG_3655](https://raw.githubusercontent.com/lei4519/blog/main/docs/attachments/IMG_3655.jpg)，测试，[ArchWiki](https://wiki.archlinux.org/) //测试，[Vim ESC 键的解决方案](https://github.com/lei4519/blog/issues/54)    

![RSC.excalidraw](https://raw.githubusercontent.com/lei4519/blog/main/docs/Excalidraw/RSC.svg)  
"#
        )
    }

    #[test]
    #[should_panic]
    fn test_unresolve_link() {
        let title = "PC 端 REM 布局 - 非 Chrome 浏览器字号小于 12px 的解决方案".to_string();
        // 未发布的文章
        let content = r#"
[202404071232 Trade Off](../202404071232%20Trade%20Off.md)  
"#
        .to_string();

        convert(title, content);
    }

    #[test]
    #[should_panic]
    fn test_unresolve_link1() {
        let title = "PC 端 REM 布局".to_string();
        // webp 未处理的相对后缀
        let content = r#"
[202404071232 Trade Off](../202404071232%20Trade%20Off.webp)  
"#
        .to_string();

        convert(title, content);
    }

    #[test]
    fn img_reg() {
        let reg = Regex::new(r"\.(jpg|png|svg|jpeg)$").unwrap();

        assert!(reg.is_match("123.jpg"));
        assert!(reg.is_match("123.png"));
        assert!(reg.is_match("123.svg"));
        assert!(reg.is_match("123.jpeg"));
        assert!(!reg.is_match("123.jpg1"));
        assert!(!reg.is_match("123.webp"));
    }
}
