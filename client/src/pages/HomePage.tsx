import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../stores/gameStore'
import { useSettingsStore } from '../stores/settingsStore'
import SaveSlotCard from '../components/SaveSlotCard'

export default function HomePage() {
  const navigate = useNavigate()
  const { saves, loadSaves } = useGameStore()
  const { load } = useSettingsStore()

  useEffect(() => {
    loadSaves()
    load()
  }, [loadSaves, load])

  return (
    <div className="h-screen bg-game-bg text-game-text flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-game-border">
        <h1 className="text-xl font-bold text-game-accent">AI 文字冒险</h1>
        <button
          onClick={() => navigate('/settings')}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-game-border text-game-text-dim hover:text-game-text transition-colors"
        >
          ⚙
        </button>
      </header>

      {/* Save list */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        {saves.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-game-text-dim gap-4">
            <p className="text-4xl">📜</p>
            <p>还没有存档</p>
            <p className="text-sm">点击下方按钮开始你的冒险</p>
          </div>
        ) : (
          <div className="space-y-3">
            {saves.map((save) => (
              <SaveSlotCard key={save.id} save={save} />
            ))}
          </div>
        )}
      </main>

      {/* Bottom action */}
      <footer className="p-4 border-t border-game-border">
        <button
          onClick={() => navigate('/setup')}
          className="w-full py-4 bg-game-accent text-game-bg rounded-xl font-bold text-lg active:scale-[0.98] transition-transform"
        >
          开始新游戏
        </button>
      </footer>
    </div>
  )
}
