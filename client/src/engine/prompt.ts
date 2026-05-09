import type { SaveSlot, Difficulty } from '../types'

function getDifficultyRules(d: Difficulty): string {
  if (d === 'normal') {
    return `## 正常模式规则
1. 这是一个平衡的世界，努力通常有回报，但意外也可能发生。
2. 属性变化幅度适中，单次±10以内。
3. 3个选项各有优劣，1-2个可能带有轻微风险。
4. 角色状态差时（属性低于20），叙事中应有所体现但不至于绝望。
5. 偶尔出现意外事件，但不会是毁灭性的。
6. 叙事风格写实但不残酷，成功需要努力但不会毫无希望。`
  }

  if (d === 'hardcore') {
    return `## 硬核真实模式规则

### 核心原则
这是一个残酷而真实的世界。好事不会凭空发生，坏事却接踵而至。没有完美的选择，只有代价较小的选择。

### 属性成长难度曲线
属性越高越难提升。模拟真实学习曲线——从50分进步到60分很容易，从90分进步到95分极其困难。
- 低属性(≤30): 容易成长，每次+5~8
- 中属性(31-60): 正常成长，每次+3~5
- 高属性(61-80): 缓慢成长，每次+1~3
- 极高属性(>80): 极难成长，每次+0~1，且退步风险大

### 精力效率机制
低核心属性会导致所有行为效率打折:
- 心态/体能≤20: 效率×0.5 (筋疲力尽)
- 心态/体能21-40: 效率×0.8 (疲惫)
- 心态/体能41-60: 效率×1.0 (正常)
- 心态/体能61-80: 效率×1.1 (精力充沛)
- 心态/体能>80: 效率×1.3 (亢奋状态)

### 拖延与执行失败
人类不是机器。即使玩家做出选择，角色也可能因为拖延、分心、意外而无法执行:
- 有概率出现"你本想做X但你刷了半天手机"的情况
- 至少有1/3的选项暗示拖延或执行失败的风险
- 叙事中偶尔出现"你告诉自己明天一定开始"的自我欺骗

### 遗忘与退化
长期不使用的属性会自然衰减。已经在某个领域很强的能力，如果不持续维护也会退步。

### 危险状态
角色属性低于30时，叙事中应体现对应负面影响:
- 体力低: 容易生病、精力不济
- 心态低: 焦虑、失眠、社交退缩
- 智力低: 理解力下降、考试挂科风险
- 任何属性归零→触发不可逆的坏结局

### 选项设计
- 给出3个选项，至少有1个带有明显的负面后果或风险
- 选项的"hint"提示应诚实反映可能的风险，但可以留有余地
- 加入真实生活的不确定性: 突如其来的倒霉事、他人背叛、计划外变化

### 叙事风格
冷峻、写实，不带感情滤镜。像纪录片一样描述发生的事件。坏结局和失败是常态，成功需要运气和正确决策的累积。`
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
