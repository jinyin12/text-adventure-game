---
name: feedback-log-immediately
description: 配置/系统操作完成后立即写日志，不等用户提醒
type: feedback
originSessionId: 40cebb43-2857-48c7-b4eb-051948b407ee
---
每次配置变更、系统操作完成后，立即写入 .claude/logs/ 并同步更新 INDEX.md，不等用户问。

**Why**: 2026-05-05 配置了 CLAUDE.md、记忆系统、日志模板、3 个 slash 命令、hooks 体系，但全部操作都没写日志。用户追问"上面这些操作写日志没"才发现漏了。规则写在 CLAUDE.md 第 5 节里，但没执行。

**How to apply**:
- 操作完成 → 立刻写日志（logs/YYYY/MM/DD-{category}-{target}.md）
- 立刻更新 INDEX.md（在对应月份表加一行）
- 判断标准：只要动了 .claude/ 下的配置、系统设置、任何破坏性操作，都必须记
- 这是强制规则，不是可选项。用户不提醒也得做。
