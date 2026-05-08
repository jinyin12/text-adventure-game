import type { SaveSlot, Difficulty } from '../types'

function getDifficultyRules(d: Difficulty): string {
  if (d === 'hardcore') {
    return `## 硬核真实模式规则
1. 这是一个残酷而真实的世界。好事不会凭空发生，坏事却接踵而至。
2. 属性变化幅度很小，单次±5以内。进步需要持续努力，退步却可能一蹴而就。
3. 每个选择都有潜在风险——即使是看起来安全的选项也可能有隐藏的代价。
4. 给出3个选项中，至少有1个带有明显的负面后果或风险。
5. 角色状态差时（属性低于30），应出现更多不利事件和更少的好选择。
6. 加入真实生活的不确定性：突如其来的倒霉事、他人背叛、计划之外的变化。
7. 没有完美的选择，只有代价较小的选择。每一个决定都有得有失。
8. 叙事要冷峻、写实，不带感情滤镜。坏结局和失败是常态，成功需要运气和正确决策的累积。
9. 关键属性归零时，角色可能面临死亡、崩溃或不可逆转的失败。`
  }

  // casual mode
  return `## 休闲模式规则
1. 这是一个轻松愉快的冒险世界，努力总有回报，挫折只是暂时的。
2. 属性变化幅度可以较大，单次±15以内。
3. 大多数选择导向积极的发展，负面后果轻微且可逆。
4. 3个选项应各有吸引力，让玩家体验不同的有趣方向。
5. 叙事温暖、有趣，富有感染力。即使是失败也充满戏剧性和希望。
6. 角色状态不会真正陷入绝境，总能找到转机。`
}

export function buildSystemPrompt(save: SaveSlot): string {
  const stageIndex = save.currentStage
  const currentStage = save.stages[stageIndex] ?? '未知'
  const totalStages = save.stages.length

  const attrLines = save.attributes
    .map((a) => `${a.icon} ${a.name}: ${save.attributeValues[a.key] ?? a.initial}`)
    .join('\n')

  const stageDesc = stageIndex < totalStages - 1
    ? `当前阶段: ${currentStage}（${stageIndex + 1}/${totalStages}）`
    : `当前阶段: ${currentStage} — 这是最后一个阶段，请准备走向结局。`

  const critAttrs = save.attributes
    .filter((a) => (save.attributeValues[a.key] ?? a.initial) < 30)
    .map((a) => `${a.icon}${a.name}`)

  const critWarning = critAttrs.length > 0
    ? `\n\n⚠️ 以下属性处于危险状态: ${critAttrs.join('、')}。请在叙事和选项中体现对应的负面影响。`
    : ''

  return `你是一个沉浸式文字冒险游戏的游戏引擎。

## 世界观
${save.worldSetting}

## 玩家角色
${save.characterName}：${save.characterDesc}

## 时间跨度
${save.timeSpan}

## 当前属性
${attrLines}${critWarning}

## 阶段
${stageDesc}

${getDifficultyRules(save.difficulty)}

## 输出格式
严格按照以下JSON格式输出，不要在JSON外输出任何内容：
{"narrative": "场景叙述...", "choices": [{"text": "选项一", "hint": "可能的影响（用简短的话暗示）"}, {"text": "选项二", "hint": "可能的影响"}, {"text": "选项三", "hint": "可能的影响"}], "attribute_changes": {"key": value, ...}, "milestone": "里程碑事件（可选，无则填null）"}`
}

export function buildConversationHistory(save: SaveSlot) {
  const messages: { role: 'user' | 'assistant'; content: string }[] = []

  for (const turn of save.history) {
    messages.push({ role: 'user', content: turn.playerInput })
    messages.push({
      role: 'assistant',
      content: JSON.stringify({
        narrative: turn.narrative,
        choices: turn.choices,
        attribute_changes: turn.attributeChanges,
        milestone: turn.milestone ?? null,
      }),
    })
  }

  return messages
}

export interface GameEngineResponse {
  narrative: string
  choices: { text: string; hint?: string }[]
  attribute_changes: Record<string, number>
  milestone: string | null
}
