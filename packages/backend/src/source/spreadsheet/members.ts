import {
  fromEntries,
  keys,
  Member,
  MemberID,
  Role,
  toEntries,
  values,
} from '@research-vacant/common';
import { getSheet, warpLock } from './common';
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
  warpLock(() => __initMemberSheet(clearAllData));
}

function __initMemberSheet(clearAllData: boolean = false) {
  const sheet = getSheet(MEMBERS_SHEET_NAME, true);

  // 既存のデータをすべて削除
  if (clearAllData) {
    sheet.clear();
  }

  // write header text
  const headerVals = values(header);
  sheet.getRange(1, 1, 1, headerVals.length).setValues([headerVals]);
}

function roleParser(roleName: string[]): Role {
  const config = getConfig();
  const returnRole: Role = {
    manager: false,
    mustAttend: false,
  };

  roleName.forEach((rName) => {
    // no role
    if (rName === '') return;

    // what role
    if (config.approverRoles.some((r) => r === rName)) {
      returnRole.manager = true;
    } else if (config.mustAttendRoles.some((r) => r === rName)) {
      returnRole.mustAttend = true;
    }
  });

  return returnRole;
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

    // manager check（一人も管理者がいない場合は一番上を管理者に設定）
    if (
      !values(cachedMembers).some((m) => m.roles?.manager) &&
      keys(cachedMembers).length > 0
    ) {
      cachedMembers[keys(cachedMembers)[0]].roles = {
        manager: true,
        mustAttend: !!cachedMembers[keys(cachedMembers)[0]].roles?.mustAttend,
      };
    }
  }

  return cachedMembers;
}

/**
 * メンバーを登録（テスト用）
 */
export function imitateRegistMember(
  data: Record<keyof Member, string | string[]>
) {
  const writeData = values(data).flat();

  const sheet = getSheet(MEMBERS_SHEET_NAME);
  sheet.appendRow(writeData);
}

/** In Source Testing */
if (import.meta.vitest) {
  const { describe, test, expect } = import.meta.vitest;
  describe('memberTest', async () => {
    // mocks
    const { SpreadsheetApp, Utilities, LockService } = await import(
      '@research-vacant/mock'
    );
    global.SpreadsheetApp = new SpreadsheetApp();
    global.Utilities = new Utilities();
    global.LockService = new LockService();

    // initialize
    const { migrateEnv } = await import('backend/core/migrate');
    migrateEnv();
    initMemberSheet();

    // sample member
    const { imitateRegistMember } = await import(
      'backend/source/spreadsheet/members'
    );
    const notManagerId1 = MemberID.parse(
      'fb975a98-798d-41bd-89e6-f6657c2174b0'
    );
    imitateRegistMember({
      id: notManagerId1,
      firstName: 'サンプル',
      lastName: '太郎',
      mailAddress: 'sample@email.com',
      roles: '必須出席者',
    });

    const notManagerId2 = MemberID.parse(
      '6aab12b2-94f5-4c0f-8b2a-578f5b279394'
    );
    imitateRegistMember({
      id: notManagerId2,
      firstName: 'サンプル',
      lastName: '太郎2',
      mailAddress: 'sample@email.com',
      roles: '',
    });

    test('roles (no manager)', () => {
      // get members
      const members = getMembers(true);

      // general member
      expect(members[notManagerId1].roles?.manager).toBe(true);
      expect(members[notManagerId1].roles?.mustAttend).toBe(true);

      // manager member
      expect(members[notManagerId2].roles?.manager).toBe(false);
      expect(members[notManagerId2].roles?.mustAttend).toBe(false);
    });

    test('roles (exists manager)', () => {
      // regist manager
      const roleMemberId = MemberID.parse(
        'fceb245c-dff3-42a1-b661-a3d216f69889'
      );
      imitateRegistMember({
        id: roleMemberId,
        firstName: '管理者',
        lastName: '次郎',
        mailAddress: 'sample2@email.com',
        roles: ['管理者', '必須出席者', '無効なロール'],
      });

      // get members
      const members = getMembers(true);

      // general member
      expect(members[notManagerId1].roles?.manager).toBe(false);
      expect(members[notManagerId1].roles?.mustAttend).toBe(true);

      // manager member
      expect(members[roleMemberId].roles?.manager).toBe(true);
      expect(members[roleMemberId].roles?.mustAttend).toBe(true);
    });
  });
}
