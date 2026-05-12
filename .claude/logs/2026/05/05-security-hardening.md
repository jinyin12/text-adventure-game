# Agent 安全防线加固
**ID**: security-hardening-20260505
**Time**: 2026-05-05 22:30
**Category**: config
**Tags**: #security #firewall #file-guard #PreToolUse #defense-in-depth

## 审计发现
| # | 严重度 | 问题 |
|---|--------|------|
| 1 | 🔴 | API key 在 settings.json 双写暴露 |
| 2 | 🔴 | git-safety 仅拦 2 种模式 |
| 3 | 🟠 | Hook 失败开放（Python 缺失仍放行） |
| 4 | 🟠 | 无敏感文件保护 |
| 5 | 🟡 | 审计日志可篡改 |
| 6 | 🟡 | Hook 脚本自身无保护 |

## 加固措施

### 1. bash-firewall（替换 git-safety）
参考 Droidzold/hardened-security-config + disler/claude-code-damage-control (454 stars)

8 大类别拦截：
- 破坏性文件系统: rm -rf, chmod 777, mkfs, dd
- 管道到 shell: curl | bash, wget | sh, eval
- 权限提升: sudo, su, chown root
- 数据库破坏: DROP TABLE, TRUNCATE
- Git 数据丢失: push --force, reset --hard, clean -fdx
- 反向 shell: nc -e, /dev/tcp
- 系统关闭: shutdown, reboot
- K8s 破坏: kubectl delete namespace

### 2. file-guard（新增）
- 阻止读取: .ssh/, .aws/, .gnupg/, .docker/
- 阻止读写: .env, *.pem, *.key, credentials.json, id_rsa
- 自我保护: 阻止修改 .claude/settings.json, scripts/

### 3. settings.json 更新
- PreToolUse Bash → bash-firewall.sh
- PreToolUse Read/Write/Edit → file-guard.sh
- 保留 UserPromptSubmit, PostToolUse, SessionEnd

### 4. 已知遗留风险
- API key 无法从 settings.json 移走（Claude Code 需要在这里读 env）
- Hook 失败仍默认开放（基础设施故障时不能全面封死）
- 无沙箱（Windows 不支持 bubblewrap）

## Result
防线从 2 个 git 模式 → 8 类 30+ 模式 + 敏感文件保护。轻量、代码自审计、无第三方依赖。
