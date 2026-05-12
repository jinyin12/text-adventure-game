# 认证冲突修复：ANTHROPIC_AUTH_TOKEN vs ANTHROPIC_API_KEY

**ID**: config-auth-conflict-20260506
**Time**: 2026-05-06
**Category**: config
**Tags**: #auth #env-conflict #deepseek #settings.json

## Context
重启 Claude Code 后报错：
```
Auth conflict: Both a token (ANTHROPIC_AUTH_TOKEN) and an API key (ANTHROPIC_API_KEY) are set.
This may lead to unexpected behavior.
```

## Root Cause
5月5日配置 env 持久化时，在 settings.json 里同时设置了 `ANTHROPIC_AUTH_TOKEN` 和 `ANTHROPIC_API_KEY`（相同的 DeepSeek API Key），意图是"双写兼容不同版本"。但 Claude Code 不允许两者共存，检测到冲突后会报错。

**错误假设**: 两个都设 = 兼容性更好
**实际情况**: 两个都设 = 认证冲突，Claude Code 不知道用哪个

## Fix
删除 `ANTHROPIC_AUTH_TOKEN`，只保留 `ANTHROPIC_API_KEY`。

## Lesson
- 环境变量不是"多多益善"，冲突的变量会导致未定义行为
- 不确定该用哪个时，先查官方文档而不是两个都设
- "双写兼容"在认证场景下是反模式
