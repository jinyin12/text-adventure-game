---
name: feedback-cleanup-tasks
description: 任务完成后立刻清理，不留残留的 pending/in_progress 任务
type: feedback
originSessionId: 40cebb43-2857-48c7-b4eb-051948b407ee
---
创建一个任务就跟踪到底，完成后立刻标记 completed/deleted，不要让残留任务堆积。

**Why**: 2026-05-05 创建了中英文两份重复任务（#1-4 英文 + #5-8 中文），只清理了中文那组，英文那组还显示 pending/in_progress。用户看到后质疑"这些呢？"

**How to apply**:
- 用 TaskCreate 时先检查 TaskList 避免重复
- 完成一组任务后立刻跑 TaskList 确认所有任务状态正确
- 重复任务立刻 deleted，不要留着
- 会话结束前 final check：TaskList 不应有 pending/in_progress 残留
