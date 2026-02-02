# Discord Translator

Cerebras Inference API를 사용해 Discord 메시지를 자동으로 번역하는 Chrome 확장 프로그램입니다.

**Languages:**
[English](README.md) | [日本語](README.ja.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Português (BR)](README.pt-BR.md) | [Italiano](README.it.md) | [한국어](README.ko.md) | [中文(简体)](README.zh-CN.md) | [中文(繁體)](README.zh-TW.md) | [Русский](README.ru.md) | [Bahasa Indonesia](README.id.md)

## 면책사항 및 이용 약관

이 프로젝트는 **클라이언트 측 수정**(Chrome 확장)이며 Discord Inc.와 **제휴, 승인, 후원 관계가 없습니다.**

### 위험 고지
Discord 웹 클라이언트를 수정하는 서드파티 클라이언트/확장 사용은 [Discord 이용 약관](https://discord.com/terms) (클라이언트 수정 및 스크래핑 관련 조항)을 위반할 수 있습니다.
- **사용은 본인의 책임입니다.**
- 이 도구 사용으로 인한 계정 정지, 밴 등 제재에 대해 개발자는 책임을 지지 않습니다.

### 개인정보 및 데이터 처리
이 확장은 번역을 위해 메시지 내용을 **Cerebras Inference API**로 전송합니다.
- **데이터 흐름:** Discord Web Client -> 브라우저 -> Cerebras API -> 브라우저
- **API 키:** API 키는 로컬(`chrome.storage.local`)에 저장되며 Cerebras로 직접 전송됩니다. 다른 제3자 서버로 전송되지 않습니다.
- **개인정보:** 이 확장을 사용하면 화면에 표시되는 텍스트가 Cerebras에 의해 처리될 수 있음을 인정하는 것입니다. 자세한 내용은 [Cerebras 개인정보처리방침](https://cerebras.ai/privacy-policy)을 확인하세요.

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