# 自进化自动化：Feedback: 触发词 + UserPromptSubmit hook
**ID**: config-auto-feedback-20260505
**Time**: 2026-05-05 22:00
**Category**: config
**Tags**: #auto-feedback #UserPromptSubmit #hook #simplify

## Context
用户反馈 5 步手动 `/reflect` 流程"太麻烦了，有没有更自动的方案"。搜索后发现 claude-feedback-clusters (Hammaarn) 的单触发词模式。

## Solution
- `Feedback: <纠正内容>` — 用户只需一句话
- `UserPromptSubmit` hook 自动检测 `Feedback:` 前缀
- 注入 routing context → Claude 自动完成：分析根因 → 写 memory → 更新 INDEX → 写日志

## Actions
| # | Action | Detail |
|---|--------|--------|
| 1 | 创建 feedback_capture.py | 检测 Feedback: 前缀，生成 additionalContext |
| 2 | 创建 feedback-capture.sh | Python 检测 + 转发 |
| 3 | settings.json 新增 UserPromptSubmit hook | 每次用户输入自动扫描 |
| 4 | 更新 CLAUDE.md 第 8 节 | /reflect(5步) → Feedback: 一句话(全自动) |

## Result
从"5 步手动"缩减到"用户打字 + 全自动"。参考 claude-feedback-clusters: one hook, one trigger, Claude routes the rest。
