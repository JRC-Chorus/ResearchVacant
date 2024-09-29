import { UrlParams } from 'backend/schema/front';

let params: any;

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
export function getUrlParams(): UrlParams {
  // TODO: エラーハンドリングを追加
  return {
    // paramsのDateはUNIX時間でやってくる想定
    startDate: 'startDate_sample',
    endDate: 'startDate_sample',
  };
}
