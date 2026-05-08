import { create } from 'zustand'
import type { Settings } from '../types'
import { getSettings, putSettings } from '../db'

interface SettingsState {
  settings: Settings | null
  loaded: boolean
  load: () => Promise<void>
  save: (s: Settings) => Promise<void>
  setApiKey: (key: string) => Promise<void>
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  loaded: false,

  load: async () => {
    const s = await getSettings()
    set({
      settings: s || {
        apiKey: '',
        apiProxy: '',
        model: 'deepseek-v4-pro',
        theme: 'dark',
      },
      loaded: true,
    })
  },

  save: async (s: Settings) => {
    await putSettings(s)
    set({ settings: s })
  },

  setApiKey: async (key: string) => {
    const current = get().settings
    if (!current) return
    const updated = { ...current, apiKey: key }
    await putSettings(updated)
    set({ settings: updated })
  },
}))
