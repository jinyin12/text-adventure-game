# 自动日志 Hook 配置
**ID**: config-auto-log-hook-20260505
**Time**: 2026-05-05 20:30
**Category**: config
**Tags**: #auto-log #hook #settings.json

## Context
用户要求配置自动日志，避免每次手动提醒写日志。

## Actions
| # | Action | Detail |
|---|--------|--------|
| 1 | 创建 settings.json | 配置 PostToolUse + Stop hooks |
| 2 | 创建 auto-log.sh | Bash/Python 混合脚本，关键词检测自动分类 |

## Mechanism
- **PostToolUse hook**: 拦截 Bash/Write/Edit 工具调用 → 关键词匹配分类 → 自动写日志
- **类别检测**: cleanup / install / config / system / git / network
- **触发条件**: Bash 描述含关键词，或 Write/Edit 写入 `.claude/` 配置区

## Result
后续磁盘清理、系统操作、配置变更自动写入 `.claude/logs/`，无需手动提醒。
