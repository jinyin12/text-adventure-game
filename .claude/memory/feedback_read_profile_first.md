---
name: feedback-read-profile-first
description: 动手前先读用户画像和已有规则，尊重语言偏好和协作风格
type: feedback
originSessionId: 40cebb43-2857-48c7-b4eb-051948b407ee
---
每次会话开始执行任务前，先确认用户画像（语言偏好、技术背景、协作风格），不要凭默认行为行事。

**Why**: 2026-05-05 写的第一版 CLAUDE.md 是英文的，用户直接叫停"用中文"。用户画像（memory/user_profile.md）明确写了"语言：中文，沟通使用中文"，但没读就直接按英文写了。

**How to apply**:
- 会话开始时先扫一眼 MEMORY.md 索引，确认用户语言偏好和技术背景
- 用户内容 = 中文回复；代码和配置文件内容按实际需求（通常是英文）
- CLAUDE.md 第 7 节已有"用中文回复"规则，这条记忆是强化提醒
