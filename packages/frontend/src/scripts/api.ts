import { MemberStatus } from '@research-vacant/common';
import { IRun, IUrlLocation } from 'src/schema/global';
import { useMainStore } from 'src/stores/main';
import { loadAccessMock } from './accessCases';

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
  ): Promise<Promise<MemberStatus>> {
    const target = new Promise<MemberStatus>((resolve) => {
      resolve(loadAccessMock('alreadyAns'));
    });

    return new Promise((resolve) => {
      resolve(target);
    });
  },
  submitAnswers(params, ans, freeTxt) {
    return new Promise((resolve) => {
      setTimeout(resolve, 5000);
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
