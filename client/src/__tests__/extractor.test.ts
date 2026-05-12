import { describe, it, expect } from 'vitest'
import { extractStreamingNarrative } from '../engine/extractor'

describe('extractStreamingNarrative', () => {
  it('extracts narrative from JSON stream', () => {
    const result = extractStreamingNarrative('"narrative":"你好世界","choices"')
    expect(result).toBe('你好世界')
  })

  it('returns empty string when no marker found', () => {
    expect(extractStreamingNarrative('no marker here')).toBe('')
  })

  it('handles escaped characters', () => {
    const result = extractStreamingNarrative('"narrative":"第一行\\n第二行\\t缩进","choices"')
    expect(result).toBe('第一行\n第二行\t缩进')
  })

  it('stops at closing quote followed by comma or brace', () => {
    const result = extractStreamingNarrative('"narrative":"文本内容","choices"')
    expect(result).toBe('文本内容')
  })

  it('handles partial stream (no closing quote)', () => {
    const result = extractStreamingNarrative('"narrative":"未完成的')
    expect(result).toBe('未完成的')
  })

  it('handles escaped quote inside narrative', () => {
    const result = extractStreamingNarrative('"narrative":"他说\\"你好\\"后离开","choices"')
    expect(result).toBe('他说"你好"后离开')
  })

  it('matches marker with space after colon', () => {
    const result = extractStreamingNarrative('"narrative": "带空格的","choices"')
    expect(result).toBe('带空格的')
  })
})
