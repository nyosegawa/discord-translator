# Discord Translator

Cerebras Inference API를 사용해 Discord 메시지를 자동으로 번역하는 Chrome 확장 프로그램입니다.

**Languages:**
[English](README.md) | [日本語](README.ja.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Português (BR)](README.pt-BR.md) | [Italiano](README.it.md) | [한국어](README.ko.md) | [中文(简体)](README.zh-CN.md) | [中文(繁體)](README.zh-TW.md) | [Русский](README.ru.md) | [Bahasa Indonesia](README.id.md)

## 주요 기능

- **수신 자동 번역:** 최신 메시지를 우선으로 자동 번역합니다.
- **발신 번역 팝업:** 번역 버튼 → 팝업에서 입력 → 번역 → 복사.
- **스마트 캐싱:** 중복 API 호출을 로컬 캐시로 방지합니다.
- **번역 카운트:** 월간 처리 메시지 수를 표시합니다.
- **개인정보 중심:** API 키는 로컬에 저장되며 번역할 메시지만 처리합니다.

## 스크린샷

수신 번역:

![Incoming Translation](public/screenshots/translate-incoming.png)

발신 번역 팝업:

![Outgoing Translation Popup](public/screenshots/translate-outgoing.png)

## 모델

다음 순서의 tiered fallback 전략을 사용합니다:

1. `gpt-oss-120b`
2. `llama-3.3-70b`
3. `qwen-3-32b`
4. `llama3.1-8b`

레이트 리밋이나 사용 불가 시 자동으로 재시도하거나 다음 모델로 전환합니다.

## 기술 스택

- **Framework:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS
- **API Client:** Cerebras Inference API 직접 fetch
- **Build Tool:** CRXJS Vite Plugin

## 빌드 및 로드

1. **의존성 설치:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **빌드:**
   ```bash
   npm run build
   # or
   yarn build
   ```

3. **Chrome에 로드:**
   - `chrome://extensions/` 열기
   - "Developer mode" 활성화
   - "Load unpacked" 클릭
   - 빌드로 생성된 `dist` 폴더 선택

## 개발(Watch)

1. **개발 빌드 실행:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Chrome에 로드:**
   - `chrome://extensions/` 열기
   - "Developer mode" 활성화
   - "Load unpacked" 클릭
   - 개발 빌드로 생성된 `dist` 폴더 선택

## 라이선스

MIT