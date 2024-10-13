import { MemberStatus } from 'backend/schema/app';
import { AnsDate, Answer } from 'backend/schema/db/answer';
import { PartyInfo } from 'backend/schema/db/records';
import { SessionID } from 'backend/schema/db/session';
import {
  getAnsweredMemberIDs,
  getAnswerSummary,
  registAnswer,
} from 'backend/source/spreadsheet/answers';
import {
  getPartys,
  registPartyDate,
} from 'backend/source/spreadsheet/decideRecord';
import { getMembers } from 'backend/source/spreadsheet/members';
import { getSessions, updateSession } from 'backend/source/spreadsheet/session';
import { isMember, parseRecievedIds } from './access/checker';

/**
 * フロントエンドからのアクセスがあったときに，当該アクセスに対するレスポンスを定義
 */
export function accessManager(params: Record<string, string>): MemberStatus {
  const ids = parseRecievedIds(params);
  if (ids === void 0 || !isMember(ids.memberId)) {
    return { status: 'invalidUser' };
  }

  const answerIds = getAnsweredMemberIDs(ids.sessionId);
  const summary = getAnswerSummary(ids.sessionId);
  const sessionStatus = getSessions()[ids.sessionId].status;

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
    const targetRecord = getPartys()[ids.sessionId];
    return {
      status: 'finished',
      summary: summary,
      partyDates: targetRecord.infos.map((info) => {
        return {
          date: info.date,
          pos: info.pos,
          ans: summary.ansDates.find((d) => d.date === info.date)?.ans ?? [],
        };
      }),
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
export function submitAnswers(
  params: Record<string, string>,
  ans: AnsDate[],
  freeTxt: string
) {
  // Check and Get some data
  const ids = parseRecievedIds(params);
  const members = getMembers();
  if (ids === void 0) {
    throw new Error('Invalid user is accessed');
  }

  // Regist answer
  const answer: Answer = {
    ansDates: ans,
    userId: ids.memberId,
    userName: `${members[ids.memberId].firstName} ${
      members[ids.memberId].lastName
    }`,
    freeText: freeTxt,
  };
  registAnswer(ids.sessionId, answer);
}

/**
 * 開催日を決定した際にフロントエンドから呼び出す関数
 *
 * 当該セッションのステータスを'judge' -> 'closed'とする
 */
export function decideDates(sessionId: SessionID, infos: PartyInfo[]) {
  // 開催日を登録
  registPartyDate(sessionId, infos);

  // TODO: 決定を通知（Teams？）

  // ステータスを更新
  updateSession(sessionId, 'closed');
}
