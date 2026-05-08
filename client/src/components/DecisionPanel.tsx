import { useState } from 'react'
import type { GameChoice } from '../types'

interface Props {
  choices: GameChoice[]
  loading: boolean
  onSelect: (text: string) => void
  onCustom: (text: string) => void
}

export default function DecisionPanel({ choices, loading, onSelect, onCustom }: Props) {
  const [customInput, setCustomInput] = useState('')
  const [mode, setMode] = useState<'choices' | 'custom'>('choices')

  const handleCustomSubmit = () => {
    if (!customInput.trim() || loading) return
    onCustom(customInput.trim())
    setCustomInput('')
    setMode('choices')
  }

  if (mode === 'custom') {
    return (
      <div className="p-4 border-t border-game-border space-y-3">
        <div className="flex items-center gap-2">
          <input
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="输入你想要的行动..."
            className="flex-1 px-4 py-3 bg-game-panel border border-game-border rounded-lg text-game-text text-sm focus:outline-none focus:border-game-accent"
            autoFocus
            disabled={loading}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
          />
          <button
            onClick={handleCustomSubmit}
            disabled={!customInput.trim() || loading}
            className="px-4 py-3 bg-game-accent text-game-bg rounded-lg font-bold text-sm disabled:opacity-50"
          >
            确定
          </button>
        </div>
        <button
          onClick={() => setMode('choices')}
          className="text-xs text-game-text-dim underline"
        >
          返回选项
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 border-t border-game-border space-y-2">
      {choices.length > 0 ? (
        choices.map((c, i) => (
          <button
            key={i}
            onClick={() => onSelect(c.text)}
            disabled={loading}
            className="w-full p-3 bg-game-panel border border-game-border rounded-xl text-left active:scale-[0.98] transition-all hover:border-game-accent/40 disabled:opacity-50"
          >
            <div className="flex items-start gap-2">
              <span className="text-game-accent font-bold text-sm shrink-0 mt-0.5">
                {String.fromCharCode(65 + i)}.
              </span>
              <div>
                <p className="text-sm text-game-text">{c.text}</p>
                {c.hint && (
                  <p className="text-xs text-game-text-dim mt-0.5">{c.hint}</p>
                )}
              </div>
            </div>
          </button>
        ))
      ) : (
        <p className="text-center text-game-text-dim text-sm py-4">等待选项生成...</p>
      )}

      {!loading && choices.length > 0 && (
        <button
          onClick={() => setMode('custom')}
          className="w-full py-2 text-xs text-game-text-dim hover:text-game-accent transition-colors"
        >
          ✏️ 输入自己的行动...
        </button>
      )}
    </div>
  )
}
