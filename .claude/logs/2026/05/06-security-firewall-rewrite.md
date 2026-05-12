# bash_firewall.py 重写
**ID**: security-firewall-rewrite-20260505
**Time**: 2026-05-05 23:30
**Category**: config
**Tags**: #security #firewall #powershell #regex #IGNORECASE

## Context
用户指出原防火墙三个问题：1) 正则黑名单无限膨胀；2) 没加 IGNORECASE；3) 缺少 PowerShell 危险 cmdlet 拦截。

## Actions
| # | Action | Detail |
|---|--------|--------|
| 1 | 全局 IGNORECASE | 所有 `re.search()` 加 `re.IGNORECASE`，去掉 `.lower()` |
| 2 | rm 模式简化 | 4条→1条：`\brm\b.*\s-[a-zA-Z]*[rf]` |
| 3 | 修复 \b- bug | `\b` 对非单词字符 `-` 不生效，改为 `\s-` |
| 4 | PowerShell 全覆盖 | Remove-Item/iwe\|iex/Invoke-WebRequest\|Invoke-Expression/Set-ExecutionPolicy/Stop-Computer/WebClient/DownloadString 等 12 条 |
| 5 | PowerShell 提权 | Start-Process -Verb RunAs |
| 6 | 正则修正 | `\[System\.Net\.WebClient\]` 去掉无效 `\b` 前缀 |

## Result
防线从 8 类 Bash 扩展到 Bash + PowerShell 双语言覆盖。不再需要无限加字符串——一套正则覆盖整类模式。
