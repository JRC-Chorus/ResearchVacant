import {
  AnsDate,
  AnswerSummary,
  MemberStatus,
  PlaceID,
  RvDate,
  SHOWING_DATE_FORMAT,
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
    /** バックエンドとの通信でエラーがあった場合に格納 */
    error: null as Error | null,
  }),
  actions: {
    async getAccessStatus() {
      // load session
      if (this.__memberStatus === null) {
        const loc = getURLLocation(window.location.href);
        this.__memberStatus = await googleScriptRun.accessManager(loc ?? {});

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
          SHOWING_DATE_FORMAT
        )} ～ ${ansEnd.format(SHOWING_DATE_FORMAT)}`;
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
                  : summary.selfAns?.ansDates.at(idx - startDateIdx)?.ans ??
                      'OK';
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
  const { test, expect, describe, beforeEach } = import.meta.vitest;
  test('holiday checker', () => {
    const naturalDay = new Date('2024-10-8');
    const holiday = new Date('2024-10-14');

    expect(!!isHoliday(naturalDay)).toBe(false);
    expect(!!isHoliday(holiday)).toBe(true);
  });

  describe('main Pinia test', async () => {
    const { createPinia, setActivePinia } = await import('pinia');

    beforeEach(() => {
      // creates a fresh pinia and makes it active
      // so it's automatically picked up by any useStore() call
      // without having to pass it to it: `useStore(pinia)`
      setActivePinia(createPinia());
    });

    test('initModel', async () => {
      const { MemberID } = await import('@research-vacant/common');
      const sampleSummary: AnswerSummary = {
        freeTxts: [],
        ansDates: [
          {
            ans: [
              { ansPersonNames: [], status: 'OK' },
              { status: 'Pending', ansPersonNames: [] },
              { status: 'NG', ansPersonNames: ['サンプル メンバー'] },
            ],
            date: RvDate.parse('2025-02-01'),
          },
          {
            ans: [
              { ansPersonNames: ['サンプル メンバー'], status: 'OK' },
              { status: 'Pending', ansPersonNames: [] },
              { status: 'NG', ansPersonNames: [] },
            ],
            date: RvDate.parse('2025-02-28'),
          },
        ],
        selfAns: {
          userId: MemberID.parse('521d229a-091a-4893-a74f-82efc4fd577b'),
          ansDates: [
            { date: RvDate.parse('2025-02-01'), ans: 'NG' },
            { date: RvDate.parse('2025-02-02'), ans: 'NG' },
            { date: RvDate.parse('2025-02-03'), ans: 'OK' },
            { date: RvDate.parse('2025-02-04'), ans: 'OK' },
            { date: RvDate.parse('2025-02-05'), ans: 'OK' },
            { date: RvDate.parse('2025-02-06'), ans: 'OK' },
            { date: RvDate.parse('2025-02-07'), ans: 'OK' },
            { date: RvDate.parse('2025-02-08'), ans: 'NG' },
            { date: RvDate.parse('2025-02-09'), ans: 'NG' },
            { date: RvDate.parse('2025-02-10'), ans: 'OK' },
            { date: RvDate.parse('2025-02-11'), ans: 'NG' },
            { date: RvDate.parse('2025-02-12'), ans: 'OK' },
            { date: RvDate.parse('2025-02-13'), ans: 'OK' },
            { date: RvDate.parse('2025-02-14'), ans: 'NG' },
            { date: RvDate.parse('2025-02-15'), ans: 'NG' },
            { date: RvDate.parse('2025-02-16'), ans: 'NG' },
            { date: RvDate.parse('2025-02-17'), ans: 'OK' },
            { date: RvDate.parse('2025-02-18'), ans: 'OK' },
            { date: RvDate.parse('2025-02-19'), ans: 'OK' },
            { date: RvDate.parse('2025-02-20'), ans: 'OK' },
            { date: RvDate.parse('2025-02-21'), ans: 'OK' },
            { date: RvDate.parse('2025-02-22'), ans: 'NG' },
            { date: RvDate.parse('2025-02-23'), ans: 'NG' },
            { date: RvDate.parse('2025-02-24'), ans: 'NG' },
            { date: RvDate.parse('2025-02-25'), ans: 'OK' },
            { date: RvDate.parse('2025-02-26'), ans: 'OK' },
            { date: RvDate.parse('2025-02-27'), ans: 'OK' },
            { date: RvDate.parse('2025-02-28'), ans: 'OK' },
          ],
          userName: 'サンプル メンバー',
          freeText: '',
        },
      };

      // initialize
      const mainStore = useMainStore();
      mainStore.initAnsModel(sampleSummary);

      // test
      expect(mainStore.ansModel[0]).toBe(undefined); // 範囲外はundefined
      expect(mainStore.ansModel[6]?.ans).toBe('NG'); // 2025-02-01は土曜日のためNG扱い
      expect(mainStore.ansModel[8]?.ans).toBe('OK'); // 2025-02-03は月曜日で回答もOK
      expect(mainStore.ansModel[19]?.ans).toBe('NG'); // 2025-02-14は金曜日で回答はNG
      expect(mainStore.ansModel[29]?.ans).toBe('NG'); // 2025-02-14は月曜日で天皇誕生日の振替休日のためNG扱い
    });
  });
}
