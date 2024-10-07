import { MemberStatus } from 'backend/schema/app';
import { AnsDate } from 'backend/schema/db/answer';
import { RvDate } from 'backend/schema/db/common';
import { SessionID } from 'backend/schema/db/session';
import {
  getAnsweredMemberIDs,
  getAnswerSummary,
} from 'backend/source/spreadsheet/ansRecord';
import { getSessions, updateSession } from 'backend/source/spreadsheet/session';
import { getRecievedIds, isMember } from './access/checker';

/**
 * フロントエンドからのアクセスがあったときに，当該アクセスに対するレスポンスを定義
 */
export function accessManager(): MemberStatus {
  const ids = getRecievedIds();
  if (ids === void 0 || !isMember(ids.memberId)) {
    return { status: 'invalidUser' };
  }

  const answerIds = getAnsweredMemberIDs(ids.sessionId);
  const summary = getAnswerSummary(ids.sessionId);
  const sessionStatus = getSessions()[ids.sessionId].status;
  // const targetRecord = getRecord()[ids.sessionId]

  if (sessionStatus === 'ready') {
    return {
      status: 'beforeOpening',
    };
  } else if (
    !answerIds.some((id) => id === ids.memberId) &&
    sessionStatus === 'opening'
  ) {
    return {
      status: 'noAns',
      summary: summary,
    };
  } else if (sessionStatus === 'opening') {
    return {
      status: 'alreadyAns',
      summary: summary,
    };
  } else if (sessionStatus === 'judge') {
    return {
      status: 'managerJudge',
      summary: summary,
    };
  } else if (sessionStatus === 'closed') {
    return {
      status: 'finished',
      summary: summary,
      // TODO: 決定日を追記する
      decidedDates: [],
    };
  }

  // 上記以外の状態のアクセスは存在しないが，エラーハンドリングとして無効なユーザーを返す
  return {
    status: 'invalidUser',
  };
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
