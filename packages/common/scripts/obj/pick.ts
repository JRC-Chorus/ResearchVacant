/**
 * 指定した配列から任意の要素を抽出する
 */
export function pickRandom<T>(targetArr: T[]): T {
  return targetArr[Math.floor(Math.random() * targetArr.length)];
}
