import { beforeEach, describe, expect, it, vi } from 'vitest'
import { storage } from '@/lib/storage'
import { DEFAULT_SETTINGS } from '@/lib/constants'

type Store = Record<string, unknown>

const installChromeStorageMock = (initial: Store = {}) => {
  const store: Store = { ...initial }

  const get = vi.fn(async (keys?: string | string[] | null) => {
    if (keys == null) {
      return { ...store }
    }
    if (typeof keys === 'string') {
      return store[keys] === undefined ? {} : { [keys]: store[keys] }
    }

    return keys.reduce<Record<string, unknown>>((acc, key) => {
      if (store[key] !== undefined) {
        acc[key] = store[key]
      }
      return acc
    }, {})
  })

  const set = vi.fn(async (data: Record<string, unknown>) => {
    Object.assign(store, data)
  })

  const remove = vi.fn(async (keys: string[]) => {
    keys.forEach((key) => delete store[key])
  })

  Object.assign(globalThis, {
    chrome: {
      storage: {
        local: { get, set, remove }
      }
    }
  })

  return { get, set, remove, store }
}

describe('storage.getSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns default settings when storage is empty', async () => {
    installChromeStorageMock()

    await expect(storage.getSettings()).resolves.toEqual(DEFAULT_SETTINGS)
  })

  it('merges stored settings into defaults', async () => {
    installChromeStorageMock({
      settings: {
        targetLang: 'French',
        sourceLang: 'English'
      }
    })

    await expect(storage.getSettings()).resolves.toEqual({
      ...DEFAULT_SETTINGS,
      targetLang: 'French',
      sourceLang: 'English'
    })
  })

  it('reads settings using the settings key', async () => {
    const { get } = installChromeStorageMock({ settings: {} })

    await storage.getSettings()

    expect(get).toHaveBeenCalledWith('settings')
  })
})

describe('storage.saveSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('persists new values merged with defaults', async () => {
    const { set } = installChromeStorageMock()

    await storage.saveSettings({ targetLang: 'German' })

    expect(set).toHaveBeenCalledWith({
      settings: {
        ...DEFAULT_SETTINGS,
        targetLang: 'German'
      }
    })
  })

  it('keeps existing stored values that are not overwritten', async () => {
    const { set } = installChromeStorageMock({
      settings: {
        apiKey: 'abc',
        targetLang: 'Spanish'
      }
    })

    await storage.saveSettings({ outgoingLang: 'Japanese' })

    expect(set).toHaveBeenCalledWith({
      settings: {
        ...DEFAULT_SETTINGS,
        apiKey: 'abc',
        targetLang: 'Spanish',
        outgoingLang: 'Japanese'
      }
    })
  })

  it('can persist false boolean values', async () => {
    const { set } = installChromeStorageMock()

    await storage.saveSettings({ isEnabled: false })

    expect(set).toHaveBeenCalledWith({
      settings: {
        ...DEFAULT_SETTINGS,
        isEnabled: false
      }
    })
  })
})

describe('storage.getStats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns monthly defaults when stats are missing', async () => {
    installChromeStorageMock()
    const expectedMonth = new Date().toISOString().slice(0, 7)

    await expect(storage.getStats()).resolves.toEqual({
      totalTranslatedCount: 0,
      lastResetDate: expectedMonth
    })
  })

  it('returns stored stats without modification', async () => {
    installChromeStorageMock({
      stats: {
        totalTranslatedCount: 42,
        lastResetDate: '2025-12'
      }
    })

    await expect(storage.getStats()).resolves.toEqual({
      totalTranslatedCount: 42,
      lastResetDate: '2025-12'
    })
  })

  it('reads stats using the stats key', async () => {
    const { get } = installChromeStorageMock({
      stats: {
        totalTranslatedCount: 1,
        lastResetDate: '2026-02'
      }
    })

    await storage.getStats()

    expect(get).toHaveBeenCalledWith('stats')
  })
})

describe('storage.saveStats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('writes stats into local storage', async () => {
    const { set } = installChromeStorageMock()
    const stats = { totalTranslatedCount: 10, lastResetDate: '2026-01' }

    await storage.saveStats(stats)

    expect(set).toHaveBeenCalledWith({ stats })
  })
})

describe('storage.getCache', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when cache key is missing', async () => {
    installChromeStorageMock()

    await expect(storage.getCache('m1')).resolves.toBeNull()
  })

  it('reads cache entry from tr_ prefixed key', async () => {
    const entry = { original: 'x', translated: 'y', timestamp: 99 }
    const { get } = installChromeStorageMock({ tr_msg123: entry })

    await expect(storage.getCache('msg123')).resolves.toEqual(entry)
    expect(get).toHaveBeenCalledWith('tr_msg123')
  })
})

describe('storage.setCache', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('stores cache entry under tr_ prefixed key', async () => {
    const { set } = installChromeStorageMock()
    const value = { original: 'a', translated: 'b', timestamp: 1 }

    await storage.setCache('id-1', value)

    expect(set).toHaveBeenCalledWith({ 'tr_id-1': value })
  })

  it('overwrites existing cache entry for the same key', async () => {
    const { store } = installChromeStorageMock({
      tr_key: { original: 'old', translated: 'old', timestamp: 1 }
    })

    await storage.setCache('key', {
      original: 'new',
      translated: 'new',
      timestamp: 2
    })

    expect(store.tr_key).toEqual({
      original: 'new',
      translated: 'new',
      timestamp: 2
    })
  })
})

describe('storage.clearCache', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('removes only cache keys with tr_ prefix', async () => {
    const { remove } = installChromeStorageMock({
      tr_a: { translated: '1' },
      tr_b: { translated: '2' },
      settings: { targetLang: 'Japanese' }
    })

    await storage.clearCache()

    expect(remove).toHaveBeenCalledWith(['tr_a', 'tr_b'])
  })

  it('calls remove with an empty list when no cache keys exist', async () => {
    const { remove } = installChromeStorageMock({
      settings: { apiKey: 'k' },
      stats: { totalTranslatedCount: 3, lastResetDate: '2026-02' }
    })

    await storage.clearCache()

    expect(remove).toHaveBeenCalledWith([])
  })
})
