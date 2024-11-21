import {
  AnsStatus,
  AnsSummaryDate,
  AnswerSummary,
  keys,
  RvDate,
} from '@research-vacant/common';
import dayjs from 'dayjs';
import { useMainStore } from 'src/stores/main';

/**
 * 回答を求める必要がある日か
 */
export function isEnableDate(
  ansDates: AnsSummaryDate[],
  date?: RvDate
): boolean;
export function isEnableDate(summary: AnswerSummary, date?: RvDate): boolean;
export function isEnableDate(
  summary: AnsSummaryDate[] | AnswerSummary,
  date?: RvDate
): boolean {
  if (!date) {
    return false;
  }

  // 回答日の一覧を取得
  const ansDates = 'ansDates' in summary ? summary.ansDates : summary;

  // 日付は期間内か
  const targetDay = dayjs(date);
  const startDay = dayjs(ansDates[0].date);
  const endDay = dayjs(ansDates[ansDates.length - 1].date);
  const isInnerDateRange =
    targetDay.diff(startDay, 'day') >= 0 && targetDay.diff(endDay, 'day') <= 0;

  // 休日か
  const mainStore = useMainStore();
  const isHoliday =
    [0, 6].includes(targetDay.day()) ||
    keys(mainStore.specialHoliday).includes(date);

  return isInnerDateRange && !isHoliday;
}

/**
 * アイコン情報
 */
export const iconList: Record<AnsStatus, { icon: string; color: string }> = {
  OK: {
    icon: 'check',
    color: 'primary',
  },
  Pending: {
    icon: 'hourglass_empty',
    color: 'warning',
  },
  NG: {
    icon: 'close',
    color: 'negative',
  },
};

/** In Source Testing */
if (import.meta.vitest) {
  const { describe, test, expect, beforeEach } = import.meta.vitest;
  describe('isEnableDate', async () => {
    const { createPinia, setActivePinia } = await import('pinia');

    const dummyDates = [
      RvDate.parse('2024-10-01'),
      RvDate.parse('2024-10-02'),
      RvDate.parse('2024-10-03'),
      RvDate.parse('2024-10-04'),
      RvDate.parse('2024-10-05'),
    ];
    const dummySummary: AnswerSummary = {
      ansDates: dummyDates.map((d) => {
        return { date: d, ans: [] };
      }),
      freeTxts: [],
    };

    beforeEach(() => {
      // creates a fresh pinia and makes it active
      // so it's automatically picked up by any useStore() call
      // without having to pass it to it: `useStore(pinia)`
      setActivePinia(createPinia());
    });

    test('checkFunc', () => {
      // 境界値と中央値で照査
      expect(isEnableDate(dummySummary, RvDate.parse('2024-09-30'))).toBe(
        false
      );
      expect(isEnableDate(dummySummary, dummyDates[0])).toBe(true);
      expect(isEnableDate(dummySummary, dummyDates[3])).toBe(true);
      expect(
        isEnableDate(dummySummary, dummyDates[dummyDates.length - 2])
      ).toBe(true);
      // 休日チェック
      expect(
        isEnableDate(dummySummary, dummyDates[dummyDates.length - 1])
      ).toBe(false);
      // 範囲外
      expect(isEnableDate(dummySummary, RvDate.parse('2024-10-06'))).toBe(
        false
      );
    });
  });
}
