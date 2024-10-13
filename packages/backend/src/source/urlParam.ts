import { AccessID, UrlParams } from 'backend/schema/app';
import { MemberID } from 'backend/schema/db/member';
import { SessionID } from 'backend/schema/db/session';
import { keys, toEntries } from 'backend/utils/obj/obj';
import { getConfig } from './spreadsheet/config';

/**
 * 取得したパラメータをフロントに渡す形に整形して返す
 *
 * 取得したパラメータが不正の場合は`undefined`を返す
 */
export function getUrlParams(
  params: Record<string, string>
): UrlParams | undefined {
  const requiredKeys = keys(UrlParams.keyof().Values);
  const paramKeys = keys(params);

  // パラメータがすべて存在しているか確認
  if (!requiredKeys.every((k) => paramKeys.includes(k))) {
    return undefined;
  }

  // パースチェック
  const parsed = UrlParams.safeParse(params);
  if (!parsed.success) {
    return undefined;
  }

  return parsed.data;
}

const SEP_TEXT = ':';

/**
 * セッションIDとメンバーIDからURLに載せるアクセスIDを生成する
 *
 * ※アクセスIDにすることでURLを短くし，メンバーIDを推定しにくくさせる
 */
export function encodeAccessID(sessionId: SessionID, memberId: MemberID) {
  return Utilities.base64Encode(`${sessionId}${SEP_TEXT}${memberId}`);
}

/**
 * 取得したアクセスIDを元のデータに復元する
 *
 * 復元できない場合はundefinedを返す
 */
export function decodeAccessID(accessId: AccessID) {
  const srcTxt = Utilities.newBlob(
    Utilities.base64Decode(accessId)
  ).getDataAsString();

  if (!srcTxt.includes(SEP_TEXT)) {
    return undefined;
  }

  const splitTxts = srcTxt.split(SEP_TEXT);
  const parsedSessionId = SessionID.safeParse(splitTxts[0]);
  const parsedMemberId = MemberID.safeParse(splitTxts[1]);
  if (parsedSessionId.success && parsedMemberId.success) {
    return {
      sessionId: parsedSessionId.data,
      memberId: parsedMemberId.data,
    };
  }

  return undefined;
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
    const { Utilities } = await import('@research-vacant/mock');
    global.Utilities = new Utilities();

    const aid =
      'ZjBhNjA1ODgtOWU2MS00YjUzLWJlYzAtYjFkYWVkZDlkZDlhOmZmODM1Zjc5LTlhZjItNGIxNy1hZWNmLWM1NTQ1ZDM2NGYxZA==';
    const sessionId = 'f0a60588-9e61-4b53-bec0-b1daedd9dd9a';
    const memberId = 'ff835f79-9af2-4b17-aecf-c5545d364f1d';
    const result = decodeAccessID(aid);

    expect(result?.sessionId).toBe(sessionId);
    expect(result?.memberId).toBe(memberId);
  });
}
