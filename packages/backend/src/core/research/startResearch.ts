import { SessionID } from 'backend/schema/db/session';
import { initAnsRecordSheet } from 'backend/source/spreadsheet/answers';
import { getConfig } from 'backend/source/spreadsheet/config';
import { getMembers } from 'backend/source/spreadsheet/members';
import { getAnswerURL } from 'backend/source/urlParam';
import { values } from 'backend/utils/obj/obj';

/**
 * 調査開始
 */
export function startSession(sessionId: SessionID) {
  // 回答記録用シートの作成，ステータスの更新等，必要なデータベースの整備を行う
  initAnsRecordSheet(sessionId);

  // 案内メールの送付
  sendAnnounceMail(sessionId);
}

/**
 * 部員全員に案内メールを送信する
 */
function sendAnnounceMail(sessionId: SessionID) {
  const members = values(getMembers());
  const config = getConfig();

  members.forEach((m) =>
    GmailApp.sendEmail(
      m.mailAddress,
      config.announceAnswerMailSubject,
      `${config.announceAnswerMail}\n\n
      【回答用サイトリンク】\n
      ${getAnswerURL(sessionId, m.id)}`
    )
  );
}
