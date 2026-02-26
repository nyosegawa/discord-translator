import { describe, expect, it } from 'vitest'
import { DEFAULT_SETTINGS, MODEL_TIERS } from '@/lib/constants'

describe('constants', () => {
  it('keeps translation enabled by default', () => {
    expect(DEFAULT_SETTINGS.isEnabled).toBe(true)
  })

  it('uses four model tiers in fallback order', () => {
    expect(MODEL_TIERS).toEqual([
      'gpt-oss-120b',
      'llama-3.3-70b',
      'qwen-3-32b',
      'llama3.1-8b'
    ])
  })
})
