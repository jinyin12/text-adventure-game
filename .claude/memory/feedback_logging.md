---
name: operation-logging
description: All disk/cleanup/system-change operations must be logged to .claude/logs/ with INDEX.md
type: feedback
originSessionId: 5c80ffa0-4956-4430-8516-2c1af537620a
---
每次执行涉及磁盘操作、清理、系统变更的操作后，必须写入 `.claude/logs/` 日志体系。

**Why**: 用户要求建立结构化日志，方便日后快速查找和定位历史操作。

**How to apply**:
- 日志目录：`~/.claude/logs/YYYY/MM/DD-{category}-{target}.md`
- 每次写入日志后同步更新 `~/.claude/logs/INDEX.md`
- INDEX.md 格式：一行一条，日期 | ID | 分类 | 摘要 | 结果
- 日志条目包含：ID、时间、分类、标签、操作明细、前后对比
