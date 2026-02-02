import { storage } from '@/lib/storage'
import { TranslateRequest, TranslateResponse } from '@/lib/types'
import { MODEL_TIERS } from '@/lib/constants'

console.log('Cerebras Discord Translator: Background Service Started')

/**
 * Waits for a specified duration.
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Calls Cerebras API with a specific model.
 */
type ApiError = {
  status?: number
  message?: string
}

async function callCerebrasApi(text: string, model: string, apiKey: string, targetLang: string): Promise<string> {
  const url = 'https://api.cerebras.ai/v1/chat/completions'

  const systemPrompt = `You are a professional translator specialized in Discord chat.
Translate the user's message into ${targetLang}.

Core rules:
1. Output ONLY the translated text. No explanations, no quotes, no extra lines.
2. Preserve the original tone, intensity, and casual chat style. Use natural Discord-like phrasing.
3. Keep all formatting and symbols exactly as-is: line breaks, spacing, punctuation, lists, blockquotes (>), markdown, inline code, code blocks, spoilers (||like this||).
4. Do NOT translate or modify: emojis, emoticons, URLs, @mentions, #channels, roles, or IDs (e.g., <@123>, <@!123>, <@&123>, <#123>), custom emojis (<:name:id>, <a:name:id>), timestamps (<t:...>).
5. Keep common chat slang/acronyms if they are already widely used (e.g., lol, lmao, idk, gg, brb, w).
6. Preserve proper nouns (usernames, server names, game titles, product names) unless they are clearly common words in context.
7. If the text is already in ${targetLang}, return it exactly as is.

Style hints:
- If translating to English: use casual contractions and natural chat wording.
- If translating to Japanese: use casual, natural chat tone (avoid overly formal or honorific language unless the original is formal).`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })
  })

  if (!response.ok) {
    const errorBody = await response.text()
    // Throw an object to handle status codes in the rotation logic
    throw { status: response.status, message: errorBody || response.statusText }
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || text
}

/**
 * Orchestrates model rotation and retries.
 * Implements exponential backoff for 429s (Rate Limit) and immediate rotation for 404s (Model Not Found) or 5xx.
 */
async function translateWithFallback(text: string, apiKey: string, targetLang: string): Promise<string> {
  let lastError: ApiError | null = null

  // Skip smallest model if text is huge to avoid context window errors
  const candidates = text.length > 15000
    ? MODEL_TIERS.filter(m => m !== 'llama3.1-8b')
    : MODEL_TIERS

  for (const model of candidates) {
    let retries = 0
    const maxRetries = 2 // Max retries PER model for rate limits

    while (retries <= maxRetries) {
      try {
        return await callCerebrasApi(text, model, apiKey, targetLang)
      } catch (err) {
        const error = err as ApiError
        lastError = error

        // Case 1: Rate Limit (429) -> Retry same model with backoff
        if (error.status === 429) {
          console.warn(`429 Rate Limit on ${model}. Retrying... (${retries + 1}/${maxRetries})`)
          retries++
          // Exponential backoff: 1s, 2s, 4s...
          await sleep(1000 * Math.pow(2, retries))
          continue
        }

        // Case 2: Not Found (404) or Server Error (5xx) -> Rotate Model Immediately
        if (error.status === 404 || (error.status ?? 0) >= 500) {
          console.warn(`Model ${model} failed with ${error.status}. Rotating model...`)
          break // Break 'while' to move to next model in 'for-of' loop
        }

        // Other errors (Auth 401, etc.) -> Fatal, do not retry
        throw err
      }
    }
  }

  throw new Error(`All translation models failed. Last error: ${JSON.stringify(lastError)}`)
}

/**
 * Updates usage statistics in storage.
 */
async function updateStats() {
  try {
    const stats = await storage.getStats()

    // Check month reset
    const currentMonth = new Date().toISOString().slice(0, 7)
    if (stats.lastResetDate !== currentMonth) {
      stats.totalTranslatedCount = 0
      stats.lastResetDate = currentMonth
    }

    stats.totalTranslatedCount += 1

    await storage.saveStats(stats)
  } catch (e) {
    console.error('Failed to update stats:', e)
  }
}

// Main Message Listener
chrome.runtime.onMessage.addListener((message: TranslateRequest, _sender, sendResponse) => {
  // We MUST return true immediately to signal async response.
  if (message.type !== 'TRANSLATE_REQUEST') return false

  const processTranslation = async () => {
    try {
      const settings = await storage.getSettings()

      if (!settings.isEnabled || !settings.apiKey) {
        throw new Error('Extension disabled or API Key missing')
      }

      // Determine target language based on direction
      const targetLang = message.isOutgoing ? settings.outgoingLang : settings.targetLang

      // Check Cache (We cache based on Message ID + Target Lang)
      const cacheKey = `${message.messageId}_${targetLang}`
      const cached = await storage.getCache(cacheKey)

      if (cached) {
        sendResponse({
          type: 'TRANSLATE_RESPONSE',
          original: message.text,
          translated: cached.translated,
          messageId: message.messageId
        } as TranslateResponse)
        return
      }

      // Execute Translation with Rotation Logic
      const translatedText = await translateWithFallback(message.text, settings.apiKey, targetLang)

      // Save Cache (Async)
      storage.setCache(cacheKey, {
        original: message.text,
        translated: translatedText,
        timestamp: Date.now()
      }).catch(console.error)

      updateStats().catch(console.error)

      // Send Response
      sendResponse({
        type: 'TRANSLATE_RESPONSE',
        original: message.text,
        translated: translatedText,
        messageId: message.messageId
      } as TranslateResponse)

    } catch (error) {
      console.error('Translation failed in background:', error)

      const err = error as ApiError
      // CRITICAL: We MUST send a response even on error to prevent client timeout
      sendResponse({
        type: 'TRANSLATE_RESPONSE',
        original: message.text,
        translated: null,
        messageId: message.messageId,
        error: err.message || String(error)
      } as TranslateResponse)
    }
  }

  processTranslation()
  return true // Keep channel open
})
