/**
 * フロントエンドとの通信に関連のある型定義をおく
 */
import { z } from 'zod';
import { AnsDate, AnswerSummary, SummaryAnswers } from './db/answer';
import { RvDate } from './db/common';
import { OuterPlace } from './db/records';

export const AccessID = z.string();
export type AccessID = z.infer<typeof AccessID>;
export const UrlParams = z.object({
  /** アクセスID */
  aId: AccessID,
});
export type UrlParams = z.infer<typeof UrlParams>;

export const CheckedOuterPlace = z.object({
  /** 施設名 */
  placeName: z.string(),
  /** 施設情報に関するURL（地図や公式HP等） */
  placeURL: z.string().optional(),
  /** 予約が必要な施設か？（必要な場合，予約を促すダイアログを表示する） */
  isNeedReserve: z.boolean(),
  /** 予約状況 */
  vacantInfo: AnsDate.array(),
});
export type CheckedOuterPlace = z.infer<typeof CheckedOuterPlace>;

export const PartyDate = z.object({
  /** イベントの開催日 */
  date: RvDate,
  /** 開催場所 */
  pos: OuterPlace,
  /** 開催日の回答状況 */
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
// 管理者による開催日の決定中
const MSJudging = z.object({
  status: z.enum(['judging']),
  isManager: z.boolean(),
  summary: AnswerSummary,
  places: CheckedOuterPlace.array(),
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
