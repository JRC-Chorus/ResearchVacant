/**
 * 調査を始めるための実装をする
 */
import { Session, SessionID } from 'backend/schema/db/session';
import { getSessions } from 'backend/source/spreadsheet/session';

/**
 * セッションの一覧を取得し，本日の日付に対して必要なセッションの発行を行う
 *
 * 新規発行したセッションはデータベースに追記する
 */
export function sessionChecker(): Session[] {
  const sessions = getSessions();

  // TODO: 本日の日付とセッション発行に関する設定項目をもとに新規セッションの発行をする
}

/**
 * 調査開始
 */
export function startSession(sessionId: SessionID) {
  // 回答記録用シートの作成，ステータスの更新等，必要なデータベースの整備を行う




  // 案内メールの送付


  
}

/**
 * 部員全員に案内メールを送信する
 */
function sendMail2Members() {}

/**
 * セッションを確認し，対象者にリマインドメールを送信する
 */
export function sendRemindMail(sessionId: SessionID) {}
