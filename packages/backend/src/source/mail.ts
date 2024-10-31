import {
  Member,
  MemberID,
  SessionID,
  toEntries,
} from '@research-vacant/common';
import { getAnswerURL } from 'backend/core/access/accessID';
import { getConfig } from './spreadsheet/config';

/**
 * 文中に設置されたマジックコードを置換する
 *
 * answerURLを使う場合は`sessionID`, `memberID`を指定する
 */
function replaceMagicCode(
  message: string,
  sessionId?: SessionID,
  memberId?: MemberID
) {
  const answerURL =
    sessionId && memberId ? getAnswerURL(sessionId, memberId) : undefined;
  const magicCodes = {
    '##_ANSWER_URL_##': answerURL ?? '##_ANSWER_URL_##',
  };

  let returnMessage = message;
  toEntries(magicCodes).forEach((c) => {
    returnMessage = returnMessage.replace(c[0], c[1]);
  });
  return returnMessage;
}

/**
 * メンバーに回答依頼のメールを送信する
 */
export function sendAnnounceMail(sessionId: SessionID, member: Member) {
  const config = getConfig();

  GmailApp.sendEmail(
    member.mailAddress,
    config.announceAnswerMailSubject,
    replaceMagicCode(config.announceAnswerMail, sessionId, member.id)
  );
}

/**
 * メンバーに回答依頼のリマインドメールを送信する
 */
export function sendRemindMail(sessionId: SessionID, member: Member) {
  const config = getConfig();

  GmailApp.sendEmail(
    member.mailAddress,
    config.remindMailSubject,
    replaceMagicCode(config.remindMail, sessionId, member.id)
  );
}

/**
 * 管理者に日程確定の依頼メールを送信する
 */
export function sendApproveMail(sessionId: SessionID, member: Member) {
  const config = getConfig();

  GmailApp.sendEmail(
    member.mailAddress,
    config.requestApproveMailSubject,
    replaceMagicCode(config.requestApproveMail, sessionId, member.id)
  );
}
