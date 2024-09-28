import { Result } from '../core/error/base';
import { UrlParams } from './front';

export interface FrontAPI {
  /** フロントエンドを描画 */
  doGet: (e: any) => GoogleAppsScript.HTML.HtmlOutput;
  /** フロントエンドに取得したURLパラメータを渡す */
  getParams: () => Result<UrlParams>;
  /** SpreadSheetからサンプルデータを取得 */
  getSampleData: () => Result<any[][]>;
}
