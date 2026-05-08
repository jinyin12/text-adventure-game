import type { GameTemplate, TemplateKey } from '../types'
import { templateList } from '../templates'

interface Props {
  selected: TemplateKey | null
  onSelect: (key: TemplateKey) => void
}

export default function TemplatePicker({ selected, onSelect }: Props) {
  const allTemplates: (GameTemplate | { key: TemplateKey; name: string; icon: string; desc: string })[] = [
    ...templateList,
    { key: 'custom', name: '自定义', icon: '✏️', desc: '完全自由设定世界观、角色和属性，打造属于你自己的独特世界' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {allTemplates.map((t) => (
        <button
          key={t.key}
          onClick={() => onSelect(t.key)}
          className={`p-4 rounded-xl border text-left transition-all ${
            selected === t.key
              ? 'border-game-accent bg-game-accent/10 shadow-[0_0_12px_var(--color-game-accent-glow)]'
              : 'border-game-border bg-game-panel hover:border-game-accent/30'
          }`}
        >
          <p className="text-3xl mb-2">{t.icon}</p>
          <p className="font-bold text-sm text-game-text">{t.name}</p>
          <p className="text-xs text-game-text-dim mt-1 line-clamp-2">{t.desc}</p>
        </button>
      ))}
    </div>
  )
}
