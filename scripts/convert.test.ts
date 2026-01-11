import { describe, it, expect } from "vitest";
import { convert } from "./convert";

describe("convert", () => {
  it("should parse metadata correctly", () => {
    const title = "PC 端 REM 布局 - 非 Chrome 浏览器字号小于 12px 的解决方案";
    const content = `
---
tags:
  - FE
  - PC
share: "true"
issue: "50"
created: 2020-03-01T20:12
---

haha
`;

    const { metaData, issueContent, blogContent } = convert(title, content);

    // Test metadata
    expect(metaData.share).toBe("true");
    expect(metaData.issue).toBe(50);
    expect(metaData.created).toBe("2020-03-01");
    expect(metaData.tags).toStrictEqual(["FE", "PC"]);

    // Test blog content
    expect(blogContent).toBe(`---
tags:
  - FE
  - PC
share: 'true'
issue: 50
created: '2020-03-01'
title: PC 端 REM 布局 - 非 Chrome 浏览器字号小于 12px 的解决方案
description: PC 端 REM 布局 - 非 Chrome 浏览器字号小于 12px 的解决方案
---


haha
`);

    // Test issue content
    expect(issueContent).toBe(`<p align="right"><time>2020-03-01</time></p>

haha
`);
  });

  it("should handle metadata with custom title and description", () => {
    const title = "PC 端 REM 布局 - 非 Chrome 浏览器字号小于 12px 的解决方案";
    const content = `
---
title: "PC 端 REM 布局"
description: "非 Chrome 浏览器字号小于 12px 的解决方案"
---

haha
`;

    const { metaData, issueContent, blogContent } = convert(title, content);

    expect(issueContent).toBe(`
haha
`);

    expect(blogContent).toBe(`---
title: PC 端 REM 布局
description: 非 Chrome 浏览器字号小于 12px 的解决方案
---


haha
`);
  });

  it("should handle block quotes", () => {
    const title = "PC 端 REM 布局";
    const content = `
> [!TIP]
> 123
> 456
> 789

>  [!TIP ] Title
> 123
> 456
> 789
\`\`\`
`;

    const { metaData, issueContent, blogContent } = convert(title, content);

    expect(blogContent.trim()).toBe(
      `
---
title: PC 端 REM 布局
description: PC 端 REM 布局
---

> **TIP**  \n>  \n> 123
> 456
> 789

> **TIP**  \n>  \n> 123
> 456
> 789
\`\`\`
`.trim(),
    );

    expect(issueContent.trim()).toBe(
      `
> [!TIP]
> 123
> 456
> 789

>  [!TIP] Title
> 123
> 456
> 789
\`\`\`
`.trim(),
    );
  });

  it("should handle links and images", () => {
    const title = "PC 端 REM 布局 - 非 Chrome 浏览器字号小于 12px 的解决方案";
    const content = `
测试，![IMG_3655](../attachments/IMG_3655.jpg)，测试，[ArchWiki](https://wiki.archlinux.org/) //测试，[Vim ESC 键的解决方案](../54/Vim%20ESC%20%E9%94%AE%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88.md)

![RSC.excalidraw](../Excalidraw/RSC.svg)
`;

    const { metaData, issueContent, blogContent } = convert(title, content);

    expect(blogContent.trim()).toBe(
      `---
title: PC 端 REM 布局 - 非 Chrome 浏览器字号小于 12px 的解决方案
description: PC 端 REM 布局 - 非 Chrome 浏览器字号小于 12px 的解决方案
---

测试，![IMG_3655](https://raw.githubusercontent.com/lei4519/blog/main/notes/attachments/IMG_3655.jpg)，测试，[ArchWiki](https://wiki.archlinux.org/) //测试，[Vim ESC 键的解决方案](./54)

![RSC.excalidraw](https://raw.githubusercontent.com/lei4519/blog/main/notes/Excalidraw/RSC.svg)`.trim(),
    );

    expect(issueContent.trim()).toBe(
      `
测试，![IMG_3655](https://raw.githubusercontent.com/lei4519/blog/main/notes/attachments/IMG_3655.jpg)，测试，[ArchWiki](https://wiki.archlinux.org/) //测试，[Vim ESC 键的解决方案](https://github.com/lei4519/blog/issues/54)

![RSC.excalidraw](https://raw.githubusercontent.com/lei4519/blog/main/notes/Excalidraw/RSC.svg)
`.trim(),
    );
  });

  it("should throw error for unresolved internal link without issue", () => {
    const title = "PC 端 REM 布局 - 非 Chrome 浏览器字号小于 12px 的解决方案";
    const content = `
[202404071232 Trade Off](../202404071232%20Trade%20Off.md)
`;

    expect(() => convert(title, content)).toThrow(
      /Internal links without issue property/,
    );
  });

  it("should throw error for unresolved relative path with unknown extension", () => {
    const title = "PC 端 REM 布局";
    const content = `
[202404071232 Trade Off](../202404071232%20Trade%20Off.webp1)
`;

    expect(() => convert(title, content)).toThrow(/Unknown relative path/);
  });

  it("should match image extensions correctly", () => {
    const imgReg = /\.(jpg|png|svg|jpeg|webp)$/;

    expect(imgReg.test("123.jpg")).toBe(true);
    expect(imgReg.test("123.png")).toBe(true);
    expect(imgReg.test("123.svg")).toBe(true);
    expect(imgReg.test("123.jpeg")).toBe(true);
    expect(imgReg.test("123.jpg1")).toBe(false);
    expect(imgReg.test("123.webp")).toBe(true);
  });
});
