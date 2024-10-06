import dayjs from 'dayjs';
import { RvDate } from 'backend/schema/db/common';
import { Config } from 'backend/schema/db/config';
import { Session } from 'backend/schema/db/session';
import { getConfig } from 'backend/source/spreadsheet/config';
import {
  getSessions,
  publishSession,
} from 'backend/source/spreadsheet/session';
import { values } from 'backend/utils/obj/obj';

/**
 * セッションの一覧を取得し，本日の日付に対して必要なセッションの発行を行う
 *
 * 新規発行したセッションはデータベースに追記する
 */
export function sessionChecker(): Session[] {
  const config = getConfig();
  const sessions = values(getSessions());

  // 存在しているはずの開始日
  const startDate = dayjs();
  const researchStartDate = getResearchStartDate(config, startDate);
  // 想定される開始日が存在しない場合，新規セッションの発行をする
  if (!sessions.some((s) => s.researchRangeStart === researchStartDate)) {
    const ansEndDate = getAnsEndDate(config, startDate);
    publishSession(
      RvDate.parse(startDate.format()),
      getRemindDate(config, ansEndDate),
      ansEndDate,
      researchStartDate,
      getRangeEndDate(config, researchStartDate)
    );
  }

  // publishしたセッションを追加済みの最新のリストを返す
  return values(getSessions());
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
 * リマインド日（終了日からリマンインド日数を減算）を算出する
 */
function getRemindDate(
  config: Config,
  endResearchDate: RvDate
): RvDate | undefined {
  // 無効なリマインド日の場合はリマインド設定をしない
  if (
    config.remindDateBeforeEndResearch === -1 ||
    config.answerRange <= config.remindDateBeforeEndResearch
  ) {
    return;
  }

  return RvDate.parse(
    dayjs(endResearchDate)
      .subtract(config.remindDateBeforeEndResearch, 'day')
      .format()
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

/** In Source Testing */
if (import.meta.vitest) {
  const { describe, test, expect } = import.meta.vitest;

  describe('beginResearch', async () => {
    const { getDefaults } = await import('backend/schema/defaultVals');
    const { deepcopy } = await import('backend/utils/deepcopy');

    const defaultConfig = getDefaults(Config);
    const today = dayjs('2024/1/1');

    // 変化版設定（調査サイクル：週次，調査対象：２週間後）
    const changedConfig = deepcopy(defaultConfig);
    changedConfig.researchTargetCycle = 2;
    changedConfig.researchFrequency = 'week';

    // 型変換のテスト
    test('rvDate', () => {
      expect(RvDate.parse(today.format())).toBe('2024-01-01');
    });

    // 次のセッションにおける調査対象期間の初日
    test('getResearchStartDate', () => {
      // 標準通りの設定
      expect(getResearchStartDate(defaultConfig, today)).toBe('2024-02-01');

      // 変化版設定
      expect(getResearchStartDate(changedConfig, today)).toBe('2024-01-14');
    });

    // 調査対象期間の終了日
    test('getRangeEndDate', () => {
      // 標準通りの設定
      const researchStartDate = getResearchStartDate(defaultConfig, today);
      expect(getRangeEndDate(defaultConfig, researchStartDate)).toBe(
        '2024-02-29'
      );

      // 変化版設定
      const changedResearchStartDate = getResearchStartDate(
        changedConfig,
        today
      );
      expect(getRangeEndDate(changedConfig, changedResearchStartDate)).toBe(
        '2024-01-20'
      );
    });

    // 調査締切日（標準設定では調査開始の３日後を締め切りにする）
    test('getAnsEndDate', () => {
      // 標準通りの設定
      expect(getAnsEndDate(defaultConfig, today)).toBe('2024-01-04');

      // 変化版設定
      expect(getAnsEndDate(changedConfig, today)).toBe('2024-01-04');
    });
  });
}
