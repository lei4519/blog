---
id: knowledge base
aliases:
  - 知识库
tags:
  - LLM
  - Explanation
created: 2025-03-06T11:19:00
updated: 2025-07-05T14:44
share: "true"
issue: "115"
---

## 衡量指标

需要通过「人」使用 AI 时投入的精力来衡量 AI 的提效比例，而不能仅仅通过代码量或编码时间

`编写提示词 + 应用、检查 AI 代码` < `全人工写代码`

## 弱业务场景

在弱依赖现存代码 or 具有明确规律/规则的场景下，制定一套完善的提示词，AI 就能够很好的完成工作

比如：

- 根据后端技术方案生成 API 相关代码（API 请求、TS 类型、MOCK 数据等等
- 根据埋点文档生成埋点代码
- 根据图片生成 UI 代码
- 常规后台管理系统表格的增删改查
- 脚本、纯函数
- ...

## 强业务场景

真实的业务场景，往往有复杂的依赖关系和大量隐性的上下文信息

简单的复制粘贴需求，AI 无法理解、无法符合预期的完成修改

例如需求为：`创作者广场在「作者类型」下方添加新的筛选项：擅长内容，选项：体验种草、深度测评，交互同作者类型组件`

潜在的上下文可能如下：

- 创作者广场的代码文件在哪？
- 作者类型组件代码是什么样子？
- 后端参数是什么？
- ...

我们需要输入详细的上下文（需求、代码描述），AI 才「可能」符合预期的完成工作

- 需求内容：...
- 文件位置：...
- 组件代码: ...
- 代码规范：...
- 额外要求：筛选选项需要提取为常量定义...
  - 常量定义规则：...
- 等等...

但如果上下文是全人工编写，消耗精力可能会大于直接写代码，用 AI 的价值也就没有了

如何在减少人力（精力）投入的同时，让 AI 尽可能符合预期的，完成更多的工作，是需要探索的方向

## 现有 AI 工具的解决方案

L2: 辅助编程  
L3: 结对编程  
L4: 自主编程

---

参考产品：Cline/Cursor/WindSurf/Aider/Avante

核心思路：构建 AI Agent 能力，使得 AI 可以根据用户输入的少量信息，自主完善上下文后，再开始工作

### 基本能力

