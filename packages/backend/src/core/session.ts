/**
 * セッションIDを発行
 */
export function genUUID() {
  return crypto.randomUUID()
}

/**
 * URLパラメータに含まれるセッションIDが有効な値かを確認
 */
export function isValidSession() {
  
}