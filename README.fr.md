# Discord Translator

Une extension Chrome qui traduit automatiquement les messages Discord via la [Cerebras Inference API](https://www.cerebras.ai/).

**Languages:**
[English](README.md) | [日本語](README.ja.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Português (BR)](README.pt-BR.md) | [Italiano](README.it.md) | [한국어](README.ko.md) | [中文(简体)](README.zh-CN.md) | [中文(繁體)](README.zh-TW.md) | [Русский](README.ru.md) | [Bahasa Indonesia](README.id.md)

## Fonctionnalités

- **Traduction automatique entrante :** Les nouveaux messages sont traduits en priorité pour les plus récents.
- **Popup de traduction sortante :** Cliquez sur le bouton, écrivez dans le popup, traduisez, puis copiez.
- **Cache intelligent :** Évite les appels API redondants grâce au cache local.
- **Compteur de traductions :** Affiche le nombre mensuel de messages traités.
- **Respect de la vie privée :** La clé API est stockée localement. Seuls les messages à traduire sont traités.

## Captures d’écran

Traduction entrante:

![Incoming Translation](public/screenshots/translate-incoming.png)

Popup de traduction sortante:

![Outgoing Translation Popup](public/screenshots/translate-outgoing.png)

Remplacez les images par vos propres captures lorsque prêt.

## Modèles

Cette extension utilise une stratégie de repli par niveaux dans l’ordre suivant :

1. `gpt-oss-120b`
2. `llama-3.3-70b`
3. `qwen-3-32b`
4. `llama3.1-8b`

Si un modèle est limité ou indisponible, l’extension réessaie ou bascule automatiquement sur le suivant.

## Stack technique

- **Framework :** React + TypeScript (Vite)
- **Styles :** Tailwind CSS
- **Client API :** fetch direct vers Cerebras Inference API
- **Build Tool :** CRXJS Vite Plugin

## Build & chargement

1. **Installer les dépendances :**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Build :**
   ```bash
   npm run build
   # or
   yarn build
   ```

3. **Charger dans Chrome :**
   - Ouvrir `chrome://extensions/`
   - Activer "Developer mode"
   - Cliquer sur "Load unpacked"
   - Sélectionner le dossier `dist` généré par le build.

## Développement (watch)

1. **Build de développement :**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Charger dans Chrome :**
   - Ouvrir `chrome://extensions/`
   - Activer "Developer mode"
   - Cliquer sur "Load unpacked"
   - Sélectionner le dossier `dist` généré par le build de développement.

## Licence

MIT