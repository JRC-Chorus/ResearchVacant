/**
 * 調査全体に関する処理を記述する
 * 
 * 基本的にはここの関数を定期実行し，関数内でそれぞれのステータスに応じた処理を実行する
 */

import { MemberStatus } from "backend/schema/app";
import { MemberID } from "backend/schema/db/member";

export function researchManager() {
  // セッション一覧・設定シートを確認し，開催中の調査（リマインドの送付，終了案内の送付等）や開始すべき調査について確認する

  // 新規でセッションを開始


  // リマインドの送付


  // 管理者へ候補日の案内


  // 完全に終了した後の処理（不要になったデータの削除など？）
}

/**
 * フロントエンドからのアクセスがあったときに，当該アクセスに対するレスポンスを定義
 */
export function accessManager(memberId: MemberID): MemberStatus {
  // TODO: メンバーIDを参照して適切なステータスを返す関数を実装
  return { status: 'noAns' }
}