import { describe, it, expect } from 'vitest'
import { parseResponse } from '../engine/parser'

describe('parseResponse', () => {
  it('parses a valid JSON response', () => {
    const json = JSON.stringify({
      narrative: '你走进了一间黑暗的房间。',
      choices: [
        { text: '点亮火炬', hint: '消耗燃料' },
        { text: '摸黑前进', hint: '有风险' },
      ],
      attribute_changes: { tili: -5 },
      milestone: '进入地下城',
    })
    const result = parseResponse(json)
    expect(result.narrative).toBe('你走进了一间黑暗的房间。')
    expect(result.choices).toHaveLength(2)
    expect(result.attribute_changes).toEqual({ tili: -5 })
    expect(result.milestone).toBe('进入地下城')
  })

  it('extracts JSON from markdown code block', () => {
    const md = '```json\n{"narrative":"测试","choices":[{"text":"选项"}]}\n```'
    const result = parseResponse(md)
    expect(result.narrative).toBe('测试')
  })

  it('extracts JSON surrounded by text', () => {
    const text = '前缀文本\n{"narrative":"核心内容","choices":[{"text":"A"}]}\n后缀'
    const result = parseResponse(text)
    expect(result.narrative).toBe('核心内容')
  })

  it('caps choices at 3', () => {
    const json = JSON.stringify({
      narrative: 'x',
      choices: [
        { text: '1' }, { text: '2' }, { text: '3' }, { text: '4' }, { text: '5' },
      ],
    })
    const result = parseResponse(json)
    expect(result.choices).toHaveLength(3)
  })

  it('throws on unparseable input', () => {
    expect(() => parseResponse('not json at all')).toThrow('无法解析游戏引擎响应')
  })

  it('throws on missing required fields', () => {
    expect(() => parseResponse('{"narrative":"x"}')).toThrow('无法解析游戏引擎响应')
  })
})
