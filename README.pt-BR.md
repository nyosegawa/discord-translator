# Discord Translator

Uma extensão do Chrome que traduz automaticamente mensagens do Discord usando a [Cerebras Inference API](https://www.cerebras.ai/).

**Languages:**
[English](README.md) | [日本語](README.ja.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Português (BR)](README.pt-BR.md) | [Italiano](README.it.md) | [한국어](README.ko.md) | [中文(简体)](README.zh-CN.md) | [中文(繁體)](README.zh-TW.md) | [Русский](README.ru.md) | [Bahasa Indonesia](README.id.md)

## Aviso legal e termos de uso

Este projeto é uma **modificação do lado do cliente** (extensão do Chrome) e **não é afiliado, endossado ou patrocinado** pela Discord Inc.

### Aviso de risco
O uso de clientes ou extensões de terceiros que modificam o cliente web do Discord viola os [Termos de Serviço do Discord](https://discord.com/terms) (especialmente sobre modificações do cliente e scraping).
- **Use por sua conta e risco.**
- O desenvolvedor não se responsabiliza por suspensões, banimentos ou outras penalidades ao usar esta ferramenta.

### Privacidade e tratamento de dados
Esta extensão envia o conteúdo das mensagens para a **Cerebras Inference API** para tradução.
- **Fluxo de dados:** Discord Web Client -> Seu navegador -> Cerebras API -> Seu navegador.
- **Sua API Key:** A API Key é armazenada localmente (`chrome.storage.local`) e enviada diretamente à Cerebras. Não é enviada para outros servidores de terceiros.
- **Privacidade:** Ao usar esta extensão, você reconhece que o texto visível na tela pode ser processado pela Cerebras. Consulte a [Política de Privacidade da Cerebras](https://cerebras.ai/privacy-policy).

## Recursos

- **Auto‑tradução de mensagens recebidas:** Novas mensagens são traduzidas automaticamente, priorizando as mais recentes.
- **Popup de tradução para envio:** Clique no botão, escreva no popup, traduza e copie o resultado.
- **Cache inteligente:** Evita chamadas redundantes à API com cache local.
- **Contagem de traduções:** Mostra o número mensal de mensagens processadas.
- **Foco em privacidade:** A chave da API fica armazenada localmente. Apenas mensagens a traduzir são processadas.

## Capturas de tela

Tradução recebida:

![Incoming Translation](public/screenshots/translate-incoming.png)

Popup de tradução para envio:

![Outgoing Translation Popup](public/screenshots/translate-outgoing.png)

## Modelos

Esta extensão usa uma estratégia de fallback em camadas nesta ordem:

1. `gpt-oss-120b`
2. `llama-3.3-70b`
3. `qwen-3-32b`
4. `llama3.1-8b`

Se um modelo estiver limitado ou indisponível, o sistema tenta novamente ou faz fallback para o próximo.

## Stack técnico

- **Framework:** React + TypeScript (Vite)
- **Estilo:** Tailwind CSS
- **Cliente da API:** fetch direto para Cerebras Inference API
- **Build Tool:** CRXJS Vite Plugin

## Build & carregar

1. **Instalar dependências:**
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

3. **Carregar no Chrome:**
   - Abrir `chrome://extensions/`
   - Ativar "Developer mode"
   - Clicar em "Load unpacked"
   - Selecionar a pasta `dist` gerada pelo build.

## Desenvolvimento (watch)

1. **Rodar build de desenvolvimento:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Carregar no Chrome:**
   - Abrir `chrome://extensions/`
   - Ativar "Developer mode"
   - Clicar em "Load unpacked"
   - Selecionar a pasta `dist` gerada pelo build de desenvolvimento.

## Licença

MIT