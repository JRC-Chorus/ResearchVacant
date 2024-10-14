/**
 * フロントエンドとの通信に関連のある型定義をおく
 */
import { z } from 'zod';
import { AnswerSummary, SummaryAnswers } from './db/answer';
import { RvDate } from './db/common';

export const AccessID = z.string();
export type AccessID = z.infer<typeof AccessID>;
export const UrlParams = z.object({
  /** アクセスID */
  aId: AccessID,
});
export type UrlParams = z.infer<typeof UrlParams>;

export const PartyDate = z.object({
  date: RvDate,
  pos: z.string().optional(),
  ans: SummaryAnswers,
});
export type PartyDate = z.infer<typeof PartyDate>;

// アクセスしたメンバーのステータスを返す
// 当該セッションは終了済み
const MSFinished = z.object({
  status: z.enum(['finished']),
  summary: AnswerSummary,
  partyDates: PartyDate.array(),
});
type MSFinished = z.infer<typeof MSFinished>;
// 当該セッションに回答済み（回答の変更が可能な期間）
const MSAlreadyAns = z.object({
  status: z.enum(['alreadyAns']),
  summary: AnswerSummary,
});
type MSAlreadyAns = z.infer<typeof MSAlreadyAns>;
// 当該セッションに未回答
const MSNoAns = z.object({
  status: z.enum(['noAns']),
  summary: AnswerSummary,
});
type MSNoAns = z.infer<typeof MSNoAns>;
// 管理者による開催日の決定
const MSManagerJudge = z.object({
  status: z.enum(['managerJudge']),
  summary: AnswerSummary,
});
type MSManagerJudge = z.infer<typeof MSManagerJudge>;
// 無効なURLでアクセス（セッションIDやメンバーIDが無効なときに使用）
const MSInvalidUser = z.object({
  status: z.enum(['invalidUser']),
});
// 何らかの原因でセッション開始前にアクセス（本来はセッション発行後に案内を送付するため起こりえない）
type MSInvalidUser = z.infer<typeof MSInvalidUser>;
const MSBeforeOpening = z.object({
  status: z.enum(['beforeOpening']),
});
type MSBeforeOpening = z.infer<typeof MSBeforeOpening>;
export type MemberStatus =
  | MSNoAns
  | MSAlreadyAns
  | MSFinished
  | MSManagerJudge
  | MSInvalidUser
  | MSBeforeOpening;
