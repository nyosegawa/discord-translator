# Discord Translator

Eine Chrome-Erweiterung, die Discord-Nachrichten automatisch mit der [Cerebras Inference API](https://www.cerebras.ai/) übersetzt.

**Languages:**
[English](README.md) | [日本語](README.ja.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Português (BR)](README.pt-BR.md) | [Italiano](README.it.md) | [한국어](README.ko.md) | [中文(简体)](README.zh-CN.md) | [中文(繁體)](README.zh-TW.md) | [Русский](README.ru.md) | [Bahasa Indonesia](README.id.md)

## Funktionen

- **Auto-Übersetzung eingehend:** Neue Nachrichten werden automatisch übersetzt, die neuesten zuerst.
- **Popup für ausgehende Übersetzung:** Auf den Übersetzen-Button klicken, im Popup schreiben, übersetzen und kopieren.
- **Intelligentes Caching:** Verhindert doppelte API-Aufrufe durch lokalen Cache.
- **Übersetzungszähler:** Zeigt die monatliche Anzahl verarbeiteter Nachrichten.
- **Datenschutzorientiert:** API-Key wird lokal gespeichert. Es werden nur zu übersetzende Nachrichten verarbeitet.

## Screenshots

Eingehende Übersetzung:

![Incoming Translation](public/screenshots/translate-incoming.png)

Popup für ausgehende Übersetzung:

![Outgoing Translation Popup](public/screenshots/translate-outgoing.png)

Ersetze die Bilder später durch eigene Screenshots.

## Modelle

Diese Erweiterung nutzt eine gestufte Fallback-Strategie in folgender Reihenfolge:

1. `gpt-oss-120b`
2. `llama-3.3-70b`
3. `qwen-3-32b`
4. `llama3.1-8b`

Bei Rate Limits oder Ausfällen wird automatisch erneut versucht oder zum nächsten Modell gewechselt.

## Tech-Stack

- **Framework:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS
- **API Client:** Direkter fetch zur Cerebras Inference API
- **Build Tool:** CRXJS Vite Plugin

## Build & Laden

1. **Abhängigkeiten installieren:**
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

3. **In Chrome laden:**
   - `chrome://extensions/` öffnen
   - "Developer mode" aktivieren
   - "Load unpacked" klicken
   - Den durch den Build erzeugten `dist`-Ordner auswählen.

## Entwicklung (Watch)

1. **Dev-Build starten:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **In Chrome laden:**
   - `chrome://extensions/` öffnen
   - "Developer mode" aktivieren
   - "Load unpacked" klicken
   - Den durch den Dev-Build erzeugten `dist`-Ordner auswählen.

## Lizenz

MIT