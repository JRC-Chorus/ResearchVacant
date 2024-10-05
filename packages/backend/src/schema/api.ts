import { UrlParams } from './app';

export interface FrontAPI {
  /** フロントエンドを描画 */
  doGet: (e: any) => GoogleAppsScript.HTML.HtmlOutput;
  /** フロントエンドに取得したURLパラメータを渡す */
  getParams: () => UrlParams;
  /** 常時実行で調査を定期的に発火する */
  researchManager: () => void;
  /** SpreadSheetからサンプルデータを取得 */
  getSampleData: () => any[][];
}
