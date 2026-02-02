# Discord Translator

Una extensión de Chrome que traduce automáticamente mensajes de Discord usando la [Cerebras Inference API](https://www.cerebras.ai/).

**Languages:**
[English](README.md) | [日本語](README.ja.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Português (BR)](README.pt-BR.md) | [Italiano](README.it.md) | [한국어](README.ko.md) | [中文(简体)](README.zh-CN.md) | [中文(繁體)](README.zh-TW.md) | [Русский](README.ru.md) | [Bahasa Indonesia](README.id.md)

## Funciones

- **Auto‑traducción entrante:** Los mensajes nuevos se traducen automáticamente, priorizando los más recientes.
- **Popup de traducción saliente:** Pulsa el botón de traducir, escribe en el popup, traduce y copia el resultado.
- **Caché inteligente:** Evita llamadas redundantes a la API mediante caché local.
- **Conteo de traducciones:** Muestra el número de mensajes procesados por mes.
- **Enfoque en privacidad:** La API Key se guarda localmente. Solo se procesan los mensajes a traducir.

## Capturas

Traducción entrante:

![Incoming Translation](public/screenshots/translate-incoming.png)

Popup de traducción saliente:

![Outgoing Translation Popup](public/screenshots/translate-outgoing.png)

## Modelos

Esta extensión usa una estrategia de fallback por niveles en este orden:

1. `gpt-oss-120b`
2. `llama-3.3-70b`
3. `qwen-3-32b`
4. `llama3.1-8b`

Si un modelo está limitado o no disponible, reintenta o cambia al siguiente automáticamente.

## Stack técnico

- **Framework:** React + TypeScript (Vite)
- **Estilos:** Tailwind CSS
- **Cliente API:** fetch directo a Cerebras Inference API
- **Build Tool:** CRXJS Vite Plugin

## Build y carga

1. **Instalar dependencias:**
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

3. **Cargar en Chrome:**
   - Abre `chrome://extensions/`
   - Activa "Developer mode"
   - Haz clic en "Load unpacked"
   - Selecciona la carpeta `dist` generada por el build.

## Desarrollo (watch)

1. **Ejecutar build de desarrollo:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Cargar en Chrome:**
   - Abre `chrome://extensions/`
   - Activa "Developer mode"
   - Haz clic en "Load unpacked"
   - Selecciona la carpeta `dist` generada por el build de desarrollo.

## Licencia

MIT