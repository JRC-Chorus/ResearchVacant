import { z } from 'zod';
import { keys } from '../scripts';
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

// TODO: ZodのエラーによりBRAND型を引数に含む関数が定義できないため，暫定的に下記の実装を用いる
// @ref: https://github.com/colinhacks/zod/issues/3935
const FrontAPI = {
  accessManager: (args: Record<string, string>): MemberStatus => {
    return { status: 'invalidUser' };
  },
  submitAnswers: (
    answers: Record<string, string>,
    ansDate: AnsDate[],
    partyId: string,
    userId: string,
    userName: string
  ) => {},
  decideDates: (answers: Record<string, string>, parties: PartyInfo[]) => {},
};
export type FrontAPI = typeof FrontAPI;
// export const FrontAPI = z.object({
//   /** フロントエンドからのアクセスに対するレスポンスを定義 */
//   accessManager: z
//     .function()
//     .args(z.record(z.string(), z.string()))
//     .returns(MemberStatus),
//   /** フロントエンドから回答を登録する */
//   submitAnswers: z
//     .function()
//     .args(
//       z.record(z.string(), z.string()),
//       AnsDate.array(),
//       z.string(),
//       z.string(),
//       z.string()
//     )
//     .returns(z.void()),
//   /** フロントエンドから回答を登録する */
//   decideDates: z
//     .function()
//     .args(z.record(z.string(), z.string()), z.array(PartyInfo))
//     .returns(z.void()),
// });
// export type FrontAPI = z.infer<typeof FrontAPI>;

export const FrontAPIkeys = keys(FrontAPI);
export type FrontAPIkeys = typeof FrontAPIkeys;
// export const FrontAPIkeys = FrontAPI.keyof();
// export type FrontAPIkeys = z.infer<typeof FrontAPIkeys>;

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

// フロントエンドとバックエンドの通信要求の型定義
export const ApiRequest = z.object({
  /** 実行する関数名 */
  func: z.string(),
  /** アクセスID */
  aId: z.string(),
  /** 実行する関数の引数（GAS側で文字列で受信したものをJSONに戻す） */
  args: z.preprocess(
    (a) => (typeof a === 'string' ? (a !== '' ? JSON.parse(a) : []) : a),
    z.any().array()
  ),
});
export type ApiRequest = z.infer<typeof ApiRequest>;
