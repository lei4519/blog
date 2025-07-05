---
id: AI Agent
aliases: []
tags:
  - LLM
  - AI
  - Explanation
created: 2025-02-10T18:39:00
updated: 2025-07-05T13:30
share: "true"
issue: "114"
---
  
Agent    
人工智能代理/智能体  
  
---  
  
![Pasted image 20250319172753](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020250319172753.png)  
  
AI Agent 是一种能够自主感知环境、进行决策、规划和执行动作的智能实体  
  
- 利用 LLM 处理信息，**自主**帮人完成任务的程序  
  
AI Agent 的工作流程通常包括以下几个关键环节：  
  
1. **感知（Perception）**：环境交互，通过传感器或其他输入设备收集外部信息  
   - 长期记忆：[LLM - RAG](../112/LLM%20-%20RAG.md)  
   - 编辑器 🌰：  
     - Open Tabs、Focus File、CWD  
     - LSP（语言服务器）：引用关系、语法错误  
     - Lint、Git  
2. **信息处理（Reasoning）**  
   - 使用 [LLM](../111/LLM%20Base.md) 自身的能力，处理输入的信息  
3. **决策（Decision-making）**：基于处理结果制定行动计划  
   - 自我反思、推理，任务拆解、规划  
4. **行动（Action）**：执行决策，完成具体任务，并根据反馈调整未来行为  
   - [LLM - Tool Use](../113/LLM%20-%20Tool%20Use.md)  
  
## 决策/规划  
  
决策/推理/反思/规划，本质上都是用提示词告诉 LLM 要遵循指定的模式进行思考/输出  
  
### ReAct  
  
Reasoning and Action    
推理 + 行动  
  
![Pasted image 20250319163344](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020250319163344.png)  
  
- 你可以使用如下工具解决问题  
- 思考接下来要做什么行动，最好是使用工具列表中的工具  
- 观察行动的结果，重复思考/行动的步骤，直到你确认自己真正得到了答案  
- 输出最终的结果  
  
细看 [Cline System Prompt](../117/Cline%20System%20Prompt.md) 会发现 Cline 就是这么做的  
  
> 最初，ReACT 比其他提示技术表现出更好的性能，特别是在复杂的多步骤任务中    
> 但在 2023 年底，它被 OpenAI、Anthropic、Mistral 和 Google 模型支持的原生函数调用技术所取代    
> 对于大多数可用于生产的功能，我们建议使用函数或工具调用而不是 ReACT  
>  
> [ReACT Agent Model](https://klu.ai/glossary/react-agent-model)  
  
function-call 不具备观察的能力  
  
### CoT  
  
Chain-of-Thought    
思维链  
  
规划  
  
- 任务分解  
  - 思维链/树  
  
![Pasted image 20250319164039](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020250319164039.png)  
  
推理模型：O1 / R1  
  
### [Plan & Act](https://docs.cline.bot/exploring-clines-tools/plan-and-act-modes-a-guide-to-effective-ai-development)  
  
计划 + 行动  
  
多模型协作  
  
- 推理模型做规划  
- 普通模型做开发  
  
### 工作流  
  
1. 工作流（Workflow）    
   LLM 与外部工具按照预定义的执行路径进行结构化序列操作。此类系统注重可预测性，适用于定义明确且可重复的任务  
2. 智能体（Agent）    
   更具动态性和自主性的系统，LLM 可自主决定流程、选择工具并确定任务完成方式。这种方式提供了更大的灵活性和适应性  
  
现有模型的能力，慢慢在模糊这些概念  
  
[mcp-taskmanager](https://github.com/pashpashpash/mcp-taskmanager)  
  
## 模型能力的发展  
  
行之有效的方法，慢慢都融合进模型的自身能力中了  
  
混合推理模型    
Claude 3.7 Sonnet 既是一个普通的 LLM 模型，又是一个推理模型  
  
[OpenAI Agents API](https://platform.openai.com/docs/guides/agents)  
  
### 编程工具的发展  
  
- Cursor 2023 年初发布，2024 年末才开始火出圈  
- Codeium 之前一直在做 copilot 类（tab autocomplete）的 [产品](https://github.com/Exafunction/codeium.nvim)，24 年 11 月发布了 windsurf  
- 同时也可以看开源工具（aider/Cline/aider）的发展和 [官方说明](https://github.com/cline/cline/blob/961c0f87076d2ef1e7f44cce0e2cdae7b2d5d066/locales/zh-cn/README.md)  
  
![Pasted image 20250315173158](https://raw.githubusercontent.com/lei4519/picture-bed/main/imagesPasted%20image%2020250315173158.png)  
  
24 年 6 月 [claude 3.5 sonnet](https://docs.anthropic.com/zh-CN/release-notes/api#2024-6-20) 发布  
  
- Cline 的第一次提交：2024 年 7 月 6 日  
  
Agent 的发展强依赖模型自身的能力  
  
## REF  
  
- <https://www.anthropic.com/engineering/building-effective-agents>  
