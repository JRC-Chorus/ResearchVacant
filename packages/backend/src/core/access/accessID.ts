import {
  AccessID,
  fromEntries,
  FrontUrlParams,
  keys,
  MemberID,
  SessionID,
  toEntries,
} from '@research-vacant/common';
import { getConfig } from 'backend/source/spreadsheet/config';
import { getMembers } from 'backend/source/spreadsheet/members';
import { getSessions } from 'backend/source/spreadsheet/session';

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

  // convert 16bit string
  let txtHash = '';
  for (let j = 0; j < byteAid.length; j++) {
    let hashVal = byteAid[j];
    if (hashVal < 0) hashVal += 256;
    if (hashVal.toString(16).length == 1) txtHash += '0';
    txtHash += hashVal.toString(16);
  }
  return txtHash;
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
  const BASE_URL = 'https://jrc-chorus.github.io/ResearchVacant/';

  const config = getConfig();
  const tmpParams: Record<keyof FrontUrlParams, string> = {
    deployId: config.deployId,
    aId: encodeAccessID(sessionId, memberId),
  };

  return `${BASE_URL}?${toEntries(tmpParams)
    .map(([k, v]) => `${k}=${v}`)
    .join('&')}`;
}

/** In Source Testing */
if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;

  test('encodeAccessID', async () => {
    const { Utilities } = await import('@research-vacant/mock');
    global.Utilities = new Utilities();

    // encode code
    const byteAid = global.Utilities.computeDigest(
      global.Utilities.DigestAlgorithm.MD5,
      'input to hash'
    );

    // convert 16bit string
    let txtHash = '';
    for (let j = 0; j < byteAid.length; j++) {
      let hashVal = byteAid[j];
      if (hashVal < 0) hashVal += 256;
      if (hashVal.toString(16).length == 1) txtHash += '0';
      txtHash += hashVal.toString(16);
    }

    expect(txtHash).toBe('f0ec9040ced18a668f46905edecf7599');
  });

  test('decodeAccessID', async () => {
    const { Utilities, SpreadsheetApp, LockService } = await import(
      '@research-vacant/mock'
    );
    global.Utilities = new Utilities();
    global.SpreadsheetApp = new SpreadsheetApp();
    global.LockService = new LockService();

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
    const { values } = await import('@research-vacant/common');
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
