import type { GameTemplate, TemplateKey } from '../types'
import { cultivationTemplate } from './cultivation'
import { careerTemplate } from './career'
import { campusTemplate } from './campus'

export const templates: Record<TemplateKey, GameTemplate | null> = {
  cultivation: cultivationTemplate,
  career: careerTemplate,
  campus: campusTemplate,
  custom: null,
}

export function getTemplate(key: TemplateKey): GameTemplate | undefined {
  const t = templates[key]
  return t ?? undefined
}

export const templateList: GameTemplate[] = [
  cultivationTemplate,
  careerTemplate,
  campusTemplate,
]
