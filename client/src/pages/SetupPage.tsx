import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGameStore } from '../stores/gameStore'
import TemplatePicker from '../components/TemplatePicker'
import AttributeEditor from '../components/AttributeEditor'
import { getTemplate } from '../templates'
import { generateId } from '../utils/id'
import type { TemplateKey, AttributeDef, Difficulty } from '../types'

type Step = 'template' | 'difficulty' | 'config' | 'attrs'
const stepOrder: Step[] = ['template', 'difficulty', 'config', 'attrs']

export default function SetupPage() {
  const navigate = useNavigate()
  const { saveId } = useParams<{ saveId?: string }>()
  const { createSave, loadSave } = useGameStore()

  const [step, setStep] = useState<Step>('template')
  const [templateKey, setTemplateKey] = useState<TemplateKey>('campus')
  const [difficulty, setDifficulty] = useState<Difficulty>('normal')
  const [worldSetting, setWorldSetting] = useState('')
  const [characterName, setCharacterName] = useState('')
  const [characterDesc, setCharacterDesc] = useState('')
  const [timeSpan, setTimeSpan] = useState('')
  const [stagesText, setStagesText] = useState('')
  const [attributes, setAttributes] = useState<AttributeDef[]>([])

  useEffect(() => {
    if (saveId) loadSave(saveId)
  }, [saveId, loadSave])

  useEffect(() => {
    const template = getTemplate(templateKey)
    if (template && step === 'template') {
      setWorldSetting(template.worldSetting)
      setTimeSpan(template.stages.join(' → '))
      setStagesText(template.stages.join('\n'))
      setAttributes(template.attributes.map((a) => ({ ...a })))
    } else if (templateKey === 'custom') {
      setWorldSetting('')
      setTimeSpan('')
      setStagesText('')
      setAttributes([
        { name: '属性1', key: 'attr1', icon: '📊', initial: 50, min: 0, max: 100 },
        { name: '属性2', key: 'attr2', icon: '⭐', initial: 50, min: 0, max: 100 },
      ])
    }
  }, [templateKey])

  const stages = useMemo(
    () => stagesText.split('\n').filter((s) => s.trim()),
    [stagesText],
  )

  const currentIdx = stepOrder.indexOf(step)

  const goNext = () => {
    if (currentIdx < stepOrder.length - 1) {
      setStep(stepOrder[currentIdx + 1])
    }
  }

  const goBack = () => {
    if (currentIdx > 0) {
      setStep(stepOrder[currentIdx - 1])
    } else {
      navigate('/')
    }
  }

  const getStepTitle = (s: Step) => {
    switch (s) {
      case 'template': return '选择模板'
      case 'difficulty': return '游戏难度'
      case 'config': return '世界设定'
      case 'attrs': return '属性编辑'
    }
  }

  const handleCreate = async () => {
    if (!worldSetting.trim() || !characterName.trim()) return

    const attrValues: Record<string, number> = {}
    for (const a of attributes) {
      attrValues[a.key] = a.initial
    }

    const id = saveId ?? generateId()
    try {
      await createSave({
        id,
        name: `${characterName}的${templateKey === 'custom' ? '冒险' : templateKey === 'cultivation' ? '修仙之旅' : templateKey === 'career' ? '职场人生' : '校园时光'}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        worldSetting,
        template: templateKey,
        difficulty,
        characterName,
        characterDesc,
        timeSpan,
        stages,
        attributes,
        currentStage: 0,
        attributeValues: attrValues,
        history: [],
        isEnded: false,
      })
      navigate(`/game/${id}`)
    } catch (err) {
      alert('创建存档失败: ' + (err instanceof Error ? err.message : '未知错误'))
    }
  }

  return (
    <div className="h-screen bg-game-bg text-game-text flex flex-col">
      <header className="flex items-center gap-3 px-5 py-4 border-b border-game-border">
        <button onClick={goBack} className="w-10 h-10 flex items-center justify-center rounded-full border border-game-border">
          ←
        </button>
        <h1 className="text-lg font-bold">{getStepTitle(step)}</h1>
        <div className="flex-1" />
        <div className="flex gap-1.5">
          {stepOrder.map((s) => (
            <span key={s} className={`w-2 h-2 rounded-full transition-colors ${
              stepOrder.indexOf(s) <= currentIdx ? 'bg-game-accent' : 'bg-game-border'
            }`} />
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {step === 'template' && (
          <TemplatePicker selected={templateKey} onSelect={setTemplateKey} />
        )}

        {step === 'difficulty' && (
          <div className="space-y-4">
            <button
              onClick={() => setDifficulty('normal')}
              className={`w-full p-5 rounded-xl border text-left transition-all ${
                difficulty === 'normal'
                  ? 'border-game-warning bg-game-warning/10 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                  : 'border-game-border bg-game-panel hover:border-game-warning/30'
              }`}
            >
              <p className="text-3xl mb-2">⚖️</p>
              <p className="font-bold text-game-text mb-1">正常模式</p>
              <p className="text-sm text-game-text-dim">
                平衡的世界。努力通常有回报，意外偶尔发生。成功需要用心，但不会无路可走。
              </p>
              <div className="mt-3 flex gap-2 text-xs">
                <span className="px-2 py-1 bg-game-bg text-game-warning rounded">属性 ±10</span>
                <span className="px-2 py-1 bg-game-bg text-game-warning rounded">写实叙事</span>
                <span className="px-2 py-1 bg-game-bg text-game-warning rounded">适度挑战</span>
              </div>
            </button>

            <button
              onClick={() => setDifficulty('casual')}
              className={`w-full p-5 rounded-xl border text-left transition-all ${
                difficulty === 'casual'
                  ? 'border-game-accent bg-game-accent/10 shadow-[0_0_12px_var(--color-game-accent-glow)]'
                  : 'border-game-border bg-game-panel hover:border-game-accent/30'
              }`}
            >
              <p className="text-3xl mb-2">🎮</p>
              <p className="font-bold text-game-text mb-1">休闲模式</p>
              <p className="text-sm text-game-text-dim">
                轻松愉快的冒险。属性增长快，选项大多有益，故事温暖有趣。即使失败也充满希望。
              </p>
              <div className="mt-3 flex gap-2 text-xs text-game-text-dim">
                <span className="px-2 py-1 bg-game-bg rounded">属性 ±15</span>
                <span className="px-2 py-1 bg-game-bg rounded">轻松叙事</span>
                <span className="px-2 py-1 bg-game-bg rounded">容错率高</span>
              </div>
            </button>

            <button
              onClick={() => setDifficulty('hardcore')}
              className={`w-full p-5 rounded-xl border text-left transition-all ${
                difficulty === 'hardcore'
                  ? 'border-game-danger bg-game-danger/10 shadow-[0_0_12px_rgba(248,113,113,0.3)]'
                  : 'border-game-border bg-game-panel hover:border-game-danger/30'
              }`}
            >
              <p className="text-3xl mb-2">💀</p>
              <p className="font-bold text-game-text mb-1">硬核真实模式</p>
              <p className="text-sm text-game-text-dim">
                残酷真实的世界。属性增长极慢，危险无处不在，每个选择都有隐藏代价。成功需要运气和智慧。
              </p>
              <div className="mt-3 flex gap-2 text-xs">
                <span className="px-2 py-1 bg-game-bg text-game-danger rounded">属性 ±5</span>
                <span className="px-2 py-1 bg-game-bg text-game-danger rounded">高随机性</span>
                <span className="px-2 py-1 bg-game-bg text-game-danger rounded">隐藏风险</span>
                <span className="px-2 py-1 bg-game-bg text-game-danger rounded">可能暴毙</span>
              </div>
            </button>
          </div>
        )}

        {step === 'config' && (
          <div className="space-y-5">
            <div>
              <label className="text-sm text-game-text-dim block mb-1">世界观设定</label>
              <textarea
                value={worldSetting}
                onChange={(e) => setWorldSetting(e.target.value)}
                className="w-full h-32 px-4 py-3 bg-game-panel border border-game-border rounded-lg text-game-text resize-none focus:outline-none focus:border-game-accent text-sm"
                placeholder="描绘这个世界的样子..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-game-text-dim block mb-1">角色名称</label>
                <input
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  className="w-full px-4 py-3 bg-game-panel border border-game-border rounded-lg text-game-text focus:outline-none focus:border-game-accent"
                  placeholder="你的名字"
                />
              </div>
              <div>
                <label className="text-sm text-game-text-dim block mb-1">角色设定</label>
                <input
                  value={characterDesc}
                  onChange={(e) => setCharacterDesc(e.target.value)}
                  className="w-full px-4 py-3 bg-game-panel border border-game-border rounded-lg text-game-text focus:outline-none focus:border-game-accent"
                  placeholder="简短描述"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-game-text-dim block mb-1">时间跨度</label>
              <input
                value={timeSpan}
                onChange={(e) => setTimeSpan(e.target.value)}
                className="w-full px-4 py-3 bg-game-panel border border-game-border rounded-lg text-game-text focus:outline-none focus:border-game-accent"
                placeholder="如：练气期 → 筑基期 → 金丹期"
              />
            </div>
            <div>
              <label className="text-sm text-game-text-dim block mb-1">阶段（每行一个）</label>
              <textarea
                value={stagesText}
                onChange={(e) => setStagesText(e.target.value)}
                className="w-full h-24 px-4 py-3 bg-game-panel border border-game-border rounded-lg text-game-text resize-none focus:outline-none focus:border-game-accent text-sm"
                placeholder={'练气初期\n练气中期\n练气后期\n筑基期\n金丹期\n元婴期\n化神期\n渡劫飞升'}
              />
            </div>
          </div>
        )}

        {step === 'attrs' && (
          <AttributeEditor attributes={attributes} onChange={setAttributes} />
        )}
      </main>

      <footer className="p-4 border-t border-game-border">
        {step !== 'attrs' ? (
          <button
            onClick={goNext}
            className="w-full py-4 bg-game-accent text-game-bg rounded-xl font-bold active:scale-[0.98] transition-transform"
          >
            下一步
          </button>
        ) : (
          <button
            onClick={handleCreate}
            disabled={!worldSetting.trim() || !characterName.trim() || attributes.length < 2 || stages.length < 2}
            className={`w-full py-4 rounded-xl font-bold transition-all ${
              worldSetting.trim() && characterName.trim() && attributes.length >= 2 && stages.length >= 2
                ? 'bg-game-accent text-game-bg active:scale-[0.98]'
                : 'bg-game-border text-game-text-dim cursor-not-allowed'
            }`}
          >
            开始冒险
          </button>
        )}
      </footer>
    </div>
  )
}
