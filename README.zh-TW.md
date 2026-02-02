# Discord Translator

一個使用 [Cerebras Inference API](https://www.cerebras.ai/) 自動翻譯 Discord 訊息的 Chrome 擴充功能。

**Languages:**
[English](README.md) | [日本語](README.ja.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Português (BR)](README.pt-BR.md) | [Italiano](README.it.md) | [한국어](README.ko.md) | [中文(简体)](README.zh-CN.md) | [中文(繁體)](README.zh-TW.md) | [Русский](README.ru.md) | [Bahasa Indonesia](README.id.md)

## 功能

- **收件自動翻譯：** 新訊息會自動翻譯，並優先處理最新訊息。
- **送出翻譯彈窗：** 點擊翻譯按鈕，在彈窗輸入、翻譯並複製結果。
- **智慧快取：** 透過本地快取避免重複 API 呼叫。
- **翻譯計數：** 顯示每月處理的訊息數量。
- **隱私優先：** API Key 只存於本機，僅處理需要翻譯的訊息。

## 截圖

收件翻譯（佔位圖）：

![Incoming Translation](public/screenshots/translate-incoming.png)

送出翻譯彈窗（佔位圖）：

![Outgoing Translation Popup](public/screenshots/translate-outgoing.png)

準備好後請替換為真實截圖。

## 模型

本擴充功能使用分層 fallback 策略，順序如下：

1. `gpt-oss-120b`
2. `llama-3.3-70b`
3. `qwen-3-32b`
4. `llama3.1-8b`

若模型被限流或不可用，會自動重試或切換到下一個模型。

## 技術棧

- **Framework:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS
- **API Client:** 直接 fetch 到 Cerebras Inference API
- **Build Tool:** CRXJS Vite Plugin

## 建置與載入

1. **安裝相依套件：**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **建置：**
   ```bash
   npm run build
   # or
   yarn build
   ```

3. **在 Chrome 載入：**
   - 開啟 `chrome://extensions/`
   - 啟用 "Developer mode"
   - 點擊 "Load unpacked"
   - 選擇建置後的 `dist` 資料夾

## 開發（Watch）

1. **執行開發建置：**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **在 Chrome 載入：**
   - 開啟 `chrome://extensions/`
   - 啟用 "Developer mode"
   - 點擊 "Load unpacked"
   - 選擇開發建置後的 `dist` 資料夾

## 授權

MIT