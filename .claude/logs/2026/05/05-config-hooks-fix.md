# Hook 体系按社区标准重写
**ID**: config-hooks-fix-20260505
**Time**: 2026-05-05 20:45
**Category**: config
**Tags**: #hook #fix #audit-log #git-safety

## 修复项
| # | 问题 | 修复 |
|---|------|------|
| 1 | python3 硬编码 | 自动检测 python/python3，排除 Windows Store 假 python3 |
| 2 | Stop hook 误用(决策钩子当日志钩子) | 改为 SessionEnd hook |
| 3 | PostToolUse hook 了 Write+Edit 太宽 | 仅 hook Bash |
| 4 | 同步阻塞 | async: true |
| 5 | bash 引号嵌套破坏 python 命令 | 改用独立 .py 脚本，bash 只做转发 |
| 6 | Markdown 日志不可查询 | 改为 JSONL 格式，按天轮转 |
| 7 | 无 git 安全防护 | 添加 PreToolUse git-safety hook（社区标配） |

## 新文件结构
```
.claude/
├── settings.json          # Hook 配置 (PostToolUse + SessionEnd + PreToolUse)
├── scripts/
│   ├── auto-log.sh        # Python 检测 + 转发
│   ├── audit_log.py       # JSONL 审计日志写入
│   ├── git-safety.sh      # Python 检测 + 转发
│   └── git_safety.py      # PreToolUse 拦截危险 git 命令
└── logs/
    └── audit-YYYY-MM-DD.jsonl  # 按天轮转的审计日志
```

## Result
Hooks 符合社区标准：快速（<1秒）、异步、仅 Bash 审计、git 安全防护、JSONL 可查询、Windows Python 兼容。
