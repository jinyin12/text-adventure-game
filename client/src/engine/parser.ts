import type { GameEngineResponse } from './prompt'

export function parseResponse(text: string): GameEngineResponse {
  // Try direct JSON parse first
  const attempts = [
    text,
    text.match(/\{[\s\S]*\}/)?.[0] ?? '',
    text.replace(/```json\s*([\s\S]*?)```/, '$1').trim(),
    text.replace(/```\s*([\s\S]*?)```/, '$1').trim(),
  ]

  for (const attempt of attempts) {
    if (!attempt) continue
    try {
      const parsed = JSON.parse(attempt)
      if (validateResponse(parsed)) {
        return {
          narrative: parsed.narrative,
          choices: parsed.choices.slice(0, 3).map((c: { text: string; hint?: string }) => ({
            text: c.text,
            hint: c.hint,
          })),
          attribute_changes: parsed.attribute_changes ?? {},
          milestone: parsed.milestone ?? null,
        }
      }
    } catch {
      // Try next extraction method
    }
  }

  throw new Error('无法解析游戏引擎响应，请重试')
}

function validateResponse(obj: unknown): obj is GameEngineResponse {
  if (!obj || typeof obj !== 'object') return false
  const o = obj as Record<string, unknown>
  return (
    typeof o.narrative === 'string' &&
    Array.isArray(o.choices) &&
    o.choices.length >= 1 &&
    typeof o.choices[0] === 'object' &&
    typeof (o.choices[0] as Record<string, unknown>).text === 'string'
  )
}
