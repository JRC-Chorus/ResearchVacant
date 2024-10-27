import { MemberStatus, RvDate } from '@research-vacant/common';
import { IRun, IUrlLocation } from 'src/schema/global';
import { useMainStore } from 'src/stores/main';

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
            { date: RvDate.parse('2024-10-4'), ans: [] },
            { date: RvDate.parse('2024-10-5'), ans: [] },
            { date: RvDate.parse('2024-10-6'), ans: [] },
            { date: RvDate.parse('2024-10-7'), ans: [] },
            { date: RvDate.parse('2024-10-8'), ans: [] },
            { date: RvDate.parse('2024-10-9'), ans: [] },
            { date: RvDate.parse('2024-10-10'), ans: [] },
            { date: RvDate.parse('2024-10-11'), ans: [] },
            { date: RvDate.parse('2024-10-12'), ans: [] },
            { date: RvDate.parse('2024-10-13'), ans: [] },
            { date: RvDate.parse('2024-10-14'), ans: [] },
            { date: RvDate.parse('2024-10-15'), ans: [] },
            { date: RvDate.parse('2024-10-16'), ans: [] },
            { date: RvDate.parse('2024-10-17'), ans: [] },
            { date: RvDate.parse('2024-10-18'), ans: [] },
          ],
          freeTxts: [],
        },
      });
    });
  },
  submitAnswers(params, ans, freeTxt) {
    return new Promise((resolve) => {
      setTimeout(() => {}, 5000);
      resolve();
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
export const googleScriptRun =
  import.meta.env.PROD && google
    ? new Proxy(google.script.run, {
        get(target, method: keyof typeof google.script.run) {
          const mainStore = useMainStore();
          return (...args: any[]) => {
            return new Promise((resolve) => {
              const callMethod = target
                .withSuccessHandler(resolve)
                .withFailureHandler((err) => (mainStore.error = err))[
                method
              ] as any;
              callMethod(...args);
            });
          };
        },
      })
    : mockFuncs;

// アクセス時のURL情報を返す
const dummyLoc: IUrlLocation = { hash: '', parameter: {}, parameters: {} };
export const getURLLocation = () =>
  new Promise<IUrlLocation>((resolve) =>
    import.meta.env.PROD && google
      ? google.script.url.getLocation(resolve)
      : resolve(dummyLoc)
  );

/**
 * 回答した日付をバックエンドに送信し，データベースへの登録を待機する
 */
export async function sendVacantDates() {
  const urlParams = (await getURLLocation()).parameter;

  const mainStore = useMainStore();
  const ans = mainStore.ansModel.filter((a) => a !== void 0);

  await googleScriptRun.submitAnswers(urlParams, ans, mainStore.freeTxt);
}
