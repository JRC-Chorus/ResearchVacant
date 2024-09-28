import { err, ok, Result } from 'backend/core/error/base';
import { UrlParams } from 'backend/schema/front';

let params: any;

/** URL引数で受け取ったパラメーターを登録 */
export function registerUrlParam(e: any): Result<void> {
  if ('parameter' in e) {
    params = e.parameter;
    return ok();
  } else {
    return err.error('INVALID_URLPRAM');
  }
}

/**
 * 取得したパラメータをフロントに渡す形に整形して返す
 *
 * 取得したパラメータが不正の場合は`undefined`を返す
 */
export function getUrlParams(): Result<UrlParams> {
  // TODO: エラーハンドリングを追加
  return ok({
    // paramsのDateはUNIX時間でやってくる想定
    startDate: 'startDate_sample',
    endDate: 'startDate_sample',
  });
}
