/**
 * フロントエンドとの通信に関連のある型定義をおく
 */
import { z } from 'zod';
import { Answer } from './db/answer';
import { RvDate } from './db/common';

export const UrlParams = z.object({
  /** 予定調査の範囲（開始） */
  startDate: RvDate,
  /** 予定調査の範囲（終了） */
  endDate: RvDate,
});
export type UrlParams = z.infer<typeof UrlParams>;

// アクセスしたメンバーのステータスを返す
// 当該セッションは終了済み
const MSFinished = z.object({
  status: z.enum(['finished']),
});
type MSFinished = z.infer<typeof MSFinished>;
// 当該セッションに回答済み（回答の変更が可能な期間）
const MSAlreadyAns = z.object({
  status: z.enum(['alreadyAns']),
  ansData: Answer.array(),
});
type MSAlreadyAns = z.infer<typeof MSAlreadyAns>;
// 当該セッションに未回答
const MSNoAns = z.object({
  status: z.enum(['noAns']),
});
type MSNoAns = z.infer<typeof MSNoAns>;
export type MemberStatus = MSNoAns | MSAlreadyAns | MSFinished;