import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../stores/gameStore'
import type { SaveSlot } from '../types'
import { templateList } from '../templates'

export default function SaveSlotCard({ save }: { save: SaveSlot }) {
  const navigate = useNavigate()
  const { removeSave } = useGameStore()
  const template = templateList.find((t) => t.key === save.template)
  const stageIndex = save.currentStage
  const stage = save.stages[stageIndex] ?? '未知'
  const progress = Math.round(((stageIndex + 1) / save.stages.length) * 100)

  return (
    <div
      onClick={() => navigate(`/game/${save.id}`)}
      className="w-full p-4 bg-game-panel border border-game-border rounded-xl text-left active:scale-[0.98] transition-all hover:border-game-accent/30 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-game-text">{save.name}</span>
        <span className="text-xs text-game-text-dim">{template?.icon} {template?.name}</span>
      </div>

      <div className="text-xs text-game-text-dim mb-2">
        {save.characterName} · {stage} ({stageIndex + 1}/{save.stages.length})
      </div>

      <div className="w-full h-1.5 bg-game-bg rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-game-accent rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-game-text-dim">
        <span>{save.isEnded ? `结局：${save.ending}` : `${progress}%`}</span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (confirm('确定删除此存档？')) removeSave(save.id)
          }}
          className="px-2 py-1 rounded text-game-danger hover:bg-game-danger/10"
        >
          删除
        </button>
      </div>
    </div>
  )
}
