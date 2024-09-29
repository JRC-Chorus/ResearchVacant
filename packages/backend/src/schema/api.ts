import { UrlParams } from './app';

export interface FrontAPI {
  /** フロントエンドを描画 */
  doGet: (e: any) => GoogleAppsScript.HTML.HtmlOutput;
  /** フロントエンドに取得したURLパラメータを渡す */
  getParams: () => UrlParams;
  /** SpreadSheetからサンプルデータを取得 */
  getSampleData: () => any[][];
}
