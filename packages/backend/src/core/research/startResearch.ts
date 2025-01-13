import { Member, SessionID, values } from '@research-vacant/common';
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
  sendAnnounce4AllMembers(sessionId);
}

/**
 * 部員全員に案内メールを送信する
 */
function sendAnnounce4AllMembers(sessionId: SessionID) {
  const members = values(getMembers());
  sendAnnounce(sessionId, members);
}

/**
 * 指定したメンバーにのみ案内メールを送信する
 */
export function sendAnnounce(sessionId: SessionID, members: Member[]) {
  members.forEach((m) => sendAnnounceMail(sessionId, m));
}
