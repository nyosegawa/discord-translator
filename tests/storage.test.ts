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
})
