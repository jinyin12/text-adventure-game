import type { AttributeDef } from '../types'

interface Props {
  attributes: AttributeDef[]
  values: Record<string, number>
  stage: string
  stageIndex: number
  totalStages: number
  open: boolean
  onClose: () => void
}

export default function AttributePanel({
  attributes,
  values,
  stage,
  stageIndex,
  totalStages,
  open,
  onClose,
}: Props) {
  const progress = Math.round(((stageIndex + 1) / totalStages) * 100)

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Panel */}
      <div
        className={`absolute right-0 top-0 h-full w-72 bg-game-panel border-l border-game-border p-5 transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-game-text-dim uppercase">角色属性</h2>
          <button onClick={onClose} className="text-game-text-dim hover:text-game-text">✕</button>
        </div>

        <div className="space-y-3 mb-6">
          {attributes.map((attr) => {
            const val = values[attr.key] ?? attr.initial
            const pct = Math.round(((val - attr.min) / (attr.max - attr.min)) * 100)
            const barColor = pct > 70 ? 'bg-game-success' : pct > 30 ? 'bg-game-accent' : 'bg-game-danger'
            return (
              <div key={attr.key}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>{attr.icon} {attr.name}</span>
                  <span className="text-game-text-dim">{val}</span>
                </div>
                <div className="w-full h-2 bg-game-bg rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div className="border-t border-game-border pt-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-game-text-dim">当前阶段</span>
            <span className="font-bold">{stage}</span>
          </div>
          <div className="text-xs text-game-text-dim mb-1">进度</div>
          <div className="w-full h-2 bg-game-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-game-accent to-game-success rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-game-text-dim mt-1">{progress}%</p>
        </div>
      </div>
    </div>
  )
}
