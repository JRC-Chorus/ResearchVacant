import { z } from 'zod';
import { RvDate } from './common';
import { SessionID } from './session';
import { AnsDate, SummaryAnswers } from './answer';

export const PlaceID = z.string().brand('PlaceID');
export type PlaceID = z.infer<typeof PlaceID>;

// 外部施設情報
export const OuterPlace = z.object({
  /** 施設名 */
  placeName: z.string(),
  /** 施設情報に関するURL（地図や公式HP等） */
  placeURL: z.string().optional(),
  /** 予約が必要な施設か？（必要な場合，予約を促すダイアログを表示する） */
  isNeedReserve: z.boolean(),
});
export type OuterPlace = z.infer<typeof OuterPlace>;

// 外部施設情報（空き情報確認済み・フロントエンドへの情報提供用）
export const CheckedOuterPlace = z.object({
  /** 施設ID */
  placeId: PlaceID,
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

// 開催情報（フロントエンド <--> バックエンド 通信用）
export const PartyInfo = z.object({
  /** 開催日 */
  date: RvDate,
  /** 開催場所 */
  placeId: PlaceID,
});
export type PartyInfo = z.infer<typeof PartyInfo>;

// 開催情報（フロントエンド情報提供用）
export const PartyDate = z.object({
  /** イベントの開催日 */
  date: RvDate,
  /** 開催場所 */
  pos: OuterPlace,
  /** 開催日の回答状況 */
  ans: SummaryAnswers,
});
export type PartyDate = z.infer<typeof PartyDate>;

// 決定日の記録
export const DecidedRecord = z.object({
  /** 調査が実施されたセッション */
  sessionId: SessionID,
  /** 開催情報 */
  infos: PartyInfo.array(),
});
export type DecidedRecord = z.infer<typeof DecidedRecord>;
