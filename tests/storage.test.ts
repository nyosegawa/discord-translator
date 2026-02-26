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
})
