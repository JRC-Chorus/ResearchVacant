import { isHoliday } from 'japanese-holidays';
import { defineStore } from 'pinia';
import { googleScriptRun } from 'src/scripts/api';
import { MemberStatus } from '../../../backend/src/schema/app';
import { AnsDate } from '../../../backend/src/schema/db/answer';

export const useMainStore = defineStore('mainStore', {
  state: () => ({
    __memberStatus: null as MemberStatus | null,
    __answer: null as AnsDate[] | null,
    freeTxt: '',
    error: null as Error | null,
  }),
  actions: {
    async getAnswers() {
      if (this.__answer === null) {
        const tmpStatus = await this.getAccessStatus();
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
    async getAccessStatus() {
      if (this.__memberStatus === null) {
        if (import.meta.env.PROD) {
          google?.script.url.getLocation(async (location) => {
            this.__memberStatus = await googleScriptRun.accessManager(
              location.parameter
            );
          });
        } else {
          this.__memberStatus = await googleScriptRun.accessManager({});
        }

        if (!this.__memberStatus) {
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
