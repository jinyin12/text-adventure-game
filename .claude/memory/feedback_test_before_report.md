---
name: feedback-test-before-report
description: 脚本写完立刻用样例数据测试，不测不报完成
type: feedback
originSessionId: 40cebb43-2857-48c7-b4eb-051948b407ee
---
写完任何脚本（bash/python）后，必须立刻用样例数据跑一遍测试，确认通过才能报告完成。

**Why**: 2026-05-05 auto-log.sh 写了三版才通过——第一版 python3 硬编码触发 Windows Store 假 python3，第二版 bash 引号嵌套破坏 Python 命令。这些都是可以提前测出来的低级错误。

**How to apply**:
- 写完脚本 → 立即 `echo 'sample JSON' | bash script.sh` 验证
- 测试覆盖：正常输入 + 边界情况（空输入、异常输入）
- 特别注意 Windows 兼容：python/python3 都检测、路径用正斜杠
- 测试通过后再向用户报告完成，不要"应该能跑"
