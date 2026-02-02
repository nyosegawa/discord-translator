import { DISCORD_SELECTORS } from './dom'
import { TranslateRequest, TranslateResponse } from '@/lib/types'

type ModalRefs = {
  overlay: HTMLDivElement
  title: HTMLDivElement
  input: HTMLTextAreaElement
  output: HTMLTextAreaElement
  translateBtn: HTMLButtonElement
  copyBtn: HTMLButtonElement
}

let modalRefs: ModalRefs | null = null

/**
 * Injects a translation button into the Discord chat input area.
 */
export const attachInputTranslator = () => {
  // Use MutationObserver to detect when the chat input is rendered/re-rendered
  const inputObserver = new MutationObserver(() => {
    const textArea = document.querySelector(DISCORD_SELECTORS.CHAT_INPUT_CONTAINER)
    if (!textArea) return

    // Avoid duplicate buttons
    if (textArea.querySelector('.cerebras-translate-btn')) return

    // Create the Translate Button
    const btn = document.createElement('button')
    btn.className = 'cerebras-translate-btn'

    // SVG Icon (Translate/Language icon)
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 8l6 6"></path>
        <path d="M4 14l6-6 2-3"></path>
        <path d="M2 5h12"></path>
        <path d="M7 2h1"></path>
        <path d="M22 22l-5-10-5 10"></path>
        <path d="M14 18h6"></path>
      </svg>
    `

    // Button Styling
    Object.assign(btn.style, {
      position: 'absolute',
      right: '16px', // Positioning inside the text area container
      top: '-36px', // Float above the input box
      zIndex: '100',
      backgroundColor: '#5865F2',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '6px 10px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: '0.9',
      transition: 'all 0.2s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    })

    btn.title = 'Translate Input to Outgoing Language'
    btn.onmouseover = () => { btn.style.opacity = '1'; btn.style.transform = 'translateY(-1px)' }
    btn.onmouseout = () => { btn.style.opacity = '0.9'; btn.style.transform = 'translateY(0)' }

    btn.onclick = async (e) => {
      e.preventDefault() // Prevent form submission if inside form
      await handleInputTranslation()
    }

    // Append to the container (make sure container is relative)
    if (textArea instanceof HTMLElement) {
      textArea.style.position = 'relative'
    }
    textArea.appendChild(btn)
  })

  // Observe body for changes (Discord navigation)
  inputObserver.observe(document.body, { childList: true, subtree: true })
}

/**
 * Opens the translate modal for writing and translating.
 */
const handleInputTranslation = async () => {
  const btn = document.querySelector('.cerebras-translate-btn') as HTMLElement

  if (btn) {
    const originalBtnContent = btn.innerHTML

    // Set Loading State
    btn.innerHTML = `<svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg>`
    btn.style.pointerEvents = 'none' // Disable clicks

    const modal = getOrCreateModal()
    openModal(modal)
    modal.input.value = ''

    try {
      // No translation here; user triggers translation inside modal.
    } finally {
      // Reset Button
      btn.innerHTML = originalBtnContent
      btn.style.pointerEvents = 'auto'
    }
  }
}

const getOrCreateModal = (): ModalRefs => {
  if (modalRefs) return modalRefs

  const overlay = document.createElement('div')
  overlay.id = 'cerebras-translate-modal'
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: '10000'
  })

  const modal = document.createElement('div')
  Object.assign(modal.style, {
    width: 'min(520px, 92vw)',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    color: '#1f2937',
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
  })

  const title = document.createElement('div')
  title.innerText = 'Translate'
  Object.assign(title.style, {
    fontSize: '14px',
    fontWeight: '700',
    color: '#4b5563'
  })

  const input = document.createElement('textarea')
  input.placeholder = 'Write your message here...'
  Object.assign(input.style, {
    width: '100%',
    minHeight: '120px',
    resize: 'none',
    boxSizing: 'border-box',
    maxWidth: '100%',
    display: 'block',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#fff',
    color: '#111827',
    fontSize: '14px',
    lineHeight: '1.5'
  })

  const translateBtn = document.createElement('button')
  translateBtn.innerText = 'Translate'
  Object.assign(translateBtn.style, {
    alignSelf: 'flex-end',
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#5865F2',
    color: '#fff',
    cursor: 'pointer'
  })

  const output = document.createElement('textarea')
  output.readOnly = true
  output.placeholder = 'Translation will appear here.'
  Object.assign(output.style, {
    width: '100%',
    minHeight: '120px',
    resize: 'none',
    boxSizing: 'border-box',
    maxWidth: '100%',
    display: 'block',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    color: '#111827',
    fontSize: '14px',
    lineHeight: '1.5'
  })

  const actions = document.createElement('div')
  Object.assign(actions.style, {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px'
  })

  const closeBtn = document.createElement('button')
  closeBtn.innerText = 'Close'
  Object.assign(closeBtn.style, {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#fff',
    cursor: 'pointer'
  })

  const copyBtn = document.createElement('button')
  copyBtn.innerText = 'Copy'
  Object.assign(copyBtn.style, {
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#5865F2',
    color: '#fff',
    cursor: 'pointer'
  })

  closeBtn.onclick = () => closeModal()
  overlay.onclick = (e) => {
    if (e.target === overlay) closeModal()
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal()
  })

  translateBtn.onclick = async () => {
    const text = input.value.trim()
    if (!text) return

    setModalLoading(modalRefs as ModalRefs, true)
    try {
      const request: TranslateRequest = {
        type: 'TRANSLATE_REQUEST',
        text,
        messageId: `input-${Date.now()}`, // Dummy ID for cache key
        isOutgoing: true // Use outgoingLang setting
      }

      const response = await chrome.runtime.sendMessage(request) as TranslateResponse

      if (response.translated) {
        setModalContent(modalRefs as ModalRefs, response.translated)
      } else {
        console.error('Translation returned null or error:', response.error)
        setModalError(modalRefs as ModalRefs, response.error || 'Translation failed. Please check your API Key or Network.')
      }
    } catch (err) {
      console.error('Input translation fatal error:', err)
      setModalError(modalRefs as ModalRefs, 'Translation failed. Please check your API Key or Network.')
    } finally {
      setModalLoading(modalRefs as ModalRefs, false)
    }
  }

  copyBtn.onclick = async () => {
    if (!output.value) return
    try {
      await navigator.clipboard.writeText(output.value)
      copyBtn.innerText = 'Copied'
      setTimeout(() => { copyBtn.innerText = 'Copy' }, 1200)
    } catch {
      output.select()
      document.execCommand('copy')
      copyBtn.innerText = 'Copied'
      setTimeout(() => { copyBtn.innerText = 'Copy' }, 1200)
    }
  }

  actions.appendChild(closeBtn)
  actions.appendChild(copyBtn)

  modal.appendChild(title)
  modal.appendChild(input)
  modal.appendChild(translateBtn)
  modal.appendChild(output)
  modal.appendChild(actions)
  overlay.appendChild(modal)
  document.body.appendChild(overlay)

  modalRefs = { overlay, title, input, output, translateBtn, copyBtn }
  return modalRefs
}

const openModal = (modal: ModalRefs) => {
  modal.title.innerText = 'Translate'
  modal.output.value = ''
  modal.copyBtn.disabled = true
  modal.copyBtn.style.opacity = '0.6'
  setModalLoading(modal, false)
  modal.overlay.style.display = 'flex'
  modal.input.focus()
}

const setModalContent = (modal: ModalRefs, text: string) => {
  modal.title.innerText = 'Translation'
  modal.output.value = text
  modal.copyBtn.disabled = false
  modal.copyBtn.style.opacity = '1'
}

const setModalError = (modal: ModalRefs, message: string) => {
  modal.title.innerText = 'Translation Failed'
  modal.output.value = message
  modal.copyBtn.disabled = true
  modal.copyBtn.style.opacity = '0.6'
}

const setModalLoading = (modal: ModalRefs, isLoading: boolean) => {
  modal.translateBtn.disabled = isLoading
  modal.translateBtn.style.opacity = isLoading ? '0.7' : '1'
  modal.translateBtn.innerText = isLoading ? 'Translating...' : 'Translate'
}

const closeModal = () => {
  if (!modalRefs) return
  modalRefs.overlay.style.display = 'none'
}
