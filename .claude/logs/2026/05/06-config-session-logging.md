# 会话日志自动化修复
**ID**: config-session-logging-20260506
**Time**: 2026-05-06 13:50
**Category**: config
**Tags**: #logging #session-end #transcript #auto-log

## 诊断
- PostToolUse JSONL 审计日志正常 ✅
- SessionEnd 只写了个空标记，没保存 transcript ❌
- 结构化 Markdown 日志没法从 hook 自动生成（hook 无上下文） ❌

## 方案（参考 GitHub #4329 + Tuner Labs 四层记忆栈）
两层分离：
1. **原始记录**：SessionEnd hook 读取 transcript_path，自动保存到 logs/sessions/
2. **结构化总结**：CLAUDE.md 第 9 节规则，会话结束时 Claude 主动写 Markdown 日志

## Actions
| # | Action | Detail |
|---|--------|--------|
| 1 | audit_log.py 重写 | SessionEnd 时复制 transcript 到 logs/sessions/ |
| 2 | CLAUDE.md 新增第 9 节 | 会话结束自动写结构化日志 + 更新 INDEX |

## Result
两层日志互补：hook 保障原始记录不丢，Claude 保障结构化总结可读。
