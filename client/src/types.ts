export type TemplateKey = 'cultivation' | 'career' | 'campus' | 'custom'
export type Difficulty = 'casual' | 'hardcore'

export interface AttributeDef {
  name: string
  key: string
  icon: string
  initial: number
  min: number
  max: number
}

export interface GameChoice {
  text: string
  hint?: string
}

export interface GameTurn {
  id: number
  narrative: string
  choices: GameChoice[]
  playerInput: string
  attributeChanges: Record<string, number>
  milestone?: string
}

export interface SaveSlot {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  worldSetting: string
  template: TemplateKey
  difficulty: Difficulty
  characterName: string
  characterDesc: string
  timeSpan: string
  stages: string[]
  attributes: AttributeDef[]
  currentStage: number
  attributeValues: Record<string, number>
  history: GameTurn[]
  isEnded: boolean
  ending?: string
}

export interface Settings {
  apiKey: string
  apiProxy: string
  model: string
  theme: 'dark' | 'light'
}

export interface GameTemplate {
  key: TemplateKey
  name: string
  icon: string
  desc: string
  worldSetting: string
  stages: string[]
  attributes: AttributeDef[]
}
