import { AccessID, UrlParams } from 'backend/schema/app';
import { MemberID } from 'backend/schema/db/member';
import { SessionID } from 'backend/schema/db/session';
import { getConfig } from 'backend/source/spreadsheet/config';
import { getMembers } from 'backend/source/spreadsheet/members';
import { getSessions } from 'backend/source/spreadsheet/session';
import { fromEntries, keys, toEntries } from 'backend/utils/obj/obj';

/**
 * セッションIDとメンバーIDからURLに載せるアクセスIDを生成する
 *
 * ※アクセスIDにすることでURLを短くし，Hash化されているため，メンバーIDを推定しにくくさせる
 */
export function encodeAccessID(sessionId: SessionID, memberId: MemberID) {
  const byteAid = Utilities.computeDigest(
    Utilities.DigestAlgorithm.MD5,
    `${sessionId}:${memberId}`
  );
  return Utilities.newBlob(byteAid).getDataAsString();
}

type DecodeResult = { sessionId: SessionID; memberId: MemberID };

/**
 * 取得したアクセスIDを元のデータに復元する
 *
 * 復元できない場合はundefinedを返す
 */
export function decodeAccessID(accessId: AccessID): DecodeResult | undefined {
  const sessionIds = keys(getSessions());
  const memberIds = keys(getMembers());

  // TODO: 全てのメンバー，セッションを列挙しているため，選択肢爆発の危険性あり
  const correctAccessIds: Record<AccessID, DecodeResult> = fromEntries(
    sessionIds
      .map((sId) =>
        memberIds.map((mId) => {
          const aId = encodeAccessID(sId, mId);
          return [
            aId,
            {
              sessionId: sId,
              memberId: mId,
            },
          ];
        })
      )
      .flat(1) as [AccessID, DecodeResult][]
  );

  return correctAccessIds[accessId];
}

/**
 * 回答集約用URLを発行する
 */
export function getAnswerURL(sessionId: SessionID, memberId: MemberID) {
  const config = getConfig();
  const tmpParams: Record<keyof UrlParams, string> = {
    aId: encodeAccessID(sessionId, memberId),
  };

  return `${config.webappUrl}?${toEntries(tmpParams)
    .map(([k, v]) => `${k}=${v}`)
    .join('&')}`;
}

/** In Source Testing */
if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;

  test('decodeAccessID', async () => {
    const { Utilities, SpreadsheetApp } = await import('@research-vacant/mock');
    global.Utilities = new Utilities();
    global.SpreadsheetApp = new SpreadsheetApp();

    // initialize
    const { migrateEnv } = await import('../migrate');
    migrateEnv();

    // sample member
    const { imitateRegistMember } = await import(
      'backend/source/spreadsheet/members'
    );
    imitateRegistMember({
      id: '',
      firstName: 'サンプル',
      lastName: '太郎',
      mailAddress: 'sample@email.com',
      roles: '',
    });

    // get sample member's data
    const { values } = await import('backend/utils/obj/obj');
    const sampleMember = values(getMembers())[0];

    // start sample session
    // launch new session
    const { sessionChecker } = await import('../research/checker');
    const sampleSession = sessionChecker()[0];

    const aid = encodeAccessID(sampleSession.id, sampleMember.id);
    const result = decodeAccessID(aid);

    // check accessID -> sessionID & memberID
    expect(result?.sessionId).toBe(sampleSession.id);
    expect(result?.memberId).toBe(sampleMember.id);

    // Accessed invalid user
    expect(decodeAccessID('INVALID ACCESS ID')).toBe(undefined);
  });
}
