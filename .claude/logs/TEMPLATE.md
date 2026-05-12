# 日志写作规范

## 目录结构
```
.claude/logs/
├── INDEX.md              # 总索引（每条日志一行）
├── TEMPLATE.md           # 本文件
└── YYYY/
    └── MM/
        └── DD-{category}-{target}.md
```

## 文件命名
`YYYY/MM/DD-{category}-{target}.md`
- category: cleanup | install | config | system | git | disk | network
- target: 操作对象简述（英文小写，短横线分隔）
- 示例: `2026/05/03-cleanup-c.md` → C盘清理

## 日志文件格式

```markdown
# {标题}
**ID**: {category}-{target}-{YYYYMMDD}
**Time**: {YYYY-MM-DD HH:MM}
**Category**: {category}
**Tags**: #tag1 #tag2

## Before
{操作前状态，尽量量化}

## Actions
| # | Action | Detail |
|---|--------|--------|
| 1 | {动作} | {详情} |

## After
{操作后状态，尽量量化}

## Result
{一句话结果，包含关键数字}
```

## INDEX.md 格式

```markdown
# Operation Logs Index

## YYYY-MM
| Date | ID | Category | Summary | Result |
|------|-----|----------|---------|--------|
| MM-DD | [id](path) | category | 一句话摘要 | 量化结果 |
```

## 写日志规则
1. 操作完成后立即写日志，不要等到会话结束
2. 日志文件和 INDEX.md 同步更新（先写日志，再更新索引）
3. Before/After 必须有可量化的对比数据
4. 禁止操作也必须记录（保留/跳过/用户拒绝的项及其原因）
