# AI 文字冒险游戏 — 全栈开发
**ID**: dev-text-adventure-game-20260509
**Time**: 2026-05-09 21:30
**Category**: dev
**Tags**: #game #react #pwa #deepseek #vercel #github

## Context
用户想要一个手机上能玩的 AI 文字冒险游戏。从零搭建完整 PWA 应用，DeepSeek API 驱动叙事，支持多模板/多难度/多存档。

参考了 University Survival OS v3.0 GDD（遗忘曲线、执行力度检定、属性成长难度、精力效率等硬核机制）。

## Actions
| # | Action | Detail |
|---|--------|--------|
| 1 | 脚手架 | Vite + React + TypeScript + Tailwind + vite-plugin-pwa，D:\wjsswjss\text-adventure-game |
| 2 | 数据层 | IndexedDB (idb) + Zustand stores，relaxed durability 优化移动端写入 |
| 3 | 游戏引擎 | DeepSeek API 流式调用，system prompt 构建器，JSON 解析器，StreamingBuffer RAF 缓冲 |
| 4 | 模板系统 | 修仙(cultivation)、职场(career)、校园(campus) + 自定义 |
| 5 | 难度系统 | 休闲 ±15 / 正常 ±10 / 硬核 ±5 + 执行检定 + 属性衰减 + 精力效率 + 即死 |
| 6 | 页面开发 | HomePage/SetupPage/GamePage/SettingsPage + 6 组件 |
| 7 | PWA 配置 | manifest, service worker, 添加到主屏幕 |
| 8 | 代理后端 | Cloudflare Worker 代理 DeepSeek API（CORS 中转，worker/src/index.ts） |
| 9 | 部署 | Vercel (dist-psi-inky-16.vercel.app), GitHub (jinyin12/text-adventure-game), deploy.sh 一键部署 |
| 10 | 优化 | RAF 流式缓冲(100→20fps), React.memo, relaxed IndexedDB, 批量状态更新 |

## Result
- 29 TypeScript 模块（共 53 个项目文件），构建产物 ~295KB
- 三模板三难度，流式输出流畅，移动端可用
- GitHub: https://github.com/jinyin12/text-adventure-game
- 线上: https://dist-psi-inky-16.vercel.app
