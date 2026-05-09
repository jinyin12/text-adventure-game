import type { SaveSlot, AttributeDef } from '../types'

// ============================================================
// 硬核真实模式 — 后处理引擎
// 参考: University Survival OS v3.0 GDD
// ============================================================

// --- 1. 执行力度检定 (Procrastination Check) ---
// 模拟人的拖延倾向。即使玩家选了一个行动，也不一定能执行到位。

export interface ExecutionResult {
  passed: boolean
  multiplier: number // 属性变化倍率
  narrativePrefix: string
}

export function executionCheck(save: SaveSlot): ExecutionResult {
  // 找"执行力"相关属性: 体能/心态/修为/道心/能力 等
  const execKeys = ['tineng', 'tili', 'xintai', 'daoxin', 'nengli', 'xiuwei']
  let execVal = 50 // 默认
  for (const key of execKeys) {
    if (save.attributeValues[key] !== undefined) {
      execVal = save.attributeValues[key]
      break
    }
  }

  const roll = Math.random() * 100
  const passed = roll <= execVal

  if (passed) {
    return { passed: true, multiplier: 1.0, narrativePrefix: '' }
  }

  // 拖延分支
  const scenarios = [
    { multiplier: 0, prefix: '你本想立刻行动，但拖延症发作，刷了半天手机，什么也没做成。' },
    { multiplier: 0.3, prefix: '犹豫再三后你勉为其难地开始了，但已经浪费了大半时间。' },
    { multiplier: 0.2, prefix: '计划赶不上变化——突如其来的琐事打乱了你的节奏，最终只完成了一小部分。' },
    { multiplier: 0, prefix: '你告诉自己"明天一定开始"，然后心安理得地继续摆烂。' },
    { multiplier: 0.3, prefix: '你磨蹭了很久才开始动手，效率比预期低了太多。' },
  ]

  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]
  return {
    passed: false,
    multiplier: scenario.multiplier,
    narrativePrefix: scenario.prefix,
  }
}

// --- 2. 属性衰减 (Forgetting/Decay Curve) ---
// 长期不使用的属性会自然衰减。每回合调用。
// 参考 Ebbinghaus: R(t) = e^(-Δd / S)

export function applyDecay(save: SaveSlot): Record<string, number> {
  const decay: Record<string, number> = {}

  for (const attr of save.attributes) {
    // 找出该属性最近一次被使用的回合
    const lastUsed = findLastUsed(save, attr.key)
    if (lastUsed === -1) continue // 还没用过，不衰减

    const turnsSince = save.history.length - lastUsed
    if (turnsSince < 3) continue // 3 回合内不衰减

    // 衰减速度由属性当前值决定: 越高越难保持
    const val = save.attributeValues[attr.key] ?? attr.initial
    const stability = Math.max(1, 10 - (100 - val) / 15)
    const retention = Math.exp(-turnsSince / stability)
    const newVal = Math.round(Math.max(attr.min, val * retention))
    const delta = newVal - val

    if (delta < 0) {
      decay[attr.key] = delta
    }
  }

  return decay
}

function findLastUsed(save: SaveSlot, attrKey: string): number {
  // 从最近的回合往前找
  for (let i = save.history.length - 1; i >= 0; i--) {
    const turn = save.history[i]
    if (turn.attributeChanges[attrKey] && turn.attributeChanges[attrKey] !== 0) {
      return i
    }
  }
  return -1
}

// --- 3. 精力效率修正 (Energy Efficiency) ---
// 低心情/低体能时，正面属性增长打折

export function energyEfficiency(save: SaveSlot): number {
  const energyKeys = ['xintai', 'tili', 'tineng', 'shenshi']
  let energy = 50
  for (const key of energyKeys) {
    if (save.attributeValues[key] !== undefined) {
      energy = save.attributeValues[key]
      break
    }
  }

  if (energy <= 20) return 0.5  // exhausted
  if (energy <= 40) return 0.8  // tired
  if (energy <= 60) return 1.0  // normal
  if (energy <= 80) return 1.1  // energetic
  return 1.3                    // hyper
}

// --- 4. 危险属性检查 ---
// 任一属性归零 → 坏结局触发

export function checkCritical(save: SaveSlot): string | null {
  for (const attr of save.attributes) {
    const val = save.attributeValues[attr.key] ?? attr.initial
    if (val <= attr.min) {
      // 不同属性归零有不同死法
      const deathMessages: Record<string, string> = {
        xintai: '心态彻底崩溃，你陷入了深度抑郁，无法继续正常生活。',
        tili: '身体被彻底透支，一场大病将你击倒。',
        tineng: '体能极限被突破，你因过度劳累倒下。',
        daoxin: '道心破碎，修为尽散，修仙之路到此为止。',
        xiuwei: '修为跌入谷底，根基尽毁，再也无法修炼。',
      }
      return deathMessages[attr.key] ?? `${attr.name}降到了最低点，你的旅程走到了尽头。`
    }
  }
  return null
}

// --- 5. 属性成长难度曲线 ---
// 属性越高越难涨: difficulty(v) = 250 / (110 - v)
// 返回倍率 (0.1 ~ 1.0)

export function growthDifficulty(value: number): number {
  if (value >= 100) return 0
  const d = 250 / (110 - value)
  return Math.max(0.1, 1 / d)
}

// --- 6. 综合：硬核回合处理 ---

export interface HardcoreResult {
  execution: ExecutionResult
  decay: Record<string, number>
  efficiency: number
  criticalDeath: string | null
}

export function processHardcoreTurn(save: SaveSlot): HardcoreResult {
  return {
    execution: executionCheck(save),
    decay: applyDecay(save),
    efficiency: energyEfficiency(save),
    criticalDeath: checkCritical(save),
  }
}
