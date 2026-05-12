---
name: feedback-search-first
description: 实现方案前先搜索 GitHub 和社区成熟方案，不要自己造轮子
type: feedback
originSessionId: 40cebb43-2857-48c7-b4eb-051948b407ee
---
动手写代码/配置前，先搜索 GitHub、开发者论坛、社区有没有现成的成熟方案。

**Why**: 2026-05-05 直接改 .bash_profile 持久化环境变量，被叫停。搜索后发现 settings.json 的 `"env"` 字段是 Claude Code 原生支持的更优雅方案（参考 MG-Cafe/claudecode-deepseek-stack、cc-switch 等项目）。

**How to apply**:
- 用户要求实现某个功能时，先用 WebSearch 搜索 "github claude code [功能] best practice"
- 找到 2-3 个方案后总结对比，让用户选择或直接选最优的
- 优先用 settings.json / Claude Code 原生机制，不搞 shell 配置文件 hack
- 不安装重插件（claude-reflect 等），保持轻量
