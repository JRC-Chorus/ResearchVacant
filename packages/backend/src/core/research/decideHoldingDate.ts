/**
 * 調査結果を踏まえて開催日を決定する
 */
import { SessionID, values } from '@research-vacant/common';
import { sendApproveMail } from 'backend/source/mail';
import { getMembers } from 'backend/source/spreadsheet/members';

/**
 * 調査結果をもとにした候補日の承認を管理者に問い合わせる
 */
export function sendJudgeCandidate(sessionId: SessionID) {
  const fullMembers = values(getMembers());
  const managerMembers = fullMembers.filter((member) => member.roles?.manager);

  // 管理者が登録されていない場合は一番上のメンバーを管理者と仮定する
  if (managerMembers.length === 0) {
    managerMembers.push(fullMembers[0]);
  }

  managerMembers.forEach((m) => {
    sendApproveMail(sessionId, m);
  });
}

/**
 * 決定日をTeamsに通知する
 */
export function notify4Teams() {
  // teams.send()
}

// TODO: 候補日の絞り方に関するテストを記述する
