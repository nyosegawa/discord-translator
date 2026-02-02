import { DISCORD_SELECTORS, injectLoading, updateTranslation, removeTranslation, shouldTranslate } from './dom'
import { attachInputTranslator } from './input'
import { TranslateRequest, TranslateResponse } from '@/lib/types'

console.log('Cerebras Discord Translator: Content Script Active')

// Track queued/in-flight translations to avoid duplicates
const processingSet = new Set<string>()
const messageQueue: HTMLElement[] = []
let isQueueRunning = false

/**
 * Processes a single message element.
 *
 * @param element - The message element found by observer.
 */
const handleMessage = async (element: HTMLElement) => {
  const messageId = element.id.replace('message-content-', '')

  // Checks (element may have been removed or already handled)
  if (!element.isConnected) {
    processingSet.delete(messageId)
    return
  }
  if (element.hasAttribute(DISCORD_SELECTORS.TRANSLATED_ATTR)) {
    processingSet.delete(messageId)
    return
  }

  const text = element.innerText

  if (!shouldTranslate(text, element)) {
    // Mark as skipped to prevent re-checking
    element.setAttribute(DISCORD_SELECTORS.TRANSLATED_ATTR, 'skipped')
    processingSet.delete(messageId)
    return
  }

  // 1. Show Loading UI
  injectLoading(element)

  try {
    const request: TranslateRequest = {
      type: 'TRANSLATE_REQUEST',
      text,
      messageId
    }

    const response = await chrome.runtime.sendMessage(request) as TranslateResponse

    if (response.translated) {
      // 2. Success: Show Translation
      updateTranslation(element, response.translated)
    } else {
      // 3. Fail: Remove Loading, Log error
      console.debug('Translation error:', response.error)
      removeTranslation(element)
      // We do NOT mark as translated/skipped here, allowing potential retry on reload
      // But we remove from processingSet below
    }

  } catch (err) {
    console.error('Error communicating with background:', err)
    removeTranslation(element)
  } finally {
    processingSet.delete(messageId)
  }
}

/**
 * Enqueues a message for translation.
 * Uses LIFO processing to prioritize latest messages (bottom of the list).
 */
const enqueueMessage = (element: HTMLElement) => {
  const messageId = element.id.replace('message-content-', '')

  if (element.hasAttribute(DISCORD_SELECTORS.TRANSLATED_ATTR)) return
  if (processingSet.has(messageId)) return

  const text = element.innerText
  if (!shouldTranslate(text, element)) {
    element.setAttribute(DISCORD_SELECTORS.TRANSLATED_ATTR, 'skipped')
    return
  }

  processingSet.add(messageId)
  messageQueue.push(element)
  void processQueue()
}

const processQueue = async () => {
  if (isQueueRunning) return
  isQueueRunning = true

  while (messageQueue.length > 0) {
    const element = messageQueue.pop()
    if (!element) continue
    await handleMessage(element)
  }

  isQueueRunning = false
  if (messageQueue.length > 0) {
    void processQueue()
  }
}

/**
 * MutationObserver callback to detect new messages.
 */
const observerCallback: MutationCallback = (mutations) => {
  for (const mutation of mutations) {
    if (mutation.type !== 'childList') continue

    mutation.addedNodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) return

      // Case 1: Node IS the message content
      if (node.matches(DISCORD_SELECTORS.MESSAGE_CONTENT)) {
        enqueueMessage(node)
        return
      }

      // Case 2: Node CONTAINS message content
      const messages = node.querySelectorAll<HTMLElement>(DISCORD_SELECTORS.MESSAGE_CONTENT)
      messages.forEach(enqueueMessage)
    })
  }
}

/**
 * Initializes the script.
 */
const startObserver = () => {
  const observer = new MutationObserver(observerCallback)

  // Deep observation is required for Discord's SPA updates
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })

  // Initial processing of existing messages
  document.querySelectorAll<HTMLElement>(DISCORD_SELECTORS.MESSAGE_CONTENT).forEach(enqueueMessage)

  // Attach the input translator button
  attachInputTranslator()
}

// Delay start slightly to ensure page load
setTimeout(startObserver, 2000)
