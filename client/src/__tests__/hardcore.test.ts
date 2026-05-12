import { describe, it, expect, vi } from 'vitest'
import {
  executionCheck,
  applyDecay,
  energyEfficiency,
  checkCritical,
  growthDifficulty,
  processHardcoreTurn,
} from '../engine/hardcore'
import type { SaveSlot } from '../types'

function makeSave(overrides: Partial<SaveSlot> = {}): SaveSlot {
  return {
    id: 'test-save',
    name: 'Test',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    worldSetting: '',
    template: 'custom',
    difficulty: 'hardcore',
    characterName: 'Test',
    characterDesc: '',
    timeSpan: '',
    stages: ['阶段1', '阶段2'],
    attributes: [
      { name: '执行', key: 'zhixingli', icon: '', initial: 50, min: 0, max: 100 },
      { name: '体力', key: 'tili', icon: '', initial: 80, min: 0, max: 100 },
      { name: '心态', key: 'xintai', icon: '', initial: 70, min: 0, max: 100 },
    ],
    currentStage: 0,
    attributeValues: { zhixingli: 50, tili: 80, xintai: 70 },
    history: [],
    isEnded: false,
    ...overrides,
  }
}

describe('executionCheck', () => {
  it('passes when roll <= execution value', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3) // roll = 30
    const result = executionCheck(makeSave())
    expect(result.passed).toBe(true)
    expect(result.multiplier).toBe(1.0)
    vi.restoreAllMocks()
  })

  it('fails when roll > execution value', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.8) // roll = 80
    const result = executionCheck(makeSave())
    expect(result.passed).toBe(false)
    expect(result.multiplier).toBeLessThan(1.0)
    vi.restoreAllMocks()
  })
})

describe('applyDecay', () => {
  it('returns empty decay when no attribute has been used', () => {
    const result = applyDecay(makeSave())
    expect(Object.keys(result)).toHaveLength(0)
  })

  it('decays an attribute unused for many turns', () => {
    const save = makeSave({
      history: [
        { id: 0, narrative: '', choices: [], playerInput: '', attributeChanges: { tili: -5 } },
        { id: 1, narrative: '', choices: [], playerInput: '', attributeChanges: {} },
        { id: 2, narrative: '', choices: [], playerInput: '', attributeChanges: {} },
        { id: 3, narrative: '', choices: [], playerInput: '', attributeChanges: {} },
        { id: 4, narrative: '', choices: [], playerInput: '', attributeChanges: {} },
      ],
    })
    // tili was last used at index 0, now at turn 5, delta = 5
    // stability for val=80: max(1, 10 - (100-80)/15) = max(1, 8.67) = 8.67
    // retention = e^(-5/8.67) ≈ e^(-0.577) ≈ 0.562
    // newVal = round(max(0, 80 * 0.562)) = round(44.9) = 45
    // delta = 45 - 80 = -35
    const result = applyDecay(save)
    expect(result.tili).toBeDefined()
    expect(result.tili!).toBeLessThan(0)
  })
})

describe('energyEfficiency', () => {
  it('returns 1.3 when energy is hyper', () => {
    // energyEfficiency checks xintai first
    expect(energyEfficiency(makeSave({ attributeValues: { zhixingli: 50, tili: 50, xintai: 90 } }))).toBe(1.3)
  })

  it('returns 0.5 when energy is exhausted', () => {
    expect(energyEfficiency(makeSave({ attributeValues: { zhixingli: 50, tili: 50, xintai: 10 } }))).toBe(0.5)
  })

  it('returns 1.0 for normal energy', () => {
    expect(energyEfficiency(makeSave({ attributeValues: { zhixingli: 50, tili: 50, xintai: 50 } }))).toBe(1.0)
  })
})

describe('checkCritical', () => {
  it('returns null when all attributes are safe', () => {
    expect(checkCritical(makeSave())).toBeNull()
  })

  it('returns death message when attribute reaches min', () => {
    const save = makeSave({
      attributeValues: { zhixingli: 50, tili: 0, xintai: 50 },
    })
    expect(checkCritical(save)).toBeTruthy()
  })
})

describe('growthDifficulty', () => {
  it('returns higher difficulty for higher values', () => {
    const low = growthDifficulty(20)
    const high = growthDifficulty(90)
    expect(low).toBeGreaterThan(high)
  })

  it('returns 0 at value 100', () => {
    expect(growthDifficulty(100)).toBe(0)
  })

  it('returns at least 0.1', () => {
    expect(growthDifficulty(99)).toBeGreaterThanOrEqual(0.1)
  })
})

describe('processHardcoreTurn', () => {
  it('returns all four result types', () => {
    const save = makeSave()
    const result = processHardcoreTurn(save)
    expect(result).toHaveProperty('execution')
    expect(result).toHaveProperty('decay')
    expect(result).toHaveProperty('efficiency')
    expect(result).toHaveProperty('criticalDeath')
  })
})
