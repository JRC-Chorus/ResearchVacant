/**
 * 調査全体に関する処理を記述する
 */
import dayjs from 'dayjs';
import { updateSession } from 'backend/source/spreadsheet/session';
import { sessionChecker } from './research/checker';
import { sendJudgeCandidate } from './research/decideHoldingDate';
import { sendRemind } from './research/remindResearch';
import { startSession } from './research/startResearch';

/**
 * この関数を毎日実行し，ステータスに応じた処理を実行する
 */
export function researchManager() {
  // セッション一覧・設定シートを確認し，開催中の調査（リマインドの送付，終了案内の送付等）や開始すべき調査について確認する
  const sessions = sessionChecker();

  sessions.forEach((session) => {
    // 新規でセッションを開始（'ready' -> 'opening'）
    // if(今日の日付＞セッションの開始日＆ステータス＝'ready')
    if (
      dayjs().diff(session.startDate, 'day') >= 0 &&
      session.status === 'ready'
    ) {
      startSession(session.id);
      updateSession(session.id, 'opening');
    }
    // リマインドの送付（'opening' -> 'opening'）
    // if(今日の日付＞リマインド予定日＆ステータス＝'opening')
    else if (
      session.remindDate &&
      dayjs().diff(session.remindDate, 'day') === 0 &&
      session.status === 'opening'
    ) {
      sendRemind(session.id);
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

/** In Source Testing */
if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  test('dayjs', () => {
    const today = dayjs('2024-01-03');
    expect(today.diff('2024-01-05', 'day')).toBe(-2);
    expect(today.diff('2024-01-01', 'day')).toBe(2);
  });
}
