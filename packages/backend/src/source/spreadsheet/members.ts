import { Member, MemberID, Role } from 'backend/schema/db/member';
import { fromEntries, keys, toEntries, values } from 'backend/utils/obj/obj';
import { getSheet } from './common';
import { getConfig } from './config';

const MEMBERS_SHEET_NAME = 'メンバー一覧';
let cachedMembers: Record<MemberID, Member> | undefined;

// db source（!!! rolesはデータベースの一番末列に入れる !!!）
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
  return MemberID.parse(Utilities.getUuid());
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

function roleParser(roleName: string[]): Role | undefined {
  const config = getConfig();
  const returnRole: Role = {
    manager: false,
    mustAttend: false,
    mustAttendByOuter: false,
  };

  roleName.forEach((rName) => {
    if (config.approverRoles.some((r) => r === rName)) {
      returnRole.manager = true;
    } else if (config.mustAttendRoles.some((r) => r === rName)) {
      returnRole.mustAttend = true;
    } else if (config.mustAttendOuterPlaceRoles.some((r) => r === rName)) {
      returnRole.mustAttendByOuter = true;
    }
  });

  return values(returnRole).some((isAssign) => isAssign)
    ? returnRole
    : undefined;
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
        .getRange(2, 1, lastRow - 1, sheet.getLastColumn())
        .getValues();
      // MemberID一覧が何列目にあるか
      const memberidIdx = keys(header).findIndex((k) => k === 'id');
      // メンバー一覧に整形
      const members = srcData.map((line, rowIdx) =>
        Member.parse(
          fromEntries(
            toEntries(header).map(([k, v], idx) => {
              // MmeberIDのみ特殊処理
              if (idx === memberidIdx) {
                const memberId = line[idx] === '' ? genMemberID() : line[idx];
                // MemberIDがないときはDBに書き込む
                if (line[idx] === '') {
                  sheet
                    .getRange(rowIdx + 2, memberidIdx + 1)
                    .setValue(memberId);
                }
                return [k, memberId];
              }
              // roles（データベースの一番最後）も特殊処理
              else if (idx === keys(header).length - 1) {
                return [k, roleParser(line.slice(idx))];
              }
              // その他はそのまま返す
              else {
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

/**
 * メンバーを登録（テスト用）
 */
export function imitateRegistMember(data: Record<keyof Member, string>) {
  const writeData = [keys(header).map((k) => data[k])];

  const sheet = getSheet(MEMBERS_SHEET_NAME);
  sheet.getRange(2, 1, 1, writeData[0].length).setValues(writeData);
}
