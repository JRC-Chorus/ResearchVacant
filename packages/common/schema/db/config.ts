import { z } from 'zod';

export const researchFrequencyEnum = ['week', 'month'] as const;

/**
 * 本システムにおける設定項目一覧
 *
 * ## 項目の変更方法
 * 1. 下記の型定義を編集し，Config変数が設定項目を持てるようにする
 * 2. backend\src\source\spreadsheet\config.ts の「configShowingKey」でエラーが発生するため，スプレッドシートに表示する説明用の文章を追加する
 */
export const Config = z.object({
  /** 公開したWebappのURL */
  webappUrl: z.string().optional().default(''),

  /** 通知したいチャンネルの Teams Webhook リンク */
  teamsLink: z.string().optional().default(''),

  /** 問い合わせ調査の頻度（数値指定の場合は「N日おき」として解釈）*/
  researchFrequency: z.enum(researchFrequencyEnum).optional().default('month'),

  /** 問い合わせ期間における開催回数*/
  researchPartyCount: z.string().optional().default('１回（２回に変更の可能性あり）'),

  /** 調査画面における備考欄に表示するコメント */
  researchGlobalComment: z.string().optional().default('< 特になし >'),

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

  /** リマインドの送付日 */
  remindDateBeforeEndResearch: z.number().min(-1).optional().default(1),

  /** 開催日の承認を担当するロール */
  approverRoles: z
    .preprocess(
      (val) => (typeof val === 'string' ? [val] : val),
      z.string().array()
    )
    .optional()
    .default(['']),

  /** 必ず出席を求めるロール */
  mustAttendRoles: z
    .preprocess(
      (val) => (typeof val === 'string' ? [val] : val),
      z.string().array()
    )
    .optional()
    .default(['']),

  /** 外部会場の時には出席を求めるロール */
  mustAttendOuterPlaceRoles: z
    .preprocess(
      (val) => (typeof val === 'string' ? [val] : val),
      z.string().array()
    )
    .optional()
    .default(['']),

  /** 回答案内時のメール */
  announceAnswerMail: z
    .string()
    .optional()
    .default('下記URLより日程調査の回答をお願いいたします．'),
  /** 回答案内時のメールの件名 */
  announceAnswerMailSubject: z
    .string()
    .optional()
    .default('【日程調査】回答のお願い'),

  /** リマインドメール */
  remindMail: z
    .string()
    .optional()
    .default(
      '先日より実施中の日程調査の締め切りが間近です．\n下記URLよりご回答をお願いいたします．'
    ),
  /** リマインドメールの件名 */
  remindMailSubject: z
    .string()
    .optional()
    .default('【日程調査】回答のお願い（リマインド）'),

  /** 管理者への承認依頼メール */
  requestApproveMail: z
    .string()
    .optional()
    .default('日程調査が終了しました．開催日の決定をお願いいたします．'),
  /** 承認依頼のメールの件名 */
  requestApproveMailSubject: z
    .string()
    .optional()
    .default('【日程調査】開催日の承認依頼'),

  /** Teamsへの通知メッセージ */
  announceDecidedDateNotice: z
    .string()
    .optional()
    .default('開催日が決定しました．当日はお気をつけてご出席ください．'),

  // 将来的にはメールの内容もconfigから受け取る？
});
export type Config = z.infer<typeof Config>;
