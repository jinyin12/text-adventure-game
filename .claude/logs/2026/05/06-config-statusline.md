# StatusLine 状态栏配置
**ID**: config-statusline-20260506
**Time**: 2026-05-06 22:00
**Category**: config
**Tags**: #config #statusline #context-monitoring

## Actions
| # | Action | Detail |
|---|--------|--------|
| 1 | 创建 statusline.sh 脚本 | ~/.claude/scripts/statusline.sh，jq 提取字段拼接 |
| 2 | settings.json 新增 statusLine | type: command，指向脚本而非内联 bash -c |
| 2 | INDEX.md 追加条目 | 已更新 |

## 字段
会话名 | 模型 | 目录 | ctx:使用率% | 5h:速率% 7d:速率%

## Result
底部状态栏实时显示会话信息+上下文用量。DeepSeek 1M 上下文可实时监控。
