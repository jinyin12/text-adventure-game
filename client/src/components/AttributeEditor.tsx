import type { AttributeDef } from '../types'

interface Props {
  attributes: AttributeDef[]
  onChange: (attrs: AttributeDef[]) => void
}

export default function AttributeEditor({ attributes, onChange }: Props) {
  const updateAttr = (index: number, field: keyof AttributeDef, value: string | number) => {
    const next = attributes.map((a, i) => (i === index ? { ...a, [field]: value } : a))
    onChange(next)
  }

  const addAttr = () => {
    const newKey = `attr_${Date.now()}`
    onChange([...attributes, { name: '新属性', key: newKey, icon: '📊', initial: 50, min: 0, max: 100 }])
  }

  const removeAttr = (index: number) => {
    if (attributes.length <= 2) return // Minimum 2 attributes
    onChange(attributes.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-game-text-dim uppercase">属性设定</h2>
        <button
          onClick={addAttr}
          className="px-3 py-1 text-xs border border-game-border rounded-lg text-game-accent hover:bg-game-accent/10"
        >
          + 添加属性
        </button>
      </div>

      <div className="space-y-2">
        {attributes.map((attr, i) => (
          <div key={attr.key} className="flex items-center gap-2 p-3 bg-game-panel border border-game-border rounded-lg">
            <input
              value={attr.icon}
              onChange={(e) => updateAttr(i, 'icon', e.target.value)}
              className="w-10 text-center text-lg bg-transparent"
              title="图标"
            />
            <input
              value={attr.name}
              onChange={(e) => updateAttr(i, 'name', e.target.value)}
              className="flex-1 bg-transparent text-game-text text-sm font-bold min-w-0 focus:outline-none border-b border-transparent focus:border-game-accent"
              placeholder="属性名"
            />
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={attr.initial}
                onChange={(e) => updateAttr(i, 'initial', Number(e.target.value))}
                className="w-12 bg-transparent text-game-text text-sm text-center focus:outline-none border-b border-transparent focus:border-game-accent"
                title="初始值"
              />
            </div>
            <button
              onClick={() => removeAttr(i)}
              className="text-game-text-dim hover:text-game-danger text-xs px-1"
              disabled={attributes.length <= 2}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
