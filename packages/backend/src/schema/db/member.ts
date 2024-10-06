import { z } from 'zod';

export const Role = z.object({
  // 管理者（システムが調査し，提案した開催日の承認を行う）
  manager: z.boolean(),
  // 出席必須か
  mustAttend: z.boolean(),
  // 外部施設で開催する場合
  mustAttendByOuter: z.boolean(),
});
export type Role = z.infer<typeof Role>;

export const MemberID = z.string().uuid().brand('MemberID');
export type MemberID = z.infer<typeof MemberID>;

export const Member = z.object({
  // ユーザーを一意に特定するID
  id: MemberID,
  // メンバーの氏名の「姓」
  firstName: z.string(),
  // メンバーの氏名の「名」
  lastName: z.string(),
  // 登録済みのEmailアドレス
  mailAddress: z.string().email(),
  // 役割
  roles: Role.optional(),
});
export type Member = z.infer<typeof Member>;
