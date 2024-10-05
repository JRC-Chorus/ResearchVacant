import { z } from 'zod';

export const researchFrequencyEnum = ['week', 'month'] as const
export const Config = z.object({
  /** 通知したいチャンネルの Teams Webhook リンク */
  teamsLink: z.string().url().optional().default(''),

  /** 問い合わせ調査の頻度（数値指定の場合は「N日おき」として解釈）*/
  researchFrequency: z
    .enum(researchFrequencyEnum)
    .optional()
    .default('month'),

  /** 問い合わせ期間における開催回数*/
  researchPartyCount: z.number().min(1).optional().default(1),

  /** 開催回数のうち，外部施設の利用回数*/
  outerPlacePartyCount: z.number().min(0).optional().default(0),

  /**
   * 調査対象の期間は現在から何サイクル後とするか（「１」で次サイクルを対象とする）
   * 
   * ex) freq: 'weekly', now: 1/5 (Wed.) -> targetRange: 1/10(Mon.) ~ 1/16(Sun.)
   */
  researchTargetCycle: z.number().min(1).optional().default(1),

  /** 再回答を禁止するか */
  prohibitReans: z.boolean().optional().default(false),

  /** 回答期間 */
  answerRange: z.number().min(1).optional().default(3),

  /** 最終開催日から最低限開けるべき日数 */
  leastRestTime: z.number().optional().default(0),

  /** 開催日の承認を担当するロール */
  approverRoles: z.string().array().optional().default([]),

  /** 必ず出席を求めるロール */
  mustAttendRoles: z.string().array().optional().default([]),

  /** 外部会場の時には出席を求めるロール */
  mustAttendOuterPlace: z.string().array().optional().default([]),

  // 将来的にはメールの内容もconfigから受け取る？
});
export type Config = z.infer<typeof Config>;
