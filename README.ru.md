# Discord Translator

Расширение Chrome, которое автоматически переводит сообщения Discord с помощью [Cerebras Inference API](https://www.cerebras.ai/).

**Languages:**
[English](README.md) | [日本語](README.ja.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Português (BR)](README.pt-BR.md) | [Italiano](README.it.md) | [한국어](README.ko.md) | [中文(简体)](README.zh-CN.md) | [中文(繁體)](README.zh-TW.md) | [Русский](README.ru.md) | [Bahasa Indonesia](README.id.md)

## Возможности

- **Автоперевод входящих:** Новые сообщения переводятся автоматически, с приоритетом самых свежих.
- **Всплывающее окно для исходящих:** Нажмите кнопку, введите текст, переведите и скопируйте результат.
- **Умный кеш:** Избегает повторных вызовов API с помощью локального кеша.
- **Счетчик переводов:** Показывает число обработанных сообщений за месяц.
- **Приватность:** API-ключ хранится локально. Обрабатываются только сообщения для перевода.

## Скриншоты

Перевод входящих:

![Incoming Translation](public/screenshots/translate-incoming.png)

Окно перевода исходящих:

![Outgoing Translation Popup](public/screenshots/translate-outgoing.png)

## Модели

Используется каскадная стратегия fallback в следующем порядке:

1. `gpt-oss-120b`
2. `llama-3.3-70b`
3. `qwen-3-32b`
4. `llama3.1-8b`

Если модель ограничена или недоступна, происходит повторная попытка или переход к следующей.

## Технический стек

- **Framework:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS
- **API Client:** прямой fetch к Cerebras Inference API
- **Build Tool:** CRXJS Vite Plugin

## Сборка и загрузка

1. **Установите зависимости:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Сборка:**
   ```bash
   npm run build
   # or
   yarn build
   ```

3. **Загрузка в Chrome:**
   - Откройте `chrome://extensions/`
   - Включите "Developer mode"
   - Нажмите "Load unpacked"
   - Выберите папку `dist`, созданную сборкой.

## Разработка (Watch)

1. **Запуск dev-сборки:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Загрузка в Chrome:**
   - Откройте `chrome://extensions/`
   - Включите "Developer mode"
   - Нажмите "Load unpacked"
   - Выберите папку `dist`, созданную dev-сборкой.

## Лицензия

MIT