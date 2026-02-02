import { AppSettings, AppStats, TranslationCache } from './types'
import { DEFAULT_SETTINGS } from './constants'

export const storage = {
  getSettings: async (): Promise<AppSettings> => {
    const res = await chrome.storage.local.get('settings')
    return { ...DEFAULT_SETTINGS, ...res.settings }
  },

  saveSettings: async (settings: Partial<AppSettings>): Promise<void> => {
    const current = await storage.getSettings()
    await chrome.storage.local.set({ settings: { ...current, ...settings } })
  },

  getStats: async (): Promise<AppStats> => {
    const res = await chrome.storage.local.get('stats')
    const defaults: AppStats = {
      totalTranslatedCount: 0,
      lastResetDate: new Date().toISOString().slice(0, 7), // YYYY-MM
    }
    return res.stats || defaults
  },

  saveStats: async (stats: AppStats): Promise<void> => {
    await chrome.storage.local.set({ stats })
  },

  // Cache key format: "tr_HASH" or "tr_MSGID"
  getCache: async (key: string): Promise<TranslationCache | null> => {
    const storageKey = `tr_${key}`
    const res = await chrome.storage.local.get(storageKey)
    return res[storageKey] || null
  },

  setCache: async (key: string, data: TranslationCache): Promise<void> => {
    const storageKey = `tr_${key}`
    await chrome.storage.local.set({ [storageKey]: data })
  },

  clearCache: async (): Promise<void> => {
    const all = await chrome.storage.local.get(null)
    const keysToRemove = Object.keys(all).filter((k) => k.startsWith('tr_'))
    await chrome.storage.local.remove(keysToRemove)
  }
}
