# Discord Translator

Un'estensione Chrome che traduce automaticamente i messaggi di Discord usando la [Cerebras Inference API](https://www.cerebras.ai/).

**Languages:**
[English](README.md) | [日本語](README.ja.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Português (BR)](README.pt-BR.md) | [Italiano](README.it.md) | [한국어](README.ko.md) | [中文(简体)](README.zh-CN.md) | [中文(繁體)](README.zh-TW.md) | [Русский](README.ru.md) | [Bahasa Indonesia](README.id.md)

## Funzionalità

- **Auto‑traduzione in entrata:** I nuovi messaggi vengono tradotti automaticamente, dando priorità ai più recenti.
- **Popup di traduzione in uscita:** Clicca il pulsante, scrivi nel popup, traduci e copia il risultato.
- **Cache intelligente:** Evita chiamate API ridondanti con cache locale.
- **Conteggio traduzioni:** Mostra il numero mensile di messaggi processati.
- **Focus sulla privacy:** La chiave API è salvata localmente. Solo i messaggi da tradurre vengono elaborati.

## Screenshot

Traduzione in entrata:

![Incoming Translation](public/screenshots/translate-incoming.png)

Popup di traduzione in uscita:

![Outgoing Translation Popup](public/screenshots/translate-outgoing.png)

Sostituisci le immagini con i tuoi screenshot quando pronti.

## Modelli

Questa estensione usa una strategia di fallback a livelli in questo ordine:

1. `gpt-oss-120b`
2. `llama-3.3-70b`
3. `qwen-3-32b`
4. `llama3.1-8b`

Se un modello è limitato o non disponibile, il sistema riprova o passa al successivo.

## Stack tecnico

- **Framework:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS
- **Client API:** fetch diretto alla Cerebras Inference API
- **Build Tool:** CRXJS Vite Plugin

## Build e caricamento

1. **Installare le dipendenze:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Build:**
   ```bash
   npm run build
   # or
   yarn build
   ```

3. **Caricare in Chrome:**
   - Apri `chrome://extensions/`
   - Abilita "Developer mode"
   - Clicca "Load unpacked"
   - Seleziona la cartella `dist` generata dal build.

## Sviluppo (watch)

1. **Build di sviluppo:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Caricare in Chrome:**
   - Apri `chrome://extensions/`
   - Abilita "Developer mode"
   - Clicca "Load unpacked"
   - Seleziona la cartella `dist` generata dal build di sviluppo.

## Licenza

MIT