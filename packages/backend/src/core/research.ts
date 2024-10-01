/**
 * 調査全体に関する処理を記述する
 */
import { MemberStatus } from 'backend/schema/app';
import { RvDate } from 'backend/schema/db/common';
import { MemberID } from 'backend/schema/db/member';
import { SessionID } from 'backend/schema/db/session';
import { updateSession } from 'backend/source/spreadsheet/session';
import { sendRemindMail, sessionChecker, startSession } from './research/begin';
import { sendJudgeCandidate } from './research/finish';

/**
 * この関数を定期実行し，ステータスに応じた処理を実行する
 */
export function researchManager() {
  // セッション一覧・設定シートを確認し，開催中の調査（リマインドの送付，終了案内の送付等）や開始すべき調査について確認する
  const sessions = sessionChecker();

  sessions.forEach(session => {
    // （各処理の最後でセッションを更新する）
    // 新規でセッションを開始（'ready' -> 'opening'）
    // if(今日の日付＜セッションの開始日＆ステータス＝'ready')
    startSession(session.id);
  
    // リマインドの送付（'opening' -> 'opening'）
    // if(リマインドの閾値＞セッションの終了日ー今日の日付＆ステータス＝'opening')
    sendRemindMail(session.id)
  
    // 管理者へ候補日の案内（'opening' -> 'judge'）
    // if(本日の日付＞セッションの終了日＆ステータス＝'opening')
    sendJudgeCandidate(session.id)
  
    // 完全に終了した後の処理（不要になったデータの削除など？）
  })
}

/**
 * フロントエンドからのアクセスがあったときに，当該アクセスに対するレスポンスを定義
 */
export function accessManager(
  sessionId: SessionID,
  memberId: MemberID
): MemberStatus {
  // TODO: メンバーIDとセッションのステータスを参照して適切なメンバーステータスを返す関数を実装
  return { status: 'noAns' };
}

/**
 * 開催日を決定する際に呼び出す関数
 *
 * 当該セッションのステータスを'judge' -> 'closed'とする
 */
export function decideDates(sessionId: SessionID, dates: RvDate[]) {
  // finish.tsのうち，必要な処理を呼び出す

  // ステータスを更新
  updateSession(sessionId, 'closed');
}