- 工具使用：具备读写文件的能力
- 任务拆解：能够对任务进行拆解，逐步完成
	- [Cline 递归链系统（CRCT）](https://github.com/RPG-fan/Cline-Recursive-Chain-of-Thought-System-CRCT-)
- 仓库索引：提供全局文件、代码信息
	- Cursor/Windsurf：RAG
		- [Codebase Indexing](https://docs.cursor.com/context/codebase-indexing) / [Local Indexing](https://docs.codeium.com/context-awareness/local-indexing)
		- [VectorCode](https://github.com/Davidyz/VectorCode)
	  - Aider
		  - [Git Repo Map](https://aider.chat/2023/10/22/repomap.html)
	  - Cline
		  - `git ls-files`

### 强化能力

- 自主信息收集：基于上述能力，根据需求自主读取相关文件，提取、完善上下文信息
	- 「规划/编码」双模式：[Aider](https://aider.chat/2024/09/26/architect.html) / [Cline](https://cline.bot/blog/why-ai-engineers-need-planning-more-than-perfect-prompts-2)
	    - 规划阶段：自主收集上下文信息，提供更多的信息
	    - 编码阶段：根据规划阶段的信息，自主完成编码任务
	- 自主记忆：根据历史对话内容，自动生成记忆，学习用户的偏好和仓库信息
		- [Roo cline 记忆库](https://github.com/GreatScottyMac/roo-code-memory-bank)
		- [Cline 记忆库](https://cline.bot/blog/memory-bank-how-to-make-cline-an-ai-agent-that-never-forgets)
		- [WindSurf 自动记忆](https://docs.codeium.com/windsurf/memories#auto-generated-memories)

### 模型能力

以上所有都基于模型本身的能力才得以发挥出应有的效果： [Cline 模型选择指南](https://docs.cline.bot/getting-started/model-selection-guide#llm-model-comparison-for-cline-feb-2025) / [本地模型的问题](https://docs.cline.bot/running-models-locally/read-me-first)  
- 规划阶段：使用推理模型效果更好：DeepSeek-R1、O1、O3 等  
- 代码阶段：`Claude 3.5 Sonnet` 在代码实现、工具使用、分步执行上表现最好

## 知识库（测试）

仅通过 RAG、索引等方式获取的信息不够

### 业务术语表

自然语言与代码命名（路径）的对应关系，前端可以通过 route 配置信息生成

- [routes.ts](/zhitask-site/-/blob/master/apps/biz/src/routes.ts)

```md fold
user: 分析当前文件，提取代码命名与业务术语的对应关系，比如：`特邀定制 invite`

ai:

以下是代码命名与业务术语的对应关系(按业务模块分组):

# 业务术语表

## 认证相关

代客登录 replace

## 协议相关

用户协议 agreement
服务商公示 publicity

## 邀约任务管理

特邀定制 invite/task
任务详情 task/:id
编辑任务 edit/:taskType/:taskId
发布任务 publish/:taskType

## 带货任务管理(merchandise)

优选带货 merchandise/task
带货创作者广场 pusquare
投后数据 effect/:id
投稿明细 contributions/:id
修改建议 remarks/:taskId/:contentType/:contentId
众邀任务(publicInvite)
众邀任务 publicInvite/task
众邀任务发布 publicInvite/publish
众邀任务投稿明细 publicInvite/task/:id/contributions
众邀任务修改建议页 publicInvite/remarks

## 搜索口碑任务(searchWord)

搜索口碑 searchWord/task
补单任务 searchWord/reOrder

## 其他业务模块

词包管理 wordPack
流量包管理 flowPack
内容撰稿任务 contentFeed
财务管理 finance
充值管理 recharge
发票管理 invoice
账号管理 account
产品管理 product
通知中心 notifications
内容广场 contentsquare
工具中心 tool

这样的对应关系可以帮助理解代码中使用的英文命名所对应的具体业务含义。比如看到 invite 路由就知道是特邀定制业务,searchWord 对应搜索口碑任务等。
```

![cline-stepbystep.png](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagescline-stepbystep.png)

### 文件功能描述

```md
user: 结合业务术语表，使用正确的文案总结当前打开文件的功能职责，作为元数据持久化存储起来，目的是为了当用户提出相关需求时，可以通过元数据定位到当前这个文件

ai:

从techContext.md的业务术语映射可以看出：

merchandise - 优选带货
effect - 投后数据

结合当前文件代码和业务术语映射，我可以总结出这个文件的功能职责，并使用write_to_file将其持久化为元数据。

我将创建一个专门存放页面元数据的目录和文件：
```

```json fold
[
  {
    "path": "apps/biz/src/pages/Merchandise/Effect/index.tsx",
    "name": "Effect",
    "type": "page",
    "description": "优选带货任务的投后数据分析页面",
    "features": [
      "任务基本信息展示(任务ID、类型、时间、征稿数等)",
      "流量数据汇总分析(阅读、互动、评论等指标)",
      "效果数据统计(投流消耗、CTR、GMV等指标)",
      "投稿内容效果明细展示",
      "电商数据分析(京知/星知)",
      "数据导出与数据截图"
    ],
    "businessScenario": "商家查看和分析优选带货任务的投放效果",
    "technicalHighlights": [
      "复杂数据可视化",
      "多维度数据聚合",
      "自定义数据导出",
      "动态数据筛选",
      "组件按需加载"
    ],
    "businessCategory": "优选带货",
    "subCategory": "效果分析"
  },
  {
    "path": "apps/biz/src/pages/Merchandise/SelectAuthor/index.tsx",
    "name": "SelectAuthor",
    "type": "page",
    "description": "优选带货任务中的创作者选择页面",
    "features": [
      "创作者列表展示与筛选(支持商品交易总额、转化率等维度)",
      "创作者选择与寄品选择功能",
      "创作者名单和收件信息导出",
      "任务状态管理与流转"
    ],
    "businessScenario": "商家选择优选带货合作创作者",
    "technicalHighlights": [
      "状态机管理复杂流程",
      "表格组件集成",
      "自定义表单控件",
      "复杂状态管理"
    ],
    "businessCategory": "优选带货",
    "subCategory": "创作者选择"
  }
]
```

### 索引文件

根据文件内容帮我梳理出业务术语与文件命名的映射表，尝试找出规律并进行总结。目的是当用户说出业务术语时，可以通过映射表找到相关的文件

```json fold
{
  "version": "1.0",
  "lastUpdated": "2025-02-20T15:15:23+08:00",
  "businessCategories": {
    "优选带货": {
      "description": "优选带货相关功能页面",
      "subCategories": {
        "创作者选择": {
          "pages": [
            {
              "name": "SelectAuthor",
              "path": "apps/biz/src/pages/Merchandise/SelectAuthor/index.tsx",
              "description": "优选带货任务中的创作者选择页面",
              "metadataPath": "apps/biz/src/pages/Merchandise/SelectAuthor/metadata.json",
              "key_features": [
                "创作者列表展示与筛选",
                "创作者选择与寄品选择",
                "创作者名单和收件信息导出",
                "任务状态管理与流转"
              ],
              "business_scenario": "商家选择优选带货合作创作者"
            }
          ]
        },
        "效果分析": {
          "pages": [
            {
              "name": "Effect",
              "path": "apps/biz/src/pages/Merchandise/Effect/index.tsx",
              "description": "优选带货任务的投后数据分析页面",
              "metadataPath": "apps/biz/src/pages/Merchandise/Effect/metadata.json",
              "key_features": [
                "任务基本信息展示",
                "流量数据汇总分析",
                "效果数据统计",
                "投稿内容效果明细",
                "电商数据分析",
                "数据导出与数据截图"
              ],
              "business_scenario": "商家查看和分析优选带货任务的投放效果"
            }
          ]
        }
      }
    }
  },
  "usage_guide": {
    "purpose": "此索引文件用于帮助 LLM 快速定位和理解各个业务页面的功能和关系",
    "structure": {
      "businessCategories": "按业务大类组织页面",
      "subCategories": "业务大类下的具体功能分类",
      "pages": "具体页面信息，包含路径、描述、主要功能等"
    },
    "how_to_use": [
      "1. 通过 businessCategories 了解系统的主要业务模块",
      "2. 通过 subCategories 了解每个业务模块的功能分类",
      "3. 在具体的 pages 中查找所需功能的实现位置",
      "4. 使用 metadataPath 获取页面的详细元数据信息"
    ]
  }
}
```

## Vibe Coding

- [What Is Vibe Coding?](https://learnprompting.org/blog/what-is-vibe-coding?utm_source=learnprompting.beehiiv.com&utm_medium=newsletter&utm_campaign=what-is-vibe-coding&_bhlid=c770cb5298ad095b4e4d66c33b7d670cfc8d8ee4)
- [From Assembly to AI: Why 'Vibe Coding' Is Just Another Chapter in Our Abstraction Story - Cline Blog](https://cline.bot/blog/from-assembly-to-ai-why-vibe-coding-is-just-another-chapter-in-our-abstraction-story)  

只关注最终效果，不关心代码本身

TDD

---

---

---

```` fold

你是一个构建代码知识库的助手，你需要根据代码仓库的结构和内容，构建一个知识库，以帮助大型语言模型 (LLM) 更好地理解和处理代码

- 以 `knowledge_base` 命名知识库文件夹，放在代码仓库的根目录下
- 知识库分为两类文件：索引文件和元数据文件
  - 索引文件
    - 作用：用于快速检索文件位置，包含文件路径、关键词索引、模块索引等信息
    - 使用：每次开始前，你都应该先分析用户的需求，从索引文件中寻找与需求相关的文件，读取文件内容后再次详细计划用户的需求
  - 元数据文件：用于存储代码文件和文档的结构化信息，包含文件路径、文件类型、编程语言、模块、函数、类、关键词等信息
- 对于前端代码仓库，应该忽略非逻辑代码的文件信息，如 `.png`, `.jpg`, `.svg`, `.css`, `.scss`, `.less`, `.html`

为当前文件构建元数据信息：文件路径、文件类型、编程语言、模块、函数、类、关键词等信息

```json fold
{
  "filepath": "src/module_a/file_1.py",
  "filetype": "python",
  "language": "Python",
  "module": "module_a",
  "functions": [
    {
      "name": "calculate_sum",
      "parameters": ["a", "b"],
      "returns": "int",
      "description": "计算两个整数的和"
    },
    {
      "name": "validate_input",
      "parameters": ["input_str"],
      "returns": "bool",
      "description": "验证输入字符串是否有效"
    }
  ],
  "classes": [
    {
      "name": "DataProcessor",
      "inheritance": [],
      "methods": [
        {
          "name": "process_data",
          "parameters": ["data"],
          "returns": "processed_data",
          "description": "处理输入数据"
        }
      ],
      "description": "数据处理类"
    }
  ],
  "dependencies": [],
  "related_documents": ["documentation/modules/module_a.md"],
  "code_summary": "包含数据处理和输入验证相关的函数和类。",
  "keywords": ["数据处理", "输入验证", "模块A"]
}
```

---

> 代码片段、文档和 Issue 信息，以及元数据和索引，

knowledge_base/  
├── README.md # 知识库说明文档  
├── data/ # 存储知识库数据的目录  
│ ├── documentation/ # 存储文档的目录  
│ │ ├── project_a/ # 项目 A 的文档  
│ │ │ ├── README.md # 项目说明文档  
│ │ │ ├── api.md # API 文档  
│ │ │ └── ...  
│ │ ├── project_b/ # 项目 B 的文档  
│ │ │ └── ...  
│ │ └── ...  
│ └── metadata.json # 存储元数据的 JSON 文件  
└── index/ # 存储索引的目录

好的，以下是一个 LLM 友好的知识库结构示例，专为自动构建代码仓库知识库而设计：  
知识库结构示例

knowledge_base/  
├── README.md # 知识库说明文档  
├── data/ # 存储知识库数据的目录  
│ ├── code/ # 存储代码片段的目录  
│ │ ├── project_a/ # 项目 A 的代码片段  
│ │ │ ├── file1.py # 文件 1 的代码片段  
│ │ │ ├── file2.js # 文件 2 的代码片段  
│ │ │ └── ...  
│ │ ├── project_b/ # 项目 B 的代码片段  
│ │ │ └── ...  
│ │ └── ...  
│ ├── documentation/ # 存储文档的目录  
│ │ ├── project_a/ # 项目 A 的文档  
│ │ │ ├── README.md # 项目说明文档  
│ │ │ ├── api.md # API 文档  
│ │ │ └── ...  
│ │ ├── project_b/ # 项目 B 的文档  
│ │ │ └── ...  
│ │ └── ...  
│ ├── issues/ # 存储 Issue 信息的目录  
│ │ ├── project_a/ # 项目 A 的 Issue  
│ │ │ ├── issue1.md # Issue 1 的描述  
│ │ │ ├── issue2.md # Issue 2 的描述  
│ │ │ └── ...  
│ │ ├── project_b/ # 项目 B 的 Issue  
│ │ │ └── ...  
│ │ └── ...  
│ └── metadata.json # 存储元数据的 JSON 文件  
├── scripts/ # 存储脚本的目录  
│ ├── extractor.py # 提取代码片段、文档和 Issue 的脚本  
│ ├── indexer.py # 构建索引的脚本  
│ └── ...  
└── index/ # 存储索引的目录  
├── faiss_index # Faiss 索引文件  
└── ...目录结构说明

- knowledge_base/: 知识库的根目录。
- README.md: 知识库的说明文档，包含知识库的用途、结构、如何使用等信息。
- data/: 存储知识库数据的目录。  
◦ documentation/: 存储文档的目录，按项目组织。  
◦ issues/: 存储 Issue 信息的目录，按项目组织。  
◦ metadata.json: 存储元数据的 JSON 文件，包含项目信息、文件信息等。
- scripts/: 存储脚本的目录，包含提取、索引等脚本。
- index/: 存储索引的目录，用于快速检索知识库内容。

文件命名规范
- 文件名应具有描述性，能够清晰表达文件内容。
- 文件名应尽量简洁，避免过长。
- 文件名应统一命名风格，例如使用 snake_case 或 camelCase。

元数据设计  
metadata.json 文件用于存储知识库的元数据，例如：

```json fold
{
  "projects": [
    {
      "name": "project_a",
      "description": "项目 A 的描述",
      "files": [
        {
          "path": "data/code/project_a/file1.py",
          "language": "python",
          "keywords": ["功能1", "功能2"]
        },
        {
          "path": "data/code/project_a/file2.js",
          "language": "javascript",
          "keywords": ["功能3", "功能4"]
        }
      ]
    }
  ]
}
```

LLM 友好性
- 结构化数据: 采用结构化的目录和文件命名，方便 LLM 理解和解析。
- 元数据: 提供丰富的元数据，帮助 LLM 更好地理解知识库内容。

---

当然！构建代码仓库的知识库对于提升代码理解、维护和协作至关重要，尤其是在结合大型语言模型 (LLM) 的背景下，一个结构化的知识库能够极大地帮助 LLM 理解代码的语义和上下文，从而实现更智能的代码分析、生成和问答。  
以下是一个 LLM 友好的知识库结构示例，它结合了多种格式以满足不同类型的信息需求，并优化了 LLM 的理解和处理能力。  
知识库结构示例：  
我们可以将知识库组织成以下几个主要部分，每个部分都有其特定的格式和用途，以便 LLM 能够有效地利用：

1. 代码文件（Code Files）：
   - 格式: 原始的代码文件，例如 .py, .java, .js, .c, .cpp 等。
   - 存储方式: 按照代码仓库的原始目录结构组织。
   - 内容: 代码文件的完整内容。
   - 用途: 这是知识库的核心，LLM 需要直接访问代码来理解其逻辑和功能。
   - LLM 友好性: LLM 可以直接读取和解析代码文件，识别语法结构、函数、类和变量等。

   示例目录结构：

```md fold
   knowledge_base/
   ├── code/
   │ ├── src/
   │ │ ├── module_a/
   │ │ │ ├── file_1.py
   │ │ │ ├── file_2.py
   │ │ ├── module_b/
   │ │ │ ├── file_3.java
   │ │ │ ├── file_4.java
   │ ├── include/
   │ │ ├── header_1.h
   │ │ ├── header_2.h
   ├── documentation/
   ├── metadata/
   └── index.json
```

1. 文档（Documentation）
   - 格式: Markdown (.md) 文件是理想的选择，因为 Markdown 易于编写、阅读，并且可以很好地被 LLM 解析。也可以包含其他格式的文档，如 .txt, .pdf, .html 等。
   - 存储方式: 可以按照模块、功能或主题组织文档目录。
   - 内容:  
   ◦ 高层架构文档: 描述代码仓库的整体架构、模块划分、设计理念等。  
   ◦ 模块/组件文档: 详细描述每个模块或组件的功能、输入输出、使用方法、设计思路等。  
   ◦ API 文档: 对于库或 API 类型的代码仓库，提供详细的 API 文档，包括函数、类、方法等的说明、参数、返回值、示例代码等。  
   ◦ 教程和示例: 提供代码的使用教程和示例，帮助用户快速上手和理解代码。  
   ◦ 注释和代码内文档 (Docstrings): 代码文件内部的注释和文档字符串（例如 Python 的 docstrings, Java 的 Javadoc）也非常重要，它们是代码上下文的重要组成部分。
   - 用途: 文档提供代码的上下文信息，帮助 LLM 理解代码的意图、功能和使用方法。
   - LLM 友好性: Markdown 结构清晰，易于 LLM 解析文本内容和结构信息，例如标题、列表、代码块等。  
   示例文档目录结构：

   ```md
   knowledge_base/
   ├── documentation/
   │ ├── architecture.md
   │ ├── modules/
   │ │ ├── module_a.md
   │ │ ├── module_b.md
   │ ├── api/
   │ │ ├── api_module_a.md
   │ │ ├── api_module_b.md
   │ ├── tutorials/
   │ │ ├── tutorial_1.md
   │ │ ├── tutorial_2.md示例 Markdown 文档内容 (module_a.md)：
   Markdown
   ```

## 模块 A 文档**模块概述:**

模块 A 负责处理用户身份验证和授权。它提供了一系列 API 来管理用户账户、登录、注销和权限验证。

**主要功能:\*\*\***用户注册:** 允许新用户创建账户。\***用户登录:** 验证用户身份并创建会话。\***用户注销:** 结束用户会话。\***权限验证:\*\* 检查用户是否具有访问特定资源的权限。

**关键类和函数:\***`User`: 用户类，定义了用户的数据结构和相关方法。  
_`AuthenticationService`: 身份验证服务类，负责用户登录和注销逻辑。  
_`AuthorizationService`: 权限验证服务类，负责检查用户权限。

**使用示例:**

以下是如何使用 `AuthenticationService` 进行用户登录的示例代码：

```python
from module_a.authentication import AuthenticationService

auth_service = AuthenticationService()
user = auth_service.login("username", "password")
if user:
    print(f"用户 {user.username} 登录成功！")
else:
    print("登录失败！")更多信息:
请参考 API 文档 获取更详细的 API 信息。
```

1. 元数据 (Metadata)：

- **格式:** JSON (`.json`) 文件非常适合存储结构化的元数据。也可以使用 YAML (`.yaml`) 或 CSV (`.csv`) 等格式。
- **存储方式:** 可以为每个代码文件、模块或组件创建对应的元数据文件，或者将元数据集中存储在索引文件中。
- **内容:**
  - **代码文件元数据:**
    - `filepath`: 文件路径
    - `filetype`: 文件类型 (例如 `python`, `java`, `markdown`)
    - `language`: 编程语言 (例如 `Python`, `Java`, `JavaScript`)
    - `module`: 所属模块名称
    - `functions`: 文件中定义的函数列表，可以包含函数名、参数、返回值、简短描述等信息。
    - `classes`: 文件中定义的类列表，可以包含类名、继承关系、方法、简短描述等信息。
    - `dependencies`: 依赖的其他文件或模块列表。
    - `related_documents`: 相关的文档文件路径列表。
    - `code_summary`: 代码的简短总结或功能描述。
    - `keywords`: 关键词，用于搜索和分类。
  - **文档元数据:**
    - `filepath`: 文件路径
    - `document_type`: 文档类型 (例如 `architecture`, `module`, `api`, `tutorial`)
    - `related_modules`: 相关的模块列表。
    - `keywords`: 关键词，用于搜索和分类。
    - `document_summary`: 文档的简短总结。
- **用途:** 元数据提供关于代码和文档的结构化信息，帮助 LLM 更好地理解代码库的组织结构、组件之间的关系，以及快速定位和检索信息。
- **LLM 友好性:** JSON 格式结构清晰，易于 LLM 解析和利用结构化数据，例如提取函数和类的信息、识别依赖关系、查找相关文档等。

示例元数据文件 (`metadata/file_1.json`)：

```json
{
  "filepath": "src/module_a/file_1.py",
  "filetype": "python",
  "language": "Python",
  "module": "module_a",
  "functions": [
    {
      "name": "calculate_sum",
      "parameters": ["a", "b"],
      "returns": "int",
      "description": "计算两个整数的和"
    },
    {
      "name": "validate_input",
      "parameters": ["input_str"],
      "returns": "bool",
      "description": "验证输入字符串是否有效"
    }
  ],
  "classes": [
    {
      "name": "DataProcessor",
      "inheritance": [],
      "methods": [
        {
          "name": "process_data",
          "parameters": ["data"],
          "returns": "processed_data",
          "description": "处理输入数据"
        }
      ],
      "description": "数据处理类"
    }
  ],
  "dependencies": [],
  "related_documents": ["documentation/modules/module_a.md"],
  "code_summary": "包含数据处理和输入验证相关的函数和类。",
  "keywords": ["数据处理", "输入验证", "模块A"]
}
```

1. 索引文件 (Index File)：
   - 格式: JSON (.json) 文件。
   - 存储方式: 知识库根目录下的 index.json 文件。
   - 内容:  
   ◦ 文件索引: 列出所有代码文件、文档文件和元数据文件的路径，方便快速查找。  
   ◦ 关键词索引: 将所有文档和元数据中的关键词提取出来，建立索引，方便基于关键词的搜索。  
   ◦ 模块/组件索引: 列出所有模块或组件，并提供其描述和相关文件的链接。
   - 用途: 索引文件提供知识库的全局概览和快速访问入口，帮助 LLM 快速定位到所需的信息。
   - LLM 友好性: JSON 格式易于 LLM 读取和解析，可以快速加载索引信息，提高信息检索效率。  
   示例索引文件 (index.json) 的部分内容：

   ```json
   {
     "files": [
       "code/src/module_a/file_1.py",
       "code/src/module_a/file_2.py",
       "code/src/module_b/file_3.java",
       "documentation/architecture.md",
       "documentation/modules/module_a.md",
       "metadata/file_1.json",
       "metadata/file_2.json",
       "metadata/file_3.json"
     ],
     "keywords_index": {
       "数据处理": [
         "metadata/file_1.json",
         "documentation/modules/module_a.md"
       ],
       "用户认证": [
         "documentation/architecture.md",
         "documentation/modules/module_a.md"
       ],
       "API": [
         "documentation/api/api_module_a.md",
         "documentation/api/api_module_b.md"
       ]
     },
     "modules_index": {
       "module_a": {
         "description": "用户认证和授权模块",
         "documents": ["documentation/modules/module_a.md"],
         "code_files": [
           "code/src/module_a/file_1.py",
           "code/src/module_a/file_2.py"
         ]
       },
       "module_b": {
         "description": "订单管理模块",
         "documents": ["documentation/modules/module_b.md"],
         "code_files": [
           "code/src/module_b/file_3.java",
           "code/src/module_b/file_4.java"
         ]
       }
     }
   }
   ```

   构建和维护知识库:
   - 自动化构建: 可以使用脚本或工具 (例如，代码分析工具、文档生成工具) 自动化地从代码仓库中提取代码、文档和元数据，并生成知识库。
   - 定期更新: 当代码仓库发生变更时，需要定期更新知识库，保持知识库与代码仓库同步。
   - 人工维护: 对于一些复杂的设计决策、架构理解等信息，可能需要人工编写文档和维护知识库。

---

1. 使用代码分析工具自动提取代码结构
2. 利用文档生成工具从代码注释生成 API 文档
3. 实现 Git 钩子，在提交时更新知识库
4. 定期运行验证工具确保文档与代码一致性
5. 使用 LLM 辅助生成初始文档并提供格式建议

````
