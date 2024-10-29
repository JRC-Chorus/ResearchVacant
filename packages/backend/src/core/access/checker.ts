import { keys, MemberID, SessionID } from '@research-vacant/common';
import { getMembers } from 'backend/source/spreadsheet/members';
import { getUrlParams } from 'backend/source/urlParam';
import { decodeAccessID } from './accessID';

let cachedIds: { sessionId: SessionID; memberId: MemberID } | undefined;

/**
 * 有効な接続か確認
 *
 * 無効な場合はundefinedを返す
 */
export function parseRecievedIds(params: Record<string, string>) {
  if (!cachedIds) {
    const urlParams = getUrlParams(params);
    if (urlParams === void 0) {
      return undefined;
    }

    cachedIds = decodeAccessID(urlParams.aId);
  }

  return cachedIds;
}

/**
 * 引数のメンバーが登録されたメンバーか確認
 */
export function isMember(memberId: MemberID) {
  const memberIds = keys(getMembers());
  return memberIds.some((id) => id === memberId);
}
