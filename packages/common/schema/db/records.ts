import { z } from 'zod';
import { RvDate } from './common';
import { SessionID } from './session';

// 開催情報
export const PartyInfo = z.object({
  /** 開催日 */
  date: RvDate,
  /** 開催場所 */
  pos: z.string().optional(),
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
