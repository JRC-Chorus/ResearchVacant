/**
 * フロントエンドとの通信に関連のある型定義をおく
 */
import { z } from 'zod';
import { AnswerSummary } from './db/answer';
import { RvDate } from './db/common';
import { CheckedOuterPlace, PartyDate } from './db/records';

export const AccessID = z.string();
export type AccessID = z.infer<typeof AccessID>;
export const UrlParams = z.object({
  /** アクセスID */
  aId: AccessID,
});
export type UrlParams = z.infer<typeof UrlParams>;

export const FrontUrlParams = z.object({
  /** アクセスID */
  aId: AccessID,
  /** デプロイID */
  deployId: z.string(),
});
export type FrontUrlParams = z.infer<typeof FrontUrlParams>;

export const ResearchDetails = z.object({
  researchStartDate: RvDate,
  researchEndDate: RvDate,
  partyCount: z.string(),
  bikou: z.string(),
});
export type ResearchDetails = z.infer<typeof ResearchDetails>;

// アクセスしたメンバーのステータスを返す
// 当該セッションは終了済み
const MSFinished = z.object({
  status: z.enum(['finished']),
  summary: AnswerSummary,
  partyDates: PartyDate.array(),
  details: ResearchDetails,
  isManager: z.boolean(),
});
type MSFinished = z.infer<typeof MSFinished>;
// 当該セッションに回答済み（回答の変更が可能な期間）
const MSAlreadyAns = z.object({
  status: z.enum(['alreadyAns']),
  summary: AnswerSummary,
  isManager: z.boolean(),
  details: ResearchDetails,
});
type MSAlreadyAns = z.infer<typeof MSAlreadyAns>;
// 当該セッションに未回答
const MSNoAns = z.object({
  status: z.enum(['noAns']),
  summary: AnswerSummary,
  isManager: z.boolean(),
  details: ResearchDetails,
});
type MSNoAns = z.infer<typeof MSNoAns>;
// 管理者による開催日の決定中
const MSJudging = z.object({
  status: z.enum(['judging']),
  isManager: z.boolean(),
  summary: AnswerSummary,
  places: CheckedOuterPlace.array(),
  details: ResearchDetails,
});
type MSJudging = z.infer<typeof MSJudging>;
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
  | MSJudging
  | MSInvalidUser
  | MSBeforeOpening;
