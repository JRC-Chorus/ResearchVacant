import { AccessID, UrlParams } from 'backend/schema/app';
import { MemberID } from 'backend/schema/db/member';
import { SessionID } from 'backend/schema/db/session';
import { keys, toEntries } from 'backend/utils/obj/obj';
import { getConfig } from './spreadsheet/config';

let params: Record<keyof UrlParams, string>;

/** URL引数で受け取ったパラメーターを登録 */
export function registerUrlParam(e: any) {
  if ('parameter' in e) {
    params = e.parameter;
  } else {
    throw new Error('INVALID_URLPRAM');
  }
}

/**
 * 取得したパラメータをフロントに渡す形に整形して返す
 *
 * 取得したパラメータが不正の場合は`undefined`を返す
 */
export function getUrlParams(): UrlParams | undefined {
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
  const encodeTxt = Utilities.newBlob(`${sessionId}${SEP_TEXT}${memberId}`);
  return Utilities.base64Encode(encodeTxt.getBytes());
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
    return undefined
  }

  const splitTxts = srcTxt.split(SEP_TEXT);
  const parsedSessionId = SessionID.safeParse(splitTxts[0])
  const parsedMemberId = MemberID.safeParse(splitTxts[1])
  if (parsedSessionId.success && parsedMemberId.success) {
    return {
      sessionId: parsedSessionId.data,
      memberId: parsedMemberId.data,
    };
  }

  return undefined
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
