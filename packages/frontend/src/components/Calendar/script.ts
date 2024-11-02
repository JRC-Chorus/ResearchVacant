import { AnswerSummary, keys, RvDate } from '@research-vacant/common';
import dayjs from 'dayjs';
import { useMainStore } from 'src/stores/main';

/**
 * 回答を求める必要がある日か
 */
export function isEnableDate(summary: AnswerSummary, date?: RvDate): boolean {
  if (!date) {
    return false;
  }

  // 日付は期間内か
  const targetDay = dayjs(date);
  const startDay = dayjs(summary.ansDates[0].date);
  const endDay = dayjs(summary.ansDates[summary.ansDates.length - 1].date);
  const isInnerDateRange =
    targetDay.isAfter(startDay, 'date') && targetDay.isBefore(endDay, 'date');

  // 休日か
  const mainStore = useMainStore();
  const isHoliday =
    [0, 6].includes(targetDay.day()) ||
    keys(mainStore.specialHoliday).includes(date);

  return isInnerDateRange && !isHoliday;
}
