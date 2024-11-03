import { SessionID, values } from '@research-vacant/common';
import { sendAnnounceMail } from 'backend/source/mail';
import { initAnsRecordSheet } from 'backend/source/spreadsheet/answers';
import { getMembers } from 'backend/source/spreadsheet/members';

/**
 * 調査開始
 */
export function startSession(sessionId: SessionID) {
  // 回答記録用シートの作成，ステータスの更新等，必要なデータベースの整備を行う
  initAnsRecordSheet(sessionId);

  // 案内メールの送付
  sendAnnounce(sessionId);
}

/**
 * 部員全員に案内メールを送信する
 */
function sendAnnounce(sessionId: SessionID) {
  const members = values(getMembers());
  members.forEach((m) => sendAnnounceMail(sessionId, m));
}
