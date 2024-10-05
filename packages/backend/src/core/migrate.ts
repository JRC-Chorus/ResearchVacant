import { initSheet } from "backend/source/spreadsheet/init";

/**
 * 各種データの初期化や検証
 * 
 * 初回実行時に必要な環境を整備し，不足する情報についての警告を表示する
 * 
 * ## 検査対象
 * - SpreadSheet (データベース)
 * - 紐づけられた外部練習場のデータ取得
 */
export function migrateEnv() {
  // スプレッドシートの初期化
  initSheet()
}