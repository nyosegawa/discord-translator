export const DEFAULT_SETTINGS = {
  apiKey: '',
  isEnabled: true,
  targetLang: 'Japanese', // For incoming messages (Reading)
  outgoingLang: 'English', // For outgoing messages (Writing)
  sourceLang: 'Automatic',
}

// Tiered Model Strategy
// 1. gpt-oss-120b: High throughput (3000t/s), Large context.
// 2. llama-3.3-70b: High quality fallback.
// 3. qwen-3-32b: Balanced.
// 4. llama3.1-8b: Fast but strictly rate-limited (often 429s).
export const MODEL_TIERS = [
  'gpt-oss-120b',
  'llama-3.3-70b',
  'qwen-3-32b',
  'llama3.1-8b'
]
