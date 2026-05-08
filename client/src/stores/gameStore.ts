import { create } from 'zustand'
import type { SaveSlot, GameTurn, AttributeDef } from '../types'
import { getAllSaves, getSave, putSave, deleteSave } from '../db'

interface GameState {
  saves: SaveSlot[]
  currentSave: SaveSlot | null
  loading: boolean

  loadSaves: () => Promise<void>
  loadSave: (id: string) => Promise<void>
  createSave: (save: SaveSlot) => Promise<void>
  updateSave: (save: SaveSlot) => Promise<void>
  removeSave: (id: string) => Promise<void>
  addTurn: (turn: GameTurn) => void
  applyAttributeChanges: (changes: Record<string, number>) => void
  commitTurn: (turn: GameTurn, changes: Record<string, number>, shouldAdvance: boolean) => void
  advanceStage: () => void
  endGame: (ending: string) => void
}

export const useGameStore = create<GameState>((set, get) => ({
  saves: [],
  currentSave: null,
  loading: false,

  loadSaves: async () => {
    const saves = await getAllSaves()
    saves.sort((a, b) => b.updatedAt - a.updatedAt)
    set({ saves })
  },

  loadSave: async (id: string) => {
    const save = await getSave(id)
    if (save) set({ currentSave: save })
  },

  createSave: async (save: SaveSlot) => {
    await putSave(save)
    set((s) => ({ saves: [save, ...s.saves], currentSave: save }))
  },

  updateSave: async (save: SaveSlot) => {
    await putSave(save)
    set((s) => ({
      currentSave: save,
      saves: s.saves.map((x) => (x.id === save.id ? save : x)),
    }))
  },

  removeSave: async (id: string) => {
    await deleteSave(id)
    set((s) => ({
      saves: s.saves.filter((x) => x.id !== id),
      currentSave: s.currentSave?.id === id ? null : s.currentSave,
    }))
  },

  addTurn: (turn: GameTurn) => {
    const cs = get().currentSave
    if (!cs) return
    const updated = { ...cs, history: [...cs.history, turn] }
    putSave(updated)
    set({ currentSave: updated })
  },

  applyAttributeChanges: (changes: Record<string, number>) => {
    const cs = get().currentSave
    if (!cs) return
    const values = { ...cs.attributeValues }
    for (const [key, delta] of Object.entries(changes)) {
      const def = cs.attributes.find((a: AttributeDef) => a.key === key)
      const newVal = (values[key] ?? 0) + delta
      values[key] = def ? Math.max(def.min, Math.min(def.max, newVal)) : newVal
    }
    const updated = { ...cs, attributeValues: values }
    putSave(updated)
    set({ currentSave: updated })
  },

  commitTurn: (turn: GameTurn, changes: Record<string, number>, shouldAdvance: boolean) => {
    const cs = get().currentSave
    if (!cs) return
    const values = { ...cs.attributeValues }
    for (const [key, delta] of Object.entries(changes)) {
      const def = cs.attributes.find((a: AttributeDef) => a.key === key)
      const newVal = (values[key] ?? 0) + delta
      values[key] = def ? Math.max(def.min, Math.min(def.max, newVal)) : newVal
    }
    const updated = {
      ...cs,
      attributeValues: values,
      history: [...cs.history, turn],
      currentStage: shouldAdvance
        ? Math.min(cs.currentStage + 1, cs.stages.length - 1)
        : cs.currentStage,
    }
    putSave(updated)
    set({ currentSave: updated })
  },

  advanceStage: () => {
    const cs = get().currentSave
    if (!cs) return
    const updated = {
      ...cs,
      currentStage: Math.min(cs.currentStage + 1, cs.stages.length - 1),
    }
    putSave(updated)
    set({ currentSave: updated })
  },

  endGame: (ending: string) => {
    const cs = get().currentSave
    if (!cs) return
    const updated = { ...cs, isEnded: true, ending }
    putSave(updated)
    set({ currentSave: updated })
  },
}))
