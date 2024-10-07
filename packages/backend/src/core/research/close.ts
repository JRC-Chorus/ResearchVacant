/**
 * 調査終了時の処理を実装する
 */
import { SessionID } from 'backend/schema/db/session';
import { deleteSheet } from 'backend/source/spreadsheet/common';
import { deleteSession } from 'backend/source/spreadsheet/session';

/**
 * 全ての調査が終了した際に不要となったデータを削除する
 */
export function cleanUpBackData(sessionId: SessionID) {
  // 回答の記録用シートはセッションIDをそのままシート名としている
  deleteSheet(sessionId);

  // セッション一覧から当該セッションを削除
  deleteSession(sessionId);
}
