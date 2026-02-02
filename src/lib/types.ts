export interface AppSettings {
  apiKey: string
  isEnabled: boolean
  targetLang: string
  outgoingLang: string
  sourceLang: string
}

export interface AppStats {
  totalTranslatedCount: number
  lastResetDate: string // YYYY-MM
}

export interface TranslationCache {
  original: string
  translated: string
  timestamp: number
}

export type MessageType = 'TRANSLATE_REQUEST' | 'TRANSLATE_RESPONSE'

export interface TranslateRequest {
  type: 'TRANSLATE_REQUEST'
  text: string
  messageId: string
  isOutgoing?: boolean // True if this is an input translation
}

export interface TranslateResponse {
  type: 'TRANSLATE_RESPONSE'
  original: string
  translated: string | null
  error?: string
  messageId: string
}
