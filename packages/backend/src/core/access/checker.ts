import { MemberID } from 'backend/schema/db/member';
import { getMembers } from 'backend/source/spreadsheet/members';
import { decodeAccessID, getUrlParams } from 'backend/source/urlParam';
import { keys } from 'backend/utils/obj/obj';

/**
 * 有効な接続か確認
 * 
 * 無効な場合はundefinedを返す
 */
export function getRecievedIds() {
  const urlParams = getUrlParams()
  if (urlParams === void 0) {
    return undefined
  }
  
  return decodeAccessID(urlParams.aId)
}

/**
 * 引数のメンバーが登録されたメンバーか確認
 */
export function isMember(memberId: MemberID) {
  const memberIds = keys(getMembers());
  return memberIds.some((id) => id === memberId);
}
