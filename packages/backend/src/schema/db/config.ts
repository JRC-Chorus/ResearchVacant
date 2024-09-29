import { z } from 'zod';

export const Config = z.object({
  // 通知したいチャンネルの Teams Webhook リンク
  teamsLink: z.string().url(),
  // 最終練習日から最低限開けるべき日数
  leastRestTime: z.number(),
  // １か月あたりに開催を調整する練習回数
  researchCount: z.number(),
  // 承認を担当するロール
  approverRoles: z.string().array(),
  // 必ず出席を求めるロール
  mustAttendRoles: z.string().array(),
  // 外部会場の時には出席を求めるロール
  mustAttendOuterPlace: z.string().array(),

  // 将来的にはメールの内容もconfigから受け取る？
});
