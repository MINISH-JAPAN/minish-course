# MINISH with JAPAN Day — 배너 컬러/디자인 투표 사이트

미니쉬코스 수료 소셜 네트워킹 "MINISH with JAPAN Day" 배너 시안 12개 중
가장 좋은 컬러/디자인을 팀원들이 투표할 수 있는 간단한 웹페이지입니다.

- 프론트엔드: `index.html` (GitHub Pages로 무료 호스팅)
- 투표 결과 저장: Google Sheets (Google Apps Script를 통해 자동 기록)

아래 순서대로 딱 두 가지만 하면 됩니다.
**① Google Sheets + Apps Script 만들기 → ② GitHub Pages에 올리기**

---

## 1. Google Sheets + Apps Script 연동 (투표 결과 저장소 만들기)

1. [sheets.google.com](https://sheets.google.com) 에서 새 스프레드시트를 만듭니다.
   - 이름 예시: `MINISH Day 배너 투표 결과`
2. 상단 메뉴에서 **확장 프로그램 → Apps Script** 를 클릭합니다.
3. 열린 편집기에 기본으로 있는 코드(`function myFunction() {}` 등)를 전부 지우고,
   이 저장소의 `apps-script/Code.gs` 파일 내용을 전부 복사해서 붙여넣습니다.
4. 우측 상단 저장(디스크 아이콘)을 누릅니다.
5. 우측 상단 **배포 → 새 배포** 클릭
   - 유형 선택(⚙️ 톱니바퀴)에서 **웹 앱** 선택
   - 설명: 아무거나 (예: `minish vote v1`)
   - **실행 계정**: 나(본인 이메일)
   - **액세스 권한이 있는 사용자**: **전체** (익명 사용자 포함, 그래야 투표자들이 로그인 없이 제출 가능)
   - **배포** 버튼 클릭 → 권한 승인 화면이 뜨면 본인 계정으로 승인
6. 배포가 끝나면 나오는 **웹 앱 URL** (`https://script.google.com/macros/s/.../exec` 형태)을 복사해둡니다.
7. 이 저장소의 `config.js` 파일을 열어서

   ```js
   const SCRIPT_URL = "https://script.google.com/macros/s/여기에_배포한_웹앱_URL을_붙여넣으세요/exec";
   ```

   이 줄의 URL을 방금 복사한 배포 URL로 교체하고 저장합니다.

> 💡 나중에 투표 결과를 보고 싶으면, 스프레드시트로 돌아가서
> `votes` 시트에 실시간으로 쌓이는 걸 확인하면 됩니다.
> 시안별 득표수 요약표가 필요하면 스프레드시트 상단 메뉴의
> **"투표 집계" → "집계표 새로고침"** 을 누르면 `summary` 시트가 자동 생성됩니다.
> (메뉴가 안 보이면 스프레드시트를 새로고침 해보세요.)

---

## 2. GitHub에 올려서 GitHub Pages로 배포하기

### 2-1. 저장소(repository) 만들기

1. [github.com](https://github.com) 에 로그인합니다.
2. 우측 상단 **+ → New repository** 클릭
3. Repository name: `minish-color-vote` (원하는 이름으로 변경 가능)
4. Public 으로 설정 (GitHub Pages 무료 사용을 위해)
5. **Create repository** 클릭

### 2-2. 파일 업로드

1. 방금 만든 저장소 페이지에서 **Add file → Upload files** 클릭
2. 이 폴더 안의 파일/폴더를 전부 끌어다 놓습니다:
   - `index.html`
   - `config.js` (1번 단계에서 URL 수정한 버전)
   - `images/` 폴더 전체 (design-01.jpg ~ design-12.jpg)
   - `apps-script/Code.gs` (참고용, Pages 배포에는 영향 없음)
   - `README.md`
3. 하단에 커밋 메시지 입력 후 **Commit changes** 클릭

### 2-3. GitHub Pages 활성화

1. 저장소 상단 메뉴에서 **Settings** 클릭
2. 왼쪽 메뉴에서 **Pages** 클릭
3. **Build and deployment → Source**: `Deploy from a branch` 선택
4. **Branch**: `main` (또는 `master`) / 폴더는 `/ (root)` 선택 후 **Save**
5. 1~2분 정도 기다리면 페이지 상단에
   `Your site is live at https://<본인아이디>.github.io/minish-color-vote/`
   같은 링크가 나타납니다.
6. 이 링크를 팀원들에게 공유하면 바로 투표 페이지가 열립니다.

---

## 3. 나중에 수정하고 싶을 때

- 이미지나 코멘트 문구를 바꾸고 싶으면 `index.html` 안의 `DESIGNS` 배열을 수정한 뒤,
  GitHub 저장소에서 해당 파일을 다시 업로드(덮어쓰기)하면 됩니다.
- Apps Script 코드를 수정한 경우, Apps Script 편집기에서 **배포 → 배포 관리 → 수정(연필 아이콘) → 새 버전으로 배포** 를 해줘야 반영됩니다. (URL은 그대로 유지됨)

---

## 파일 구성

```
minish-color-vote/
├── index.html          # 투표 페이지 (GitHub Pages로 서빙)
├── config.js            # Google Apps Script 웹앱 URL 설정
├── images/
│   ├── design-01.jpg ... design-12.jpg
├── apps-script/
│   └── Code.gs           # Google Apps Script (Sheets에 저장 + 집계 메뉴)
└── README.md
```
