# Discord Translator

Cerebras Inference API を利用して Discord メッセージを自動翻訳する Chrome 拡張です。

**Languages:**
[English](README.md) | [日本語](README.ja.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Português (BR)](README.pt-BR.md) | [Italiano](README.it.md) | [한국어](README.ko.md) | [中文(简体)](README.zh-CN.md) | [中文(繁體)](README.zh-TW.md) | [Русский](README.ru.md) | [Bahasa Indonesia](README.id.md)

## 特徴

- **受信メッセージ自動翻訳:** 最新の投稿を優先して自動翻訳します。
- **送信翻訳ポップアップ:** 翻訳ボタン → ポップアップで入力 → 翻訳 → コピー。
- **スマートキャッシュ:** 同じ翻訳の再実行を避けます。
- **翻訳回数表示:** 月次の処理メッセージ数を表示します。
- **プライバシー重視:** API キーはローカル保存。翻訳対象の文章のみ処理します。

## スクリーンショット

受信翻訳:

![Incoming Translation](public/screenshots/translate-incoming.png)

送信翻訳ポップアップ:

![Outgoing Translation Popup](public/screenshots/translate-outgoing.png)

## 使用モデル

以下の順でフォールバックする tiered モデルを使用します:

1. `gpt-oss-120b`
2. `llama-3.3-70b`
3. `qwen-3-32b`
4. `llama3.1-8b`

レート制限や利用不可の場合は自動でリトライ/次モデルに切り替わります。

## 技術構成

- **Framework:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS
- **API Client:** Cerebras Inference API への直接 fetch
- **Build Tool:** CRXJS Vite Plugin

## ビルド & 読み込み

1. **依存関係のインストール:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **ビルド:**
   ```bash
   npm run build
   # or
   yarn build
   ```

3. **Chrome に読み込み:**
   - `chrome://extensions/` を開く
   - "Developer mode" を有効化
   - "Load unpacked" をクリック
   - ビルドで生成された `dist` フォルダを選択

## 開発（ウォッチ）

1. **開発ビルド:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Chrome に読み込み:**
   - `chrome://extensions/` を開く
   - "Developer mode" を有効化
   - "Load unpacked" をクリック
   - 開発ビルドで生成された `dist` フォルダを選択

## ライセンス

MIT