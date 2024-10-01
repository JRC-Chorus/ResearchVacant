/**
 * 調査終了時の処理を実装する
 */

import { SessionID } from "backend/schema/db/session";
import { deleteSheet } from "backend/source/spreadsheet/common";
import { deleteSession } from "backend/source/spreadsheet/session";


/**
 * 調査結果をもとにした候補日の承認を管理者に問い合わせる
 */
export function sendJudgeCandidate(sessionId: SessionID) {
  const candidateDates = getCandidate()

  // 承認もWebapp上でできるようにする（期日終了後に管理者がアクセスしたときに承認画面が開くようにする？）
}

/**
 * シートの中から候補日を確定させる
 */
function getCandidate() {
  // 外部施設の場合は施設の予約状況を問い合わせる


  // 問い合わせ結果とメンバーの空き日程をもとに候補日を選定する

}

/**
 * 決定日をTeamsに通知する
 */
export function notify4Teams() {
  // teams.send()
}


/**
 * 全ての調査が終了した際に不要となったデータを削除する
 */
export function cleanUpBackData(sessionId: SessionID) {
  // 回答の記録用シートはセッションIDをそのままシート名としている
  deleteSheet(sessionId)

  // セッション一覧から当該セッションを削除
  deleteSession(sessionId)
}



// TODO: 候補日の絞り方に関するテストを記述する