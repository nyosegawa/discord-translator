# Discord Translator

Ekstensi Chrome yang menerjemahkan pesan Discord secara otomatis menggunakan [Cerebras Inference API](https://www.cerebras.ai/).

**Languages:**
[English](README.md) | [日本語](README.ja.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Português (BR)](README.pt-BR.md) | [Italiano](README.it.md) | [한국어](README.ko.md) | [中文(简体)](README.zh-CN.md) | [中文(繁體)](README.zh-TW.md) | [Русский](README.ru.md) | [Bahasa Indonesia](README.id.md)

## Fitur

- **Auto‑translate pesan masuk:** Pesan baru diterjemahkan otomatis, dengan prioritas pesan terbaru.
- **Popup terjemahan untuk pesan keluar:** Klik tombol terjemahkan, tulis di popup, terjemahkan, lalu salin hasil.
- **Cache cerdas:** Menghindari panggilan API berulang dengan cache lokal.
- **Hitung terjemahan:** Menampilkan jumlah pesan yang diproses per bulan.
- **Fokus privasi:** API key disimpan lokal. Hanya pesan yang perlu diterjemahkan yang diproses.

## Screenshot

Terjemahan masuk (placeholder):

![Incoming Translation](public/screenshots/translate-incoming.png)

Popup terjemahan keluar (placeholder):

![Outgoing Translation Popup](public/screenshots/translate-outgoing.png)

Ganti gambar dengan screenshot milikmu saat sudah siap.

## Model

Ekstensi ini menggunakan strategi fallback bertingkat dengan urutan berikut:

1. `gpt-oss-120b`
2. `llama-3.3-70b`
3. `qwen-3-32b`
4. `llama3.1-8b`

Jika model terkena rate limit atau tidak tersedia, akan otomatis retry atau berpindah ke model berikutnya.

## Tech Stack

- **Framework:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS
- **API Client:** fetch langsung ke Cerebras Inference API
- **Build Tool:** CRXJS Vite Plugin

## Build & Load

1. **Install dependencies:**
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

3. **Load di Chrome:**
   - Buka `chrome://extensions/`
   - Aktifkan "Developer mode"
   - Klik "Load unpacked"
   - Pilih folder `dist` hasil build.

## Development (Watch)

1. **Jalankan dev build:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Load di Chrome:**
   - Buka `chrome://extensions/`
   - Aktifkan "Developer mode"
   - Klik "Load unpacked"
   - Pilih folder `dist` hasil dev build.

## Lisensi

MIT