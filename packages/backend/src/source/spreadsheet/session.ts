import { RvDate } from 'backend/schema/db/common';
import { Session, SessionID, SessionStatus } from 'backend/schema/db/session';
import { fromEntries, keys, toEntries, values } from 'backend/utils/obj/obj';
import { getSheet } from './common';

const SESSION_SHEET_NAME = 'セッション一覧';
let cachedSessions: Session[] | undefined;

// db source
const header: Record<keyof Session, string> = {
  id: 'セッションID',
  status: 'ステータス',
  startDate: '開始日',
  remindDate: 'リマインド日',
  endDate: '終了日',
  researchRangeStart: '調査対象開始日',
  researchRangeEnd: '調査対象終了日',
};

/**
 * セッションIDを発行
 */
function genSessionID() {
  return SessionID.parse(crypto.randomUUID());
}

/**
 * セッション一覧をSpreadSheetに書き込み
 *
 * 引数で書き込みたいセッションを渡し，キャッシュの更新もできるが，渡さない場合はキャッシュが書き込まれる
 *
 * cf) ここではすべてのデータを毎回書き換える実装としているが，書き換えのサーバー処理より通信の方が実行時間は支配的になると考えてこのままにしている．
 * 遅延が目立つ場合には，書き込むデータをアップデートしたいデータのみに絞る実装に変更．
 */
function writeSessions(sessions?: Session[]) {
  if (!sessions) {
    cachedSessions = sessions;
  }
  if (!cachedSessions) {
    throw new Error('No writable session data');
  }

  // initialize
  initSessionSheet(true);

  // write new data
  const headerKeys = keys(header);
  const writeData = cachedSessions.map((s) => headerKeys.map((k) => s[k]));
  const sheet = getSheet(SESSION_SHEET_NAME);
  sheet
    .getRange(2, 1, cachedSessions.length + 1, headerKeys.length)
    .setValues(writeData);
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

  // write header text
  const headerVals = values(header);
  sheet.getRange(1, 1, 1, headerVals.length).setValues([headerVals]);
}

/**
 * セッションの一覧を取得
 */
export function getSessions(loadForce: boolean = false): Session[] {
  if (!cachedSessions || loadForce) {
    const sheet = getSheet(SESSION_SHEET_NAME);

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      cachedSessions = [];
    } else {
      const srcData = sheet.getRange(2, 1, lastRow, 6).getValues();
      cachedSessions = srcData.map((line) =>
        Session.parse(
          fromEntries(toEntries(header).map(([k, v], idx) => [k, line[idx]]))
        )
      );
    }
  }

  return cachedSessions;
}

/**
 * 新規セッションを発行
 *
 * 発行したセッション情報を返す
 */
export function publishSession(
  startDate: RvDate,
  remindDate: RvDate | undefined,
  endDate: RvDate,
  researchRangeStart: RvDate,
  researchRangeEnd: RvDate
) {
  // データチェック
  const writeSession = Session.parse({
    id: genSessionID(),
    startDate: startDate,
    remindDate: remindDate,
    endDate: endDate,
    stats: 'ready',
    researchRangeStart: researchRangeStart,
    researchRangeEnd: researchRangeEnd,
  });

  // 書き込み
  const sessions = getSessions();
  sessions.push(writeSession);
  writeSessions(sessions);

  return writeSession;
}

/**
 * セッションのアップデート
 */
export function updateSession(sessionId: SessionID, status: SessionStatus) {
  const sessions = getSessions();

  // get all session ids
  const idKeys: SessionID[] = sessions.map((s) => s.id);

  // search target Data
  const targetRowIdx = idKeys.indexOf(sessionId);
  if (targetRowIdx === -1) {
    throw new Error('Could not update unkown session');
  }

  // update sessions
  sessions[targetRowIdx].status = status;
  writeSessions(sessions);
}

/**
 * セッションの削除
 */
export function deleteSession(sessionId: SessionID) {
  // get all session ids
  const sessions = getSessions();
  const idKeys: SessionID[] = sessions.map((s) => s.id);

  // search target Data
  const targetRowIdx = idKeys.indexOf(sessionId);

  // delete Session
  sessions.splice(targetRowIdx, 1);
  writeSessions(sessions);
}
