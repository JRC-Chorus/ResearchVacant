import dayjs from 'dayjs';
import { isHoliday } from 'japanese-holidays';
import { defineStore } from 'pinia';
import { getURLLocation, googleScriptRun } from 'src/scripts/api';
import { MemberStatus } from '../../../backend/src/schema/app';
import { AnsStatus } from '../../../backend/src/schema/db/answer';

export const useMainStore = defineStore('mainStore', {
  state: () => ({
    /** 今回の通信の状況と必要なデータのセット */
    __memberStatus: null as MemberStatus | null,
    /** 描画する週（１か月は必ず５週間以内に収まる） */
    showingWeekCount: 5,
    /** フロントエンド用の回答一覧 */
    ansModel: [] as (AnsStatus | undefined)[],
    /** 祝日記録用 */
    specialHoliday: [] as (string | undefined)[],
    /** 自由記述 */
    freeTxt: '',
    /** バックエンドとの通信でエラーがあった場合に格納 */
    error: null as Error | null,
  }),
  actions: {
    async getAccessStatus() {
      if (this.__memberStatus === null) {
        const loc = await getURLLocation();
        this.__memberStatus = await googleScriptRun.accessManager(
          loc.parameter
        );

        if (!this.__memberStatus) {
          this.__memberStatus = {
            status: 'invalidUser',
          };
        }
      }

      return this.__memberStatus;
    },
    /**
     * フロントエンド用の回答一覧を初期化する
     * 
     * TODO: 週次アンケートの場合，週の中で月をまたいでしまうと跨いだ先の日付が表示されないバグあり
     */
    initAnsModel(status: MemberStatus) {
      if ('summary' in status) {
        // calc start and end research date
        const startDate = dayjs(status.summary.ansDates[0].date);
        const endDate = dayjs(
          status.summary.ansDates[status.summary.ansDates.length - 1].date
        );

        // where is the start date in calendar's meta data
        const monthStartIdx = Number.parseInt(
          startDate.startOf('month').format('d')
        );
        const monthDateCount = startDate
          .endOf('month')
          .diff(startDate.startOf('month'), 'day');
        const startDateIdx =
          startDate.diff(startDate.startOf('month'), 'day') + monthStartIdx;
        const endDateIdx =
          endDate.diff(startDate.startOf('month'), 'day') + monthStartIdx;

        // generate the init calendar data
        this.ansModel = [...new Array(7 * this.showingWeekCount)].map((_, idx) => {
          if (idx < monthStartIdx || idx > monthStartIdx + monthDateCount) {
            // そもそも月始めよりも前，月終わりより後，の日付は非表示にする
            return undefined;
          } else {
            // 休日チェック
            const holidayCheck = isHoliday(
              new Date(startDate.add(idx - startDateIdx, 'day').format())
            );
            this.specialHoliday.push(holidayCheck);

            // 期間内の場合は休日を除き回答対象とする
            if (
              startDateIdx <= idx &&
              idx <= endDateIdx &&
              ![1, 0].includes((idx + 1) % 7)
            ) {
              return holidayCheck ? 'NG' : 'OK';
            } else {
              // 期間外の日付はすべてNG扱い
              return 'NG';
            }
          }
        });
      } else {
        this.error = new Error('INVALID ANSWER IS COMMING IN CALENDAR');
      }
    },
  },
});

/** In Source Testing */
if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  test('holiday checker', () => {
    const naturalDay = new Date('2024-10-8');
    const holiday = new Date('2024-10-14');

    expect(!!isHoliday(naturalDay)).toBe(false);
    expect(!!isHoliday(holiday)).toBe(true);
  });
}
