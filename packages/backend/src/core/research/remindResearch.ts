import { SessionID, values } from '@research-vacant/common';
import { getAnsweredMemberIDs } from 'backend/source/spreadsheet/answers';
import { getConfig } from 'backend/source/spreadsheet/config';
import { getMembers } from 'backend/source/spreadsheet/members';
import { getAnswerURL } from '../access/accessID';

/**
 * セッションを確認し，対象者にリマインドメールを送信する
 */
export function sendRemindMail(sessionId: SessionID) {
  const members = values(getMembers());
  const answeredMembers = getAnsweredMemberIDs(sessionId);
  const config = getConfig();

  // 未回答のメンバーのみにリマンインドを送信
  members
    .filter((m) => !answeredMembers.some((ansMem) => ansMem === m.id))
    .forEach((m) =>
      GmailApp.sendEmail(
        m.mailAddress,
        config.remindMailSubject,
        `${config.remindMail}\n\n
      【回答用サイトリンク】\n
      ${getAnswerURL(sessionId, m.id)}`
      )
    );
}
