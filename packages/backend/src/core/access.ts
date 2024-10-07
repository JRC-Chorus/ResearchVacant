import { MemberStatus } from 'backend/schema/app';
import { AnsDate } from 'backend/schema/db/answer';
import { RvDate } from 'backend/schema/db/common';
import { SessionID } from 'backend/schema/db/session';
import { updateSession } from 'backend/source/spreadsheet/session';
import { getRecievedIds, isMember } from './access/checker';

/**
 * フロントエンドからのアクセスがあったときに，当該アクセスに対するレスポンスを定義
 */
export function accessManager(): MemberStatus {
  const ids = getRecievedIds();
  if (ids === void 0 || !isMember(ids.memberId)) {
    return { status: 'invalidUser' };
  }

  // TODO: メンバーIDとセッションのステータスを参照して適切なメンバーステータスを返す関数を実装
  return { status: 'invalidUser' };
}

/**
 * フロントエンドで記入した回答を提出する
 */
export function submitAnswers(ans: AnsDate[], freeTxt: string) {}

/**
 * 開催日を決定した際にフロントエンドから呼び出す関数
 *
 * 当該セッションのステータスを'judge' -> 'closed'とする
 */
export function decideDates(sessionId: SessionID, dates: RvDate[]) {
  // finish.tsのうち，必要な処理を呼び出す

  // ステータスを更新
  updateSession(sessionId, 'closed');
}
