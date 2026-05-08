import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettingsStore } from '../stores/settingsStore'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { settings, loaded, load, save } = useSettingsStore()
  const [keyInput, setKeyInput] = useState('')
  const [proxyInput, setProxyInput] = useState('')
  const [modelInput, setModelInput] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (settings) {
      setKeyInput(settings.apiKey)
      setProxyInput(settings.apiProxy)
      setModelInput(settings.model)
    }
  }, [settings])

  const handleSave = async () => {
    if (!settings) return
    await save({ ...settings, apiKey: keyInput, apiProxy: proxyInput, model: modelInput })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!loaded) return null

  return (
    <div className="h-screen bg-game-bg text-game-text flex flex-col">
      <header className="flex items-center gap-3 px-5 py-4 border-b border-game-border">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-game-border"
        >
          ←
        </button>
        <h1 className="text-lg font-bold">设置</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-5">
        <div>
          <label className="block text-sm text-game-text-dim mb-1">DeepSeek API Key</label>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="sk-..."
            className="w-full px-4 py-3 bg-game-panel border border-game-border rounded-lg text-game-text placeholder:text-game-text-dim/50 focus:outline-none focus:border-game-accent"
          />
          <p className="text-xs text-game-text-dim mt-1">
            在 platform.deepseek.com 获取，存储在浏览器本地
          </p>
        </div>

        <div>
          <label className="block text-sm text-game-text-dim mb-1">代理地址（可选）</label>
          <input
            type="text"
            value={proxyInput}
            onChange={(e) => setProxyInput(e.target.value)}
            placeholder="留空则直连 DeepSeek API"
            className="w-full px-4 py-3 bg-game-panel border border-game-border rounded-lg text-game-text placeholder:text-game-text-dim/50 focus:outline-none focus:border-game-accent"
          />
          <p className="text-xs text-game-text-dim mt-1">
            如遇到跨域问题，部署 Worker 后填入代理地址
          </p>
        </div>

        <div>
          <label className="block text-sm text-game-text-dim mb-1">模型</label>
          <select
            value={modelInput}
            onChange={(e) => setModelInput(e.target.value)}
            className="w-full px-4 py-3 bg-game-panel border border-game-border rounded-lg text-game-text focus:outline-none focus:border-game-accent"
          >
            <option value="deepseek-v4-pro">DeepSeek-V4 Pro（推荐）</option>
            <option value="deepseek-v4-flash">DeepSeek-V4 Flash（快速）</option>
          </select>
        </div>

        <div className="pt-2">
          <button
            onClick={handleSave}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              saved
                ? 'bg-game-success text-game-bg'
                : 'bg-game-accent text-game-bg active:scale-[0.98]'
            }`}
          >
            {saved ? '保存成功 ✓' : '保存设置'}
          </button>
        </div>
      </main>
    </div>
  )
}
