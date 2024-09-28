import { Result } from 'backend/core/error/base';
import { UrlParams } from './front';
import { constructHomePage } from 'src/core/page';
import { getUrlParams } from './../source/urlParam';

export interface FrontAPI {
  /** フロントエンドを描画 */
  doGet: (e: any) => GoogleAppsScript.HTML.HtmlOutput;
  /** フロントエンドに取得したURLパラメータを渡す */
  getParams: () => Result<UrlParams>;
}

export const declareAPI: FrontAPI = {
  doGet: constructHomePage,
  getParams: getUrlParams,
};
