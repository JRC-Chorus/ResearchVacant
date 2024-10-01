import { z } from 'zod';
import { RvDate } from './common';
import { MemberID } from './member';
import { SessionID } from './session';

export const AnsDate = z.object({
  // 回答された日付
  date: RvDate,
  // 回答（参加可能か）
  ans: z.enum(['OK', 'Pending', 'NG']),
});
export type AnsDate = z.infer<typeof AnsDate>;

export const Answer = z.object({
  // 回答者のメンバーID
  userId: MemberID,
  // 回答者の氏名（フルネーム）
  userName: z.string(),
  // 回答内容
  ansDates: AnsDate.array(),
});
export type Answer = z.infer<typeof Answer>;

export const AnswerTable = z.object({
  // 回答を収集したセッションのID（シート名に利用）
  id: SessionID,
  // 回答一覧
  ans: Answer.array(),
});
export type AnswerTable = z.infer<typeof AnswerTable>;
