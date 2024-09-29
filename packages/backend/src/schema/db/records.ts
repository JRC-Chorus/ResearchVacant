import { z } from 'zod';
import { RvDate } from './common';

export const ResultRecords = z.object({
  // 開催日
  date: RvDate.array(),
  // 開催場所
  pos: z.string().optional(),
  // 参加者
  members: z.string().array(),
});
export type ResultRecords = z.infer<typeof ResultRecords>;
