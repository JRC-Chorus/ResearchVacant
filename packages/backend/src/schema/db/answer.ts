import { z } from 'zod';
import { RvDate } from './common';
import { MemberID } from './member';

export const AnsStatus = ['OK', 'Pending', 'NG'] as const;
export type AnsStatus = (typeof AnsStatus)[number]

export const AnsDate = z.object({
  /** 回答された日付 */
  date: RvDate,
  /** 回答（参加可能か） */
  ans: z.enum(AnsStatus),
});
export type AnsDate = z.infer<typeof AnsDate>;

export const Answer = z.object({
  /** 回答者のメンバーID */
  userId: MemberID,
  /** 回答者の氏名（フルネーム） */
  userName: z.string(),
  /** 回答内容 */
  ansDates: AnsDate.array(),
  /** 自由記述 */
  freeText: z.string().optional(),
});
export type Answer = z.infer<typeof Answer>;

export const AnsSummaryDate = z.object({
  /** サマリがあらわす日付 */
  date: RvDate,
  /** 当該日における各種別の回答 */
  ans: z
    .object({
      /** 回答の種別 */
      status: z.enum(AnsStatus),
      /** 回答人数 */
      ansPersonCount: z.number(),
      /** 回答者氏名一覧 */
      // ansPersonNames: z.string().array(),
    })
    .array()
    .length(AnsStatus.length),
});
export type AnsSummaryDate = z.infer<typeof AnsSummaryDate>;

export const AnswerSummary = z.object({
  /** 当該セッションにおける回答一覧 */
  ansDates: AnsSummaryDate.array(),
  /** 自由記述一覧 */
  freeTxts: z
    .object({
      /** 自由記述の内容 */
      txt: z.string(),
      /** 記載した人の氏名 */
      ansName: z.string(),
    })
    .array(),
});
export type AnswerSummary = z.infer<typeof AnswerSummary>;
