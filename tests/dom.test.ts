import { beforeEach, describe, expect, it } from 'vitest'
import {
  DISCORD_SELECTORS,
  injectLoading,
  updateTranslation,
  removeTranslation,
  shouldTranslate,
  injectTranslation
} from '@/content/dom'

const createMessage = () => {
  const el = document.createElement('div')
  el.id = 'message-content-123'
  document.body.appendChild(el)
  return el
}

describe('shouldTranslate', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('returns false for empty text', () => {
    const el = createMessage()
    expect(shouldTranslate('   ', el)).toBe(false)
  })

  it('returns false for URL-only text', () => {
    const el = createMessage()
    expect(shouldTranslate('https://example.com', el)).toBe(false)
  })

  it('returns false for emoji-only text', () => {
    const el = createMessage()
    expect(shouldTranslate('😀 😅', el)).toBe(false)
  })

  it('returns false for short id-like text without spaces', () => {
    const el = createMessage()
    expect(shouldTranslate('11-labs-voice', el)).toBe(false)
  })

  it('returns false for replied message previews', () => {
    const wrapper = document.createElement('div')
    wrapper.className = 'repliedTextPreview'
    const el = document.createElement('div')
    el.id = 'message-content-456'
    wrapper.appendChild(el)
    document.body.appendChild(wrapper)
    expect(shouldTranslate('hello', el)).toBe(false)
  })

  it('returns false for replied message containers', () => {
    const wrapper = document.createElement('div')
    wrapper.className = 'repliedMessage_c19a55'
    const el = document.createElement('div')
    el.id = 'message-content-789'
    wrapper.appendChild(el)
    document.body.appendChild(wrapper)
    expect(shouldTranslate('hello', el)).toBe(false)
  })

  it('returns true for normal chat text', () => {
    const el = createMessage()
    expect(shouldTranslate('hello there', el)).toBe(true)
  })

  it('returns true when URL is mixed with normal sentence', () => {
    const el = createMessage()
    expect(shouldTranslate('look https://example.com now', el)).toBe(true)
  })
})

describe('translation UI helpers', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('injectLoading creates a single container', () => {
    const el = createMessage()
    injectLoading(el)
    injectLoading(el)
    const containers = el.querySelectorAll(`.${DISCORD_SELECTORS.TRANSLATION_CONTAINER_CLASS}`)
    expect(containers.length).toBe(1)
  })

  it('updateTranslation sets translated text and marks element', () => {
    const el = createMessage()
    injectLoading(el)
    updateTranslation(el, 'translated')
    const container = el.querySelector(`.${DISCORD_SELECTORS.TRANSLATION_CONTAINER_CLASS}`) as HTMLElement
    expect(container).toBeTruthy()
    expect(container.textContent).toContain('translated')
    expect(el.getAttribute(DISCORD_SELECTORS.TRANSLATED_ATTR)).toBe('true')
  })

  it('removeTranslation removes the container', () => {
    const el = createMessage()
    injectLoading(el)
    removeTranslation(el)
    const container = el.querySelector(`.${DISCORD_SELECTORS.TRANSLATION_CONTAINER_CLASS}`)
    expect(container).toBeNull()
  })

  it('injectTranslation creates and fills the container', () => {
    const el = createMessage()
    injectTranslation(el, 'hello')
    const container = el.querySelector(`.${DISCORD_SELECTORS.TRANSLATION_CONTAINER_CLASS}`)
    expect(container).toBeTruthy()
    expect(container?.textContent).toContain('hello')
  })
})
