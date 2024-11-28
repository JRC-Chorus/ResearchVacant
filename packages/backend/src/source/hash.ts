/**
 * 指定した文字列をHash化する
 *
 * Recordのような構造データの場合は「JSON.stringify()」してからHash化する
 */
export function encodeHash(
  algorithm: GoogleAppsScript.Utilities.DigestAlgorithm,
  target: any
): string {
  const byteAid = Utilities.computeDigest(algorithm, JSON.stringify(target));

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
