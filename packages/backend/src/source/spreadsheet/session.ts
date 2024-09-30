import { RvDate } from 'backend/schema/db/common';
import { Session, SessionID, SessionStatus } from 'backend/schema/db/session';
import { getSheet } from './common';

const SESSION_SHEET_NAME = 'セッション一覧';

/**
 * セッションIDを発行
 */
function genSessionID() {
  return SessionID.parse(crypto.randomUUID());
}

/**
 * セッションシートの初期化に用いる
 */
export function initSessionSheet(clearAllData: boolean = false) {
  const sheet = getSheet(SESSION_SHEET_NAME);

  // 既存のデータをすべて削除
  if (clearAllData) {
    sheet.clear();
  }

  const header = [
    'セッションID',
    '開始日',
    '終了日',
    'ステータス',
    '調査対象開始日',
    '調査対象終了日',
  ];
  sheet.getRange(1, 1, 1, header.length).setValues([header]);
}

/**
 * セッションの一覧を取得
 */
export function getSessions(): Session[] {
  const sheet = getSheet(SESSION_SHEET_NAME);

  const lastRow = sheet.getLastRow();
  const srcData = sheet.getRange(2, 1, lastRow, 6).getValues();

  return srcData.map((line) =>
    Session.parse({
      id: line[0],
      startDate: line[1],
      endDate: line[2],
      status: line[3],
      researchRangeStart: line[4],
      researchRangeEnd: line[5],
    })
  );
}

/**
 * 新規セッションを発行
 */
export function publishSession(
  startDate: RvDate,
  endDate: RvDate,
  researchRangeStart: RvDate,
  researchRangeEnd: RvDate
) {
  // データチェック
  const writeSession = Session.parse({
    id: genSessionID(),
    startDate: startDate,
    endDate: endDate,
    stats: 'ready',
    researchRangeStart: researchRangeStart,
    researchRangeEnd: researchRangeEnd,
  });

  // 書き込み
  const sheet = getSheet(SESSION_SHEET_NAME);
  const writeRow = sheet.getLastRow() + 1;
  const writeData = Object.values(writeSession);
  sheet
    .getRange(writeRow, 1, writeRow, writeData.length)
    .setValues([writeData]);
}

/**
 * セッションのアップデート
 */
export function updateSession(sessionId: SessionID, status: SessionStatus) {
  // get all session ids
  const sheet = getSheet(SESSION_SHEET_NAME);
  const idKeys: SessionID[] = sheet
    .getRange(2, 1, sheet.getLastRow(), 1)
    .getValues()
    .flat();

  // search target Data
  const targetRowIdx = idKeys.indexOf(sessionId);
  const dataCount = sheet.getLastColumn();
  const targetData = sheet
    .getRange(targetRowIdx, 1, targetRowIdx, dataCount)
    .getValues()[0];

  // update status
  targetData[3] = status;
  sheet
    .getRange(targetRowIdx, 1, targetRowIdx, dataCount)
    .setValues([targetData]);
}
