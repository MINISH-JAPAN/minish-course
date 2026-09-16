/**
 * MINISH with JAPAN Day 배너 컬러 투표 - 백엔드
 *
 * 사용 방법 (README.md 참고):
 * 1) 투표 결과를 저장할 Google Sheets 문서를 새로 만듭니다.
 * 2) 상단 메뉴 [확장 프로그램] > [Apps Script] 를 클릭합니다.
 * 3) 열린 편집기의 기본 코드를 모두 지우고 이 파일 내용 전체를 붙여넣습니다.
 * 4) 저장 후 [배포] > [새 배포] > 유형: "웹 앱" 선택
 *      - 실행 계정: 나(본인)
 *      - 액세스 권한이 있는 사용자: 전체(익명 사용자 포함)
 * 5) 배포된 웹 앱 URL을 복사해서 index.html과 같이 있는 config.js의
 *    SCRIPT_URL 값으로 붙여넣습니다.
 */

const SHEET_NAME = "votes";

function doPost(e) {
  const sheet = getOrCreateSheet_();

  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: "invalid_json" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  sheet.appendRow([
    new Date(),
    data.voterName || "",
    data.designId || "",
    data.designTitle || "",
    data.palette || "",
    data.timestamp || ""
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true })
  ).setMimeType(ContentService.MimeType.JSON);
}

// 브라우저에서 배포 URL을 직접 열었을 때 상태 확인용 (선택 사항)
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, message: "MINISH vote endpoint is running." })
  ).setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "제출시각(서버)",
      "이름/소속",
      "시안번호",
      "시안제목",
      "팔레트",
      "제출시각(클라이언트)"
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * 시트 메뉴에 "투표 집계" 버튼을 추가합니다.
 * Apps Script 편집기에서 이 파일을 저장한 뒤 스프레드시트를 새로고침하면
 * 상단 메뉴에 "투표 집계"가 나타납니다.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("투표 집계")
    .addItem("집계표 새로고침", "buildSummary")
    .addToUi();
}

/**
 * votes 시트의 데이터를 집계해서 "summary" 시트에 시안별 득표수를 정리합니다.
 */
function buildSummary() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const votes = ss.getSheetByName(SHEET_NAME);
  if (!votes || votes.getLastRow() < 2) {
    SpreadsheetApp.getUi().alert("아직 집계할 투표 데이터가 없습니다.");
    return;
  }

  const rows = votes.getRange(2, 1, votes.getLastRow() - 1, 5).getValues();
  const counts = {};
  rows.forEach(r => {
    const id = r[2];
    const title = r[3];
    if (!id) return;
    const key = id + " — " + title;
    counts[key] = (counts[key] || 0) + 1;
  });

  let summary = ss.getSheetByName("summary");
  if (summary) {
    summary.clear();
  } else {
    summary = ss.insertSheet("summary");
  }

  summary.appendRow(["시안", "득표수"]);
  summary.setFrozenRows(1);

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  sorted.forEach(([key, count]) => summary.appendRow([key, count]));

  summary.autoResizeColumns(1, 2);
  SpreadsheetApp.getUi().alert("집계 완료! 'summary' 시트를 확인하세요.");
}
