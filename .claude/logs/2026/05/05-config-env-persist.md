# 环境变量持久化：settings.json env 字段
**ID**: config-env-persist-20260505
**Time**: 2026-05-05 20:55
**Category**: config
**Tags**: #env #deepseek #settings.json #persist

## Context
之前每次会话都要手动设置 8 个环境变量（DeepSeek API endpoint、模型映射等）。通过 GitHub 社区研究找到 Claude Code 原生方案。

## Solution
`settings.json` 顶层 `"env"` 字段 — Claude Code 启动时自动注入环境变量，无需 shell 配置文件修改。

## Actions
| # | Action | Detail |
|---|--------|--------|
| 1 | 在 settings.json 添加 `env` 字段 | 10 个环境变量：BASE_URL、AUTH_TOKEN、MODEL 映射、EFFORT_LEVEL |
| 2 | 添加 `ANTHROPIC_API_KEY` 双写 | 兼容不同版本对 token 的读取方式 |
| 3 | 添加 `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | 减少非必要 API 调用 |

## Result
重启后自动生效，不再需要手动 export/$env:。
