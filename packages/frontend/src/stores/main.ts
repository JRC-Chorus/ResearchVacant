import {
  AnsDate,
  AnswerSummary,
  MemberStatus,
  PlaceID,
  RvDate,
} from '@research-vacant/common';
import dayjs from 'dayjs';
import { isHoliday } from 'japanese-holidays';
import { defineStore } from 'pinia';
import { getURLLocation, googleScriptRun } from 'src/scripts/api';

export const useMainStore = defineStore('mainStore', {
  state: () => ({
    /** 今回の通信の状況と必要なデータのセット */
    __memberStatus: null as MemberStatus | null,
    /** 描画する週（１か月は必ず５週間以内に収まる） */
    showingWeekCount: 5,
    /** フロントエンド用の回答一覧 */
    ansModel: [] as (AnsDate | undefined)[],
    /** 開催日決定時にマークされた日付 */
    markedDates: {} as Record<RvDate, PlaceID>,
    /** 祝日記録用 */
    specialHoliday: {} as Record<RvDate, string>,
    /** 自由記述 */
    freeTxt: '',
    /** 調査回答期間 */
    ansDateRange: '',
    /** 開催回数 */
    partyCount: '',
    /** 備考欄 */
    bikou: '',
    /** 再読み込み可能か */
    isEnableReload: false,
    /** 承認画面を表示するか（回答期間中） */
    isShowApproverView: false,
    /** 日付の標準フォーマット */
    showingDateFormat: 'YYYY年MM月DD日',
    /** バックエンドとの通信でエラーがあった場合に格納 */
    error: null as Error | null,
  }),
  actions: {
    async getAccessStatus() {
      // load session
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

      // init details
      if (
        this.__memberStatus.status === 'noAns' ||
        this.__memberStatus.status === 'alreadyAns' ||
        this.__memberStatus.status === 'judging' ||
        this.__memberStatus.status === 'finished'
      ) {
        const ansStart = dayjs(this.__memberStatus.details.researchStartDate);
        const ansEnd = dayjs(this.__memberStatus.details.researchEndDate);
        this.ansDateRange = `${ansStart.format(
          this.showingDateFormat
        )} ～ ${ansEnd.format(this.showingDateFormat)}`;
        this.partyCount = this.__memberStatus.details.partyCount;
        this.bikou = this.__memberStatus.details.bikou;
      }

      return this.__memberStatus;
    },
    /**
     * フロントエンド用の回答一覧を初期化する
     *
     * TODO: 週次アンケートの場合，週の中で月をまたいでしまうと跨いだ先の日付が表示されないバグあり
     */
    initAnsModel(summary: AnswerSummary) {
      // calc start and end research date
      const startDate = dayjs(summary.ansDates[0].date);
      const endDate = dayjs(summary.ansDates[summary.ansDates.length - 1].date);

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
      this.ansModel = [...new Array(7 * this.showingWeekCount)].map(
        (_, idx) => {
          if (idx < monthStartIdx || idx > monthStartIdx + monthDateCount) {
            // そもそも月始めよりも前，月終わりより後，の日付は非表示にする
            return undefined;
          } else {
            const thisDay = RvDate.parse(
              startDate.add(idx - startDateIdx, 'day').format()
            );

            // 休日チェック
            const holidayCheck = isHoliday(new Date(thisDay));
            if (holidayCheck) {
              this.specialHoliday[thisDay] = holidayCheck;
            }

            // 期間内の場合は休日を除き回答対象とする
            const initAns = () => {
              if (
                startDateIdx <= idx &&
                idx <= endDateIdx &&
                ![1, 0].includes((idx + 1) % 7)
              ) {
                return holidayCheck
                  ? 'NG'
                  : summary.selfAns?.ansDates.at(idx)?.ans ?? 'OK';
              } else {
                // 期間外の日付はすべてNG扱い
                return 'NG';
              }
            };
            return {
              date: thisDay,
              ans: initAns(),
            };
          }
        }
      );

      // initialize markedDates
      this.markedDates = {};

      // initialize free texts
      if (summary.selfAns?.freeText) {
        this.freeTxt = summary.selfAns?.freeText;
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
