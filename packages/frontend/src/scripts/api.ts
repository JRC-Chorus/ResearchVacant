import { IRun } from 'src/schema/global';
import { useMainStore } from 'src/stores/main';
import { MemberStatus } from '../../../backend/src/schema/app';
import { RvDate } from '../../../backend/src/schema/db/common';

const mockFuncs: IRun = {
  doGet: function (e: any): Promise<GoogleAppsScript.HTML.HtmlOutput> {
    throw new Error('Function not implemented.');
  },
  migrateEnv: function (): Promise<void> {
    throw new Error('Function not implemented.');
  },
  researchManager: function (): Promise<void> {
    throw new Error('Function not implemented.');
  },
  accessManager: function (
    params: Record<string, string>
  ): Promise<MemberStatus> {
    return new Promise((resolve) => {
      resolve({
        status: 'noAns',
        summary: {
          ansDates: [
            { date: RvDate.parse('2024-10-1'), ans: [] },
            { date: RvDate.parse('2024-10-2'), ans: [] },
            { date: RvDate.parse('2024-10-3'), ans: [] },
          ],
          freeTxts: [],
        },
      });
    });
  },
  getSampleData: function (): Promise<any[][]> {
    throw new Error('Function not implemented.');
  },
  withFailureHandler(callback) {
    throw new Error('Function not implemented.');
  },
  withSuccessHandler(callback) {
    throw new Error('Function not implemented.');
  },
  withUserObject(object) {
    throw new Error('Function not implemented.');
  },
};

/**
 * 汎用的にGASのAPIを呼び出す
 */
export const googleScriptRun = import.meta.env.PROD
  ? google ? new Proxy(google.script.run, {
      get(
        target: typeof google.script.run,
        method: keyof typeof google.script.run
      ) {
        const mainStore = useMainStore();
        return (...args: any[]) =>{
          new Promise((resolve, reject) => {
            (<any>target
              .withSuccessHandler(resolve)
              .withFailureHandler(err => mainStore.error = err)
              [method])(...args);
          });}
      },
    }) : mockFuncs
  : mockFuncs;


/**
 * 回答した日付をバックエンドに送信し，データベースへの登録を待機する
 */
// export async function sendVacantDates(dates: Date[]) {
//   // TODO: datesの情報をバックエンドに送信

//   // 通信が正常に完了した際にはTrueを返す
//   return true;
// }
