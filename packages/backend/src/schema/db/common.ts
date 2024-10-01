import { z } from 'zod';
import { SessionID } from './session';

// 日付型
export const RvDate = z.string().date().brand('RvDate');
export type RvDate = z.infer<typeof RvDate>;

// 開催が決定した日付型
export const RvDecidedDate = z.object({
  // 調査したセッション（この情報から最終的な参加者一覧などの関連情報を取得する）
  session: SessionID,
  // 開催日
  date: RvDate,
  // 開催場所
  place: z.string().optional(),
});
export type RvDecidedDate = z.infer<typeof RvDecidedDate>;
