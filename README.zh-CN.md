# Discord Translator

一个使用 [Cerebras Inference API](https://www.cerebras.ai/) 自动翻译 Discord 消息的 Chrome 扩展。

**Languages:**
[English](README.md) | [日本語](README.ja.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Português (BR)](README.pt-BR.md) | [Italiano](README.it.md) | [한국어](README.ko.md) | [中文(简体)](README.zh-CN.md) | [中文(繁體)](README.zh-TW.md) | [Русский](README.ru.md) | [Bahasa Indonesia](README.id.md)

## 免责声明与使用条款

本项目为 **客户端侧修改**（Chrome 扩展），**不隶属于、未获 Discord Inc. 认可或赞助**。

### 风险提示
使用修改 Discord Web 客户端的第三方客户端或扩展，可能违反 [Discord 服务条款](https://discord.com/terms)（特别是关于客户端修改与抓取的条款）。
- **使用风险自负。**
- 使用本工具导致的封号、禁用等处罚，开发者不承担任何责任。

### 隐私与数据处理
本扩展会将消息内容发送至 **Cerebras Inference API** 进行翻译。
- **数据流:** Discord Web Client -> 你的浏览器 -> Cerebras API -> 你的浏览器。
- **API Key:** API Key 保存在本地（`chrome.storage.local`），并直接发送至 Cerebras，不会发送给其他第三方服务器。
- **隐私:** 使用本扩展即表示你知悉屏幕上的文本可能会由 Cerebras 处理。详情请参阅 [Cerebras 隐私政策](https://cerebras.ai/privacy-policy)。

## 功能

- **消息自动翻译（接收）：** 新消息自动翻译，优先处理最新消息。
- **发送翻译弹窗：** 点击翻译按钮，在弹窗输入、翻译并复制结果。
- **智能缓存：** 通过本地缓存避免重复调用 API。
- **翻译计数：** 显示每月处理消息数量。
- **隐私优先：** API Key 本地保存，仅处理需要翻译的消息。

## 截图

接收翻译：

![Incoming Translation](public/screenshots/translate-incoming.png)

发送翻译弹窗：

![Outgoing Translation Popup](public/screenshots/translate-outgoing.png)

## 模型

本扩展使用分层回退策略，顺序如下：

1. `gpt-oss-120b`
2. `llama-3.3-70b`
3. `qwen-3-32b`
4. `llama3.1-8b`

当模型限流或不可用时，会自动重试或切换到下一个模型。

## 技术栈

- **Framework:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS
- **API Client:** 直接 fetch 到 Cerebras Inference API
- **Build Tool:** CRXJS Vite Plugin

## 构建与加载

1. **安装依赖：**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **构建：**
   ```bash
   npm run build
   # or
   yarn build
   ```

3. **在 Chrome 中加载：**
   - 打开 `chrome://extensions/`
   - 启用 "Developer mode"
   - 点击 "Load unpacked"
   - 选择构建生成的 `dist` 目录

## 开发（Watch）

1. **运行开发构建：**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **在 Chrome 中加载：**
   - 打开 `chrome://extensions/`
   - 启用 "Developer mode"
   - 点击 "Load unpacked"
   - 选择开发构建生成的 `dist` 目录

## 许可证

MIT