import { z } from 'zod';
import { RvDate } from './common';
import { SessionID } from './session';

// 外部施設情報
export const OuterPlace = z.object({
  /** 施設名 */
  placeName: z.string(),
  /** 施設情報に関するURL（地図や公式HP等） */
  placeURL: z.string().optional(),
});
export type OuterPlace = z.infer<typeof OuterPlace>;

// 開催情報
export const PartyInfo = z.object({
  /** 開催日 */
  date: RvDate,
  /** 開催場所 */
  pos: OuterPlace,
});
export type PartyInfo = z.infer<typeof PartyInfo>;

// 決定日の記録
export const DecidedRecord = z.object({
  /** 調査が実施されたセッション */
  sessionId: SessionID,
  /** 開催情報 */
  infos: PartyInfo.array(),
});
export type DecidedRecord = z.infer<typeof DecidedRecord>;
