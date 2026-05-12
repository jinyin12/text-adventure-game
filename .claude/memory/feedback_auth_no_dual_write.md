---
name: feedback-auth-no-dual-write
description: 认证凭据不要"双写"，冲突的环境变量会导致未定义行为
type: feedback
originSessionId: cab59c76-f682-44ff-a732-5532275e2d2e
---
认证相关的环境变量（ANTHROPIC_AUTH_TOKEN、ANTHROPIC_API_KEY 等）只能设一个，不能为了"兼容"同时设置多个。

**Why**: 在 settings.json 的 env 字段同时设置了 ANTHROPIC_AUTH_TOKEN 和 ANTHROPIC_API_KEY，意图是兼容不同版本，结果 Claude Code 检测到两者都存在时报认证冲突错误。

**How to apply**:
- 设置认证凭据前先查文档确认应该用哪个变量名
- 不确定时宁可只设一个然后测试，不要两个都设
- "双写兼容"在认证场景下是反模式
