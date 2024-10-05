import { Member, MemberID } from 'backend/schema/db/member';
import { values } from 'backend/utils/obj/obj';
import { getSheet } from './common';

const MEMBERS_SHEET_NAME = 'メンバー一覧';
let cachedMembers: Member[] | undefined;

// db source
const header: Record<keyof Member, string> = {
  id: 'メンバーID（空欄でOK）',
  firstName: '氏名（姓）',
  lastName: '氏名（名）',
  mailAddress: 'メールアドレス',
  roles: '役割（複数OK）',
};
/**
 * メンバーIDを発行
 */
function genMemberID() {
  return MemberID.parse(crypto.randomUUID());
}

/**
 * メンバー一覧シートの初期化に用いる
 */
export function initMemberSheet(clearAllData: boolean = false) {
  const sheet = getSheet(MEMBERS_SHEET_NAME, true);

  // 既存のデータをすべて削除
  if (clearAllData) {
    sheet.clear();
  }

  // write header text
  const headerVals = values(header);
  sheet.getRange(1, 1, 1, headerVals.length).setValues([headerVals]);
}
