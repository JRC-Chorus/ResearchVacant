import { z } from 'zod';
import { RvDate } from './common';

export const SessionID = z.string().uuid().brand('SessionID');
export type SessionID = z.infer<typeof SessionID>;

export const SessionStatus = z.enum([
  'ready', // 準備中（調査は始まっていない）
  'opening', // 調査中（既にメールを送信して，調査が進行中）
  'judge', // 判断中（調査期日を過ぎたため，管理者に最終的な確定日の確認を行っている）
  'closed', // 調査完了（当該調査における，開催日が確定し，調査が完全に終了したことを示す）
  'rejected', // 棄却（調査が途中で打ち切りになり，開催日が決定しなかった）
]);
export type SessionStatus = z.infer<typeof SessionStatus>;

export const Session = z.object({
  // SessionID: 各調査にUUIDを割り振って一意に管理する
  id: SessionID,
  // 調査開始日
  startDate: RvDate,
  // 調査終了日
  endDate: RvDate,
  // 調査の進捗
  status: SessionStatus,
  // 調査対象とする期間の１日目
  researchRangeStart: RvDate,
  // 調査対象とする期間の最終日
  researchRangeEnd: RvDate,
});
export type Session = z.infer<typeof Session>;
