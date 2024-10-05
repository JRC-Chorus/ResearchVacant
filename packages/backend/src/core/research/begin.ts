/**
 * 調査を始めるための実装をする
 */
import { RvDate } from 'backend/schema/db/common';
import { Config } from 'backend/schema/db/config';
import { Session, SessionID } from 'backend/schema/db/session';
import { getConfig } from 'backend/source/spreadsheet/config';
import {
  getSessions,
  publishSession,
} from 'backend/source/spreadsheet/session';
import dayjs from 'dayjs';

/**
 * セッションの一覧を取得し，本日の日付に対して必要なセッションの発行を行う
 *
 * 新規発行したセッションはデータベースに追記する
 */
export function sessionChecker(): Session[] {
  const config = getConfig();
  const sessions = getSessions();

  // 存在しているはずの開始日
  const startDate = dayjs();
  const researchStartDate = getResearchStartDate(config, startDate);
  // 想定される開始日が存在しない場合，新規セッションの発行をする
  if (!sessions.some((s) => s.researchRangeStart === researchStartDate)) {
    publishSession(
      RvDate.parse(startDate.format()),
      getAnsEndDate(config, startDate),
      researchStartDate,
      getRangeEndDate(config, researchStartDate)
    );
  }

  return getSessions();
}

/**
 * 本日において存在しているはずの直近のセッションの開始日を算出する
 *
 * - 調査対象の期間の取り方
 * - 調査対象は何サイクル後
 *
 * を考慮して算出
 */
function getResearchStartDate(config: Config, startDate: dayjs.Dayjs): RvDate {
  // 調査開始日から見て対象セッションの期間内の日付を算出
  const tmpTargetDate = startDate.add(
    config.researchTargetCycle,
    config.researchFrequency
  );
  // 当該セッションの先頭の日付を返す
  return RvDate.parse(tmpTargetDate.startOf(config.researchFrequency).format());
}

/**
 * 調査対象期間の終了日を算出する
 */
function getRangeEndDate(config: Config, startResearchDate: RvDate): RvDate {
  return RvDate.parse(
    dayjs(startResearchDate).endOf(config.researchFrequency).format()
  );
}

/**
 * 調査に対する回答期間の終了日を算出する
 */
function getAnsEndDate(config: Config, startDate: dayjs.Dayjs): RvDate {
  const maxRanges: Record<Config['researchFrequency'], number> = {
    week: 7,
    month: 28,
  };
  const ansRange = Math.min(
    config.answerRange,
    maxRanges[config.researchFrequency]
  );
  return RvDate.parse(startDate.add(ansRange, 'day').format());
}

/**
 * 調査開始
 */
export function startSession(sessionId: SessionID) {
  // 回答記録用シートの作成，ステータスの更新等，必要なデータベースの整備を行う
  // 案内メールの送付
}

/**
 * 部員全員に案内メールを送信する
 */
function sendMail2Members() {}

/**
 * セッションを確認し，対象者にリマインドメールを送信する
 */
export function sendRemindMail(sessionId: SessionID) {}
