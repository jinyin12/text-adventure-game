import { useState, useEffect, useCallback, useRef, memo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGameStore } from '../stores/gameStore'
import { useSettingsStore } from '../stores/settingsStore'
import { buildSystemPrompt, buildConversationHistory, streamDeepSeek, parseResponse, processHardcoreTurn, checkCritical } from '../engine'
import { StreamingBuffer } from '../engine/extractor'
import type { GameEngineResponse } from '../engine/prompt'
import type { HardcoreResult } from '../engine/hardcore'
import type { AttributeDef } from '../types'
import NarrativeArea from '../components/NarrativeArea'
import DecisionPanel from '../components/DecisionPanel'
import AttributePanel from '../components/AttributePanel'
import type { GameChoice } from '../types'

const MemoNarrativeArea = memo(NarrativeArea)

export default function GamePage() {
  const { saveId } = useParams<{ saveId: string }>()
  const navigate = useNavigate()
  const { currentSave, loadSave, updateSave } = useGameStore()
  const { load } = useSettingsStore()

  const [narrative, setNarrative] = useState('')
  const [choices, setChoices] = useState<GameChoice[]>([])
  const [loading, setLoading] = useState(false)
  const [showAttrs, setShowAttrs] = useState(false)
  const [error, setError] = useState('')
  const [gameEnded, setGameEnded] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const bufferRef = useRef<StreamingBuffer | null>(null)
  const streamedRef = useRef('')

  useEffect(() => {
    load()
    if (saveId) loadSave(saveId)
  }, [saveId, loadSave, load])

  const save = currentSave

  useEffect(() => {
    if (save?.history.length) {
      setNarrative(save.history[save.history.length - 1].narrative)
      setChoices(save.history[save.history.length - 1].choices)
      setGameEnded(save.isEnded)
    }
  }, [save?.id])

  useEffect(() => {
    if (save && save.history.length === 0 && !loading) {
      generateScene('游戏开始')
    }
  }, [save?.id])

  const generateScene = useCallback(async (playerInput: string) => {
    const state = useGameStore.getState()
    const save = state.currentSave
    const settings = useSettingsStore.getState().settings
    if (!save || !settings?.apiKey) {
      setError('请先在设置中填写 API Key')
      return
    }

    setLoading(true)
    setError('')
    setNarrative('')
    setChoices([])
    const abort = new AbortController()
    abortRef.current = abort

    // Accumulate all attribute deltas locally, commit once at end
    const pendingValues = { ...save.attributeValues }

    const clampValue = (attrs: AttributeDef[], key: string, val: number) => {
      const def = attrs.find((a) => a.key === key)
      return def ? Math.max(def.min, Math.min(def.max, val)) : val
    }

    try {
      let hcResult: HardcoreResult | null = null
      if (save.difficulty === 'hardcore') {
        hcResult = processHardcoreTurn(save)
        // Accumulate decay locally — no DB write
        for (const [key, delta] of Object.entries(hcResult.decay)) {
          pendingValues[key] = clampValue(save.attributes, key, (pendingValues[key] ?? 0) + delta)
        }
        if (hcResult.criticalDeath) {
          setNarrative(hcResult.criticalDeath)
          state.endGame(hcResult.criticalDeath)
          setGameEnded(true)
          setLoading(false)
          return
        }
      }

      const effectiveSave = { ...save, attributeValues: pendingValues }
      const systemPrompt = buildSystemPrompt(effectiveSave)
      const history = buildConversationHistory(effectiveSave)
      history.push({ role: 'user', content: playerInput })

      streamedRef.current = ''
      const buffer = new StreamingBuffer((text) => setNarrative(text), 20)
      bufferRef.current = buffer

      const fullText = await streamDeepSeek(
        settings.apiProxy,
        settings.apiKey,
        settings.model,
        systemPrompt,
        history,
        (token) => {
          streamedRef.current += token
          buffer.append(token)
        },
        abort.signal,
      )

      buffer.reset()
      bufferRef.current = null

      const parsed: GameEngineResponse = parseResponse(fullText)
      let finalNarrative = parsed.narrative
      let finalChanges = { ...parsed.attribute_changes }

      if (hcResult) {
        if (!hcResult.execution.passed) {
          finalNarrative = hcResult.execution.narrativePrefix + '\n\n' + finalNarrative
          for (const key of Object.keys(finalChanges)) {
            finalChanges[key] = Math.round(finalChanges[key] * hcResult.execution.multiplier)
          }
        }
        const eff = hcResult.efficiency
        for (const key of Object.keys(finalChanges)) {
          if (finalChanges[key] > 0) {
            finalChanges[key] = Math.round(finalChanges[key] * eff)
          }
        }
      }

      // Merge AI changes into pending values
      for (const [key, delta] of Object.entries(finalChanges)) {
        pendingValues[key] = clampValue(save.attributes, key, (pendingValues[key] ?? 0) + delta)
      }

      // Compute total deltas from original for commitTurn
      const totalChanges: Record<string, number> = {}
      for (const key of Object.keys(pendingValues)) {
        const delta = pendingValues[key] - (save.attributeValues[key] ?? 0)
        if (delta !== 0) totalChanges[key] = delta
      }

      const shouldAdvance = parsed.milestone?.includes('阶段') || parsed.milestone?.includes('突破') || parsed.milestone?.includes('升级')

      const turn = {
        id: save.history.length,
        narrative: finalNarrative,
        choices: parsed.choices,
        playerInput,
        attributeChanges: totalChanges,
        milestone: parsed.milestone ?? undefined,
      }

      state.commitTurn(turn, totalChanges, !!shouldAdvance)
      setNarrative(finalNarrative)
      setChoices(parsed.choices)

      // Post-turn critical check uses pending values directly
      if (hcResult) {
        const postSave = { ...save, attributeValues: pendingValues }
        const postDeath = checkCritical(postSave)
        if (postDeath) {
          setGameEnded(true)
          state.endGame(postDeath)
        }
      }

      if (save.currentStage >= save.stages.length - 1 && shouldAdvance) {
        setGameEnded(true)
        state.endGame(`${save.characterName}的故事在${save.stages[save.stages.length - 1]}画上了句号。`)
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }, [])

  const handleSelect = useCallback((text: string) => generateScene(text), [generateScene])
  const handleCustom = useCallback((text: string) => generateScene(text), [generateScene])

  const handleRestart = useCallback(() => {
    if (!save) return
    updateSave({
      ...save,
      currentStage: 0,
      history: [],
      isEnded: false,
      ending: undefined,
      attributeValues: Object.fromEntries(save.attributes.map((a) => [a.key, a.initial])),
    })
    setGameEnded(false)
    setNarrative('')
    setChoices([])
  }, [save, updateSave])

  if (!save) {
    return (
      <div className="h-screen bg-game-bg flex items-center justify-center text-game-text-dim">
        加载中...
      </div>
    )
  }

  const stageName = save.stages[save.currentStage] ?? '未知'

  return (
    <div className="h-screen bg-game-bg text-game-text flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-game-border shrink-0">
        <button
          onClick={() => navigate('/')}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-game-border text-sm"
        >
          ←
        </button>
        <div className="text-center">
          <p className="text-sm font-bold">{save.characterName}</p>
          <p className="text-xs text-game-text-dim">{stageName}</p>
        </div>
        <button
          onClick={() => setShowAttrs(true)}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-game-border"
        >
          📊
        </button>
      </header>

      <div className="h-32 bg-gradient-to-b from-game-accent/5 to-game-bg flex items-center justify-center shrink-0">
        <p className="text-4xl">
          {save.template === 'cultivation' ? '⛩️' : save.template === 'career' ? '🏢' : save.template === 'campus' ? '🏫' : '🎭'}
        </p>
      </div>

      <MemoNarrativeArea text={narrative} isStreaming={loading} />

      {error && (
        <div className="mx-4 mb-2 p-3 bg-game-danger/10 border border-game-danger/30 rounded-lg text-sm text-game-danger">
          {error}
          <button onClick={() => generateScene('继续')} className="ml-2 underline">重试</button>
        </div>
      )}

      {gameEnded && (
        <div className="mx-4 mb-2 p-4 bg-game-accent/10 border border-game-accent/30 rounded-xl text-center">
          <p className="text-lg mb-2">🏁 旅程结束</p>
          <p className="text-sm text-game-text-dim mb-3">{save.ending}</p>
          <div className="flex gap-2">
            <button onClick={handleRestart} className="flex-1 py-2 bg-game-accent text-game-bg rounded-lg font-bold text-sm">
              重新开始
            </button>
            <button onClick={() => navigate('/')} className="flex-1 py-2 border border-game-border rounded-lg text-sm">
              返回主页
            </button>
          </div>
        </div>
      )}

      {!gameEnded && (
        <DecisionPanel
          choices={choices}
          loading={loading}
          onSelect={handleSelect}
          onCustom={handleCustom}
        />
      )}

      <AttributePanel
        attributes={save.attributes}
        values={save.attributeValues}
        stage={stageName}
        stageIndex={save.currentStage}
        totalStages={save.stages.length}
        open={showAttrs}
        onClose={() => setShowAttrs(false)}
      />
    </div>
  )
}
