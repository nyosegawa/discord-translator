export const DISCORD_SELECTORS = {
  // Matches message content divs.
  // Discord uses id="message-content-12345..."
  MESSAGE_CONTENT: 'div[id^="message-content-"]',

  // Attribute to mark translated messages to avoid loops
  TRANSLATED_ATTR: 'data-cerebras-translated',

  // Container class for our injected translation
  TRANSLATION_CONTAINER_CLASS: 'cerebras-translation-result',

  // Selectors for the input area (approximate based on Discord structure)
  CHAT_INPUT_CONTAINER: 'div[class*="channelTextArea"]',
  CHAT_TEXTBOX: 'div[role="textbox"]',
}

/**
 * Injects a loading placeholder into a message element.
 *
 * @param messageEl - The Discord message element.
 */
export const injectLoading = (messageEl: HTMLElement) => {
  if (messageEl.querySelector(`.${DISCORD_SELECTORS.TRANSLATION_CONTAINER_CLASS}`)) return

  const container = document.createElement('div')
  container.className = DISCORD_SELECTORS.TRANSLATION_CONTAINER_CLASS

  Object.assign(container.style, {
    marginTop: '4px',
    paddingLeft: '12px',
    fontSize: '0.85em',
    color: 'var(--text-muted, #72767d)',
    fontStyle: 'italic',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  })

  // Simple SVG spinner
  container.innerHTML = `
    <svg class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg>
    <span>Translating...</span>
  `

  // Inject keyframes style if not exists
  if (!document.getElementById('cerebras-style')) {
    const style = document.createElement('style')
    style.id = 'cerebras-style'
    style.textContent = `
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .animate-spin { animation: spin 1s linear infinite; }
    `
    document.head.appendChild(style)
  }

  messageEl.appendChild(container)
}

/**
 * Updates the loading placeholder with the actual translated result.
 *
 * @param messageEl - The Discord message element.
 * @param translatedText - The translated text.
 */
export const updateTranslation = (messageEl: HTMLElement, translatedText: string) => {
  const container = messageEl.querySelector(`.${DISCORD_SELECTORS.TRANSLATION_CONTAINER_CLASS}`) as HTMLElement
  if (!container) return

  // Update styles for the result
  Object.assign(container.style, {
    marginTop: '6px',
    paddingLeft: '12px',
    borderLeft: '4px solid #5865F2', // Discord Blurple
    color: 'var(--text-normal, #dbdee1)',
    backgroundColor: 'var(--background-secondary, rgba(0,0,0,0.05))',
    fontSize: '0.95em',
    lineHeight: '1.375rem',
    borderRadius: '4px',
    paddingTop: '4px',
    paddingBottom: '4px',
    whiteSpace: 'pre-wrap',
    fontStyle: 'normal',
    display: 'block'
  })

  container.innerHTML = ''

  const label = document.createElement('span')
  label.innerText = 'AI Translation'
  Object.assign(label.style, {
    fontSize: '0.7em',
    color: 'var(--header-secondary, #b9bbbe)',
    display: 'block',
    marginBottom: '2px',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  })

  container.appendChild(label)
  container.appendChild(document.createTextNode(translatedText))

  // Mark as successfully translated
  messageEl.setAttribute(DISCORD_SELECTORS.TRANSLATED_ATTR, 'true')
}

/**
 * Removes the translation container (e.g., on error).
 *
 * @param messageEl - The Discord message element.
 */
export const removeTranslation = (messageEl: HTMLElement) => {
  const container = messageEl.querySelector(`.${DISCORD_SELECTORS.TRANSLATION_CONTAINER_CLASS}`)
  if (container) container.remove()
}

/**
 * Determines if a message should be translated based on content and context.
 *
 * @param text - The text content.
 * @param element - The HTML element for context checks.
 * @returns True if should translate.
 */
export const shouldTranslate = (text: string, element: HTMLElement): boolean => {
  const cleanText = text.trim()
  if (!cleanText) return false

  // Context Checks
  if (element.closest('[class*="repliedTextPreview"]')) return false
  if (element.closest('.repliedMessage_c19a55')) return false

  // Content Checks
  if (/^https?:\/\/[^\s]+$/.test(cleanText)) return false // Only URL
  if (/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\s]+$/u.test(cleanText)) return false // Only Emoji

  // Short ID check (e.g. "11-labs-voice")
  if (cleanText.length < 25 && !cleanText.includes(' ')) return false

  return true
}

/**
 * Direct injection (used if not using loading state, kept for compatibility)
 */
export const injectTranslation = (messageEl: HTMLElement, translatedText: string) => {
  injectLoading(messageEl)
  updateTranslation(messageEl, translatedText)
}