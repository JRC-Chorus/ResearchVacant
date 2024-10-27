import { MemberStatus } from './app';
import { AnsDate } from './db/answer';

export interface FrontAPI {
  /** フロントエンドを描画 */
  doGet: (e: any) => GoogleAppsScript.HTML.HtmlOutput;
  /** データベース等の初期化（導入直後に１度だけ実行することを想定） */
  migrateEnv: () => void;
  /** 常時実行で調査を定期的に発火する */
  researchManager: () => void;

  /** フロントエンドからのアクセスに対するレスポンスを定義 */
  accessManager: (params: Record<string, string>) => MemberStatus;
  /** フロントエンドから回答を登録する */
  submitAnswers: (
    params: Record<string, string>,
    ans: AnsDate[],
    freeTxt: string
  ) => void;

  /** SpreadSheetからサンプルデータを取得 */
  getSampleData: () => any[][];
}
