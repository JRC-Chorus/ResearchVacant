import { SessionID, values } from '@research-vacant/common';
import { sendRemindMail } from 'backend/source/mail';
import { getAnsweredMemberIDs } from 'backend/source/spreadsheet/answers';
import { getMembers } from 'backend/source/spreadsheet/members';

/**
 * セッションを確認し，対象者にリマインドメールを送信する
 */
export function sendRemind(sessionId: SessionID) {
  const members = values(getMembers());
  const answeredMembers = getAnsweredMemberIDs(sessionId);

  // 未回答のメンバーのみにリマンインドを送信
  members
    .filter((m) => !answeredMembers.some((ansMem) => ansMem === m.id))
    .forEach((m) => sendRemindMail(sessionId, m));
}
