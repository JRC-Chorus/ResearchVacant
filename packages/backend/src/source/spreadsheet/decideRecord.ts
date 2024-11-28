/**
 * 調査によって決定した開催日に関する情報を保存する
 */
import {
  DecidedRecord,
  fromEntries,
  keys,
  PartyInfo,
  SessionID,
  toEntries,
  values,
} from '@research-vacant/common';
import { getSheet, warpLock } from './common';

const RECORD_SHEET_NAME = '決定済み開催日一覧';
let cachedRecords: Record<SessionID, DecidedRecord> | undefined;

// db source
const header: Record<keyof DecidedRecord, string> = {
  sessionId: 'セッションID',
  infos: '開催場所情報',
};

/**
 * セッションシートの初期化に用いる
 */
export function initRecordsSheet(clearAllData: boolean = false) {
  warpLock(() => __initRecordsSheet(clearAllData));
}

function __initRecordsSheet(clearAllData: boolean = false) {
  const sheet = getSheet(RECORD_SHEET_NAME, true);

  // 既存のデータをすべて削除
  if (clearAllData) {
    sheet.clear();
  }

  // write header text
  const headerVals = values(header);
  sheet.getRange(1, 1, 1, headerVals.length).setValues([headerVals]);
}

/**
 * 開催日の一覧を取得
 */
export function getPartys(
  loadForce: boolean = false
): Record<SessionID, DecidedRecord> {
  if (!cachedRecords || loadForce) {
    const sheet = getSheet(RECORD_SHEET_NAME);

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      cachedRecords = {};
    } else {
      const srcData = sheet
        .getRange(2, 1, lastRow - 1, keys(header).length)
        .getValues();
      // 開催情報が何列目にあるか
      const infoIdx = keys(header).findIndex((k) => k === 'infos');
      // PartyInfoはオブジェクト構造を直接記録するため，パーサーを入れて構造を解析する
      const sessions = srcData.map((line) =>
        DecidedRecord.parse(
          fromEntries(
            toEntries(header).map(([k, v], idx) => {
              if (idx === infoIdx) {
                const parsedInfo = PartyInfo.array().parse(
                  JSON.parse(line[idx])
                );
                return [k, parsedInfo];
              } else {
                return [k, line[idx]];
              }
            })
          )
        )
      );
      cachedRecords = fromEntries(sessions.map((r) => [r.sessionId, r]));
    }
  }

  return cachedRecords;
}

/**
 * 開催日一覧をSpreadSheetに書き込み
 *
 * 引数で書き込みたいセッションを渡し，キャッシュの更新もできるが，渡さない場合はキャッシュが書き込まれる
 *
 * cf) ここではすべてのデータを毎回書き換える実装としているが，書き換えのサーバー処理より通信の方が実行時間は支配的になると考えてこのままにしている．
 * 遅延が目立つ場合には，書き込むデータをデータ一覧末尾に追加するのみとする実装に変更
 */
function writeRecords(records: Record<SessionID, DecidedRecord>) {
  if (records) {
    cachedRecords = records;
  }
  if (!cachedRecords) {
    throw new Error('No writable decided date records');
  }

  // initialize
  initRecordsSheet(true);

  // ready new data
  const headerKeys = keys(header);
  const writeData = values(cachedRecords).map((s) =>
    headerKeys.map((k) => {
      if (k === 'infos') {
        return JSON.stringify(s[k]);
      } else {
        return s[k];
      }
    })
  );

  // write new data
  const sheet = getSheet(RECORD_SHEET_NAME);
  sheet
    .getRange(2, 1, writeData.length, headerKeys.length)
    .setValues(writeData);
}

/**
 * 決定した開催日を登録
 */
export function registPartyDate(sessionId: SessionID, infos: PartyInfo[]) {
  const tmpRecords = getPartys();
  tmpRecords[sessionId] = { sessionId, infos };
  warpLock(() => writeRecords(tmpRecords));
}
