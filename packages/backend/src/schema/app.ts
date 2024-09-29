/**
 * フロントエンドとの通信に関連のある型定義をおく
 */
import { z } from 'zod';
import { RvDate } from './db/common';

export const UrlParams = z.object({
  /** 予定調査の範囲（開始） */
  startDate: RvDate,
  /** 予定調査の範囲（終了） */
  endDate: RvDate,
});
export type UrlParams = z.infer<typeof UrlParams>;
