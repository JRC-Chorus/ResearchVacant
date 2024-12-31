import { z } from 'zod';
import { MemberStatus } from './app';
import { AnsDate } from './db/answer';
import { PartyInfo } from './db/records';

export interface GlobalAPI {
  /** フロントエンドを描画 */
  // doGet: (e: any) => GoogleAppsScript.HTML.HtmlOutput;
  /** フロントエンドからのAPI通信を捌く */
  doGet: (e: { parameter: Record<string, string> }) => any;
  /** データベース等の初期化（導入直後に１度だけ実行することを想定） */
  migrateEnv: () => void;
  /** 常時実行で調査を定期的に発火する */
  researchManager: () => void;
}

export interface FrontAPI {
  /** フロントエンドからのアクセスに対するレスポンスを定義 */
  accessManager: (params: Record<string, string>) => MemberStatus;
  /** フロントエンドから回答を登録する */
  submitAnswers: (
    params: Record<string, string>,
    ans: AnsDate[],
    freeTxt: string,
    partyCount: string,
    bikou: string
  ) => void;
  /** フロントエンドで決定した開催日を登録する */
  decideDates: (params: Record<string, string>, infos: PartyInfo[]) => void;
}

// フロントエンドとバックエンドの通信結果の型定義
const ApiResponseSuccess = z.object({
  status: z.literal('success'),
  val: z.any(),
});
type ApiResponseSuccess = z.infer<typeof ApiResponseSuccess>;
const ApiResponseFail = z.object({
  status: z.literal('fail'),
  errTitle: z.string(),
  errDescription: z.string().optional(),
});
type ApiResponseFail = z.infer<typeof ApiResponseFail>;
export const ApiResponse = z.union([ApiResponseSuccess, ApiResponseFail]);
export type ApiResponse = z.infer<typeof ApiResponse>;
