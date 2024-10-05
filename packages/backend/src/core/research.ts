/**
 * 調査全体に関する処理を記述する
 */
import dayjs from 'dayjs';
import { MemberStatus } from 'backend/schema/app';
import { RvDate } from 'backend/schema/db/common';
import { MemberID } from 'backend/schema/db/member';
import { SessionID } from 'backend/schema/db/session';
import { updateSession } from 'backend/source/spreadsheet/session';
import { sendRemindMail, sessionChecker, startSession } from './research/begin';
import { sendJudgeCandidate } from './research/finish';

/**
 * この関数を毎日実行し，ステータスに応じた処理を実行する
 */
export function researchManager() {
  // セッション一覧・設定シートを確認し，開催中の調査（リマインドの送付，終了案内の送付等）や開始すべき調査について確認する
  const sessions = sessionChecker();

  sessions.forEach((session) => {
    // 新規でセッションを開始（'ready' -> 'opening'）
    // if(今日の日付＜セッションの開始日＆ステータス＝'ready')
    if (
      dayjs().diff(session.startDate, 'day') >= 0 &&
      session.status === 'ready'
    ) {
      startSession(session.id);
      updateSession(session.id, 'opening');
    }
    // リマインドの送付（'opening' -> 'opening'）
    // if(リマインドの閾値＞セッションの終了日ー今日の日付＆ステータス＝'opening')
    else if (
      session.remindDate &&
      dayjs().diff(session.endDate, 'day') >= -session.remindDate &&
      session.status === 'opening'
    ) {
      sendRemindMail(session.id);
    }
    // 管理者へ候補日の案内（'opening' -> 'judge'）
    // if(本日の日付＞セッションの終了日＆ステータス＝'opening')
    else if (
      dayjs().diff(session.endDate, 'day') >= 0 &&
      session.status === 'opening'
    ) {
      sendJudgeCandidate(session.id);
      updateSession(session.id, 'judge');
    }
    // 完全に終了した後の処理（不要になったデータの削除など？）
    else if (session.status === 'closed') {
      // 現状ではすべてのセッションはバックログとして残しておくことにしているため，コメントアウト
      // cleanUpBackData(session.id)
    }
  });
}

/**
 * フロントエンドからのアクセスがあったときに，当該アクセスに対するレスポンスを定義
 */
export function accessManager(
  sessionId: SessionID,
  memberId: MemberID
): MemberStatus {
  // TODO: メンバーIDとセッションのステータスを参照して適切なメンバーステータスを返す関数を実装
  return { status: 'invalidUser' };
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

/** In Source Testing */
if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  test('dayjs', () => {
    const today = dayjs('2024-01-03');
    expect(today.diff('2024-01-05', 'day')).toBe(-2);
    expect(today.diff('2024-01-01', 'day')).toBe(2);
  });
}
