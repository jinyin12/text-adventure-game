# C盘清理
**ID**: cleanup-c-20260503
**Time**: 2026-05-03 18:07
**Category**: cleanup
**Tags**: #c-drive #cleanup #cache

## Before
| Total | Used | Free | Use% |
|-------|------|------|------|
| 301G | 174G | 127G | 58% |

## Deleted
| # | Path | Size |
|---|------|------|
| 1 | `AppData\Local\Temp\` | 8.4G |
| 2 | `AppData\Local\NVIDIA\DXCache\` | 8.3G |
| 3 | `AppData\Local\D3DSCache\` | 531M |
| 4 | `AppData\Local\CrashDumps\` | 83M |
| 5 | `AppData\Local\Microsoft\Windows\INetCache\` | 1.5M |
| 6 | npm cache | 1.1G |
| 7 | pip cache | 470M |
| 8 | `AppData\Local\AnkiProgramFiles\` | 666M |
| 9 | `C:\$Recycle.Bin\` | — |
| 10 | `C:\Windows\SoftwareDistribution\` | 63M |
| 11 | `C:\OneDriveTemp\` `C:\XmpCache\` `C:\temp\` `C:\tmp\` `C:\DumpStack.log.tmp` | 123K |

## Kept (user decision)
| Path | Size | Reason |
|------|------|--------|
| 360Rec / 360SANDBOX / $360Section | <2M | 用户保留 |

## After
| Total | Used | Free | Use% |
|-------|------|------|------|
| 301G | 155G | 146G | 52% |

## Reclaimed
**~19G**

## Context
用户要求清理C盘。先扫描全盘分类（绝对不能删/绝对能删/模棱两可/其他），用户确认后执行。
操作中发现：Docs 19G（xwechat 14G+WXWork 4G）、Desktop 11G（ai 7.6G+学业 2.9G）、Roaming 12G（Tencent 4.2G+kingsoft 1.8G），用户未决定处理，留待后续。
