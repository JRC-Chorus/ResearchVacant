import { z } from 'zod';

// 日付型
export const RvDate = z.string().date();
export type RvDate = z.infer<typeof RvDate>;

