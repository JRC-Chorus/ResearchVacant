import { isHoliday } from 'japanese-holidays';
import { defineStore } from 'pinia';
import { MemberStatus } from '../../../backend/src/schema/app';
import { AnsDate } from '../../../backend/src/schema/db/answer';

type ErrorData = {
  title: string;
  message: string;
};

export const useMainStore = defineStore('mainStore', {
  state: () => ({
    __memberStatus: null as MemberStatus | null,
    __answer: null as AnsDate[] | null,
    freeTxt: '',
    error: null as ErrorData | null,
  }),
  actions: {
    getAnswers() {
      if (this.__answer === null) {
        const tmpStatus = this.getAccessStatus();
        if (tmpStatus && 'summary' in tmpStatus) {
          this.__answer = tmpStatus.summary.ansDates.map((d) => {
            return {
              date: d.date,
              ans: isHoliday(new Date(d.date)) ? 'NG' : 'OK',
            };
          });
        }
      }

      return this.__answer;
    },
    getAccessStatus() {
      if (this.__memberStatus === null) {
        // TODO: 実装最適化
        if (google) {
          google?.script.url.getLocation((location) => {
            google?.script.run
              .withSuccessHandler((val) => (this.__memberStatus = val))
              .withFailureHandler((err) => console.log(err))
              .accessManager(location.parameter);
          });
        } else {
          this.__memberStatus = {
            status: 'invalidUser',
          };
        }
      }

      return this.__memberStatus;
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
