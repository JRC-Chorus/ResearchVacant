import { Member, MemberID } from 'backend/schema/db/member';
import { fromEntries, keys, toEntries, values } from 'backend/utils/obj/obj';
import { getSheet } from './common';

const MEMBERS_SHEET_NAME = 'メンバー一覧';
let cachedMembers: Record<MemberID, Member> | undefined;

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

/**
 * メンバー一覧を取得
 */
export function getMembers(loadForce: boolean = false) {
  if (!cachedMembers || loadForce) {
    const sheet = getSheet(MEMBERS_SHEET_NAME);

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      cachedMembers = {};
    } else {
      // 元データを取得
      const srcData = sheet
        .getRange(2, 1, lastRow, keys(header).length)
        .getValues();
      // MemberID一覧が何列目にあるか
      const memberidIdx = keys(header).findIndex((k) => k === 'id');
      // メンバー一覧に整形
      const members = srcData.map((line) =>
        Member.parse(
          fromEntries(
            toEntries(header).map(([k, v], idx) => {
              // MmeberIDのみ特殊処理
              if (idx === memberidIdx) {
                const memberId = line[idx] ?? genMemberID();
                return [k, memberId];
              } else {
                return [k, line[idx]];
              }
            })
          )
        )
      );
      cachedMembers = fromEntries(members.map((s) => [s.id, s]));
    }
  }

  return cachedMembers;
}
