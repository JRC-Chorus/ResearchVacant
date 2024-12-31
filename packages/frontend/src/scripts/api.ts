import {
  ApiResponse,
  FrontUrlParams,
  MemberStatus,
  PartyInfo,
  toEntries,
} from '@research-vacant/common';
import { IRun } from 'src/schema/global';
import { useMainStore } from 'src/stores/main';
import { loadAccessMock, urlParamsMock } from './accessCases';

const mockFuncs: IRun = {
  accessManager: function (
    params: Record<string, string>
  ): Promise<MemberStatus> {
    return new Promise((resolve) => {
      resolve(loadAccessMock('noAns', false));
    });
  },
  submitAnswers(params, ans, freeTxt) {
    return new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });
  },
  decideDates(params, infos) {
    return new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });
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
export const googleScriptRun = new Proxy(mockFuncs, {
  get(target, method: keyof IRun) {
    if (import.meta.env.DEV) {
      return target[method];
    }

    return async (...args: any[]) => {
      const params = getURLLocation(window.location.href);
      if (!params) return;

      const apiUrl = `https://script.google.com/macros/s/${
        params.deployId
      }/exec?func=${method}&${toEntries(params).join('&')}`;

      const requestArgs =
        args.length > 0
          ? {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(args),
            }
          : {};

      const res = await fetch(apiUrl, requestArgs);
      const parsedRes = ApiResponse.parse(await res.json());

      if (parsedRes.status === 'success') {
        return parsedRes.val;
      } else {
        const mainStore = useMainStore();
        mainStore.error = new Error(parsedRes.errTitle, {
          cause: parsedRes.errDescription,
        });
      }
    };
  },
});

// export const googleScriptRun =
//   import.meta.env.PROD && google
//     ? new Proxy(google.script.run, {
//         get(target, method: keyof typeof google.script.run) {
//           const mainStore = useMainStore();
//           return (...args: any[]) => {
//             return new Promise((resolve) => {
//               const callMethod = target
//                 .withSuccessHandler(resolve)
//                 .withFailureHandler((err) => (mainStore.error = err))[
//                 method
//               ] as any;
//               callMethod(...args);
//             });
//           };
//         },
//       })
//     : mockFuncs;

// アクセス時のURL情報を返す
export const getURLLocation = (url: string) => {
  if (import.meta.env.DEV) {
    return urlParamsMock;
  }

  const urlObj = new URL(url);
  const returnObj: Record<string, string> = {};
  urlObj.searchParams.forEach((v, k) => {
    returnObj[k] = v;
  });

  const parsedParams = FrontUrlParams.safeParse(returnObj);
  if (!parsedParams.success) {
    console.log(parsedParams.error);
    const mainStore = useMainStore();
    mainStore.error = parsedParams.error;
    return undefined;
  }

  return parsedParams.data;
};

/**
 * 回答した日付をバックエンドに送信し，データベースへの登録を待機する
 */
export async function sendVacantDates() {
  const urlParams = getURLLocation(window.location.href);

  if (urlParams) {
    const mainStore = useMainStore();
    const ans = mainStore.ansModel.filter((a) => a !== void 0);

    await googleScriptRun.submitAnswers(
      urlParams,
      ans,
      mainStore.freeTxt,
      mainStore.partyCount,
      mainStore.bikou
    );
  }
}

/**
 * 開催日を決定し，その通知をバックエンドに飛ばす
 */
export async function sendPartyDate() {
  const urlParams = getURLLocation(window.location.href);

  if (urlParams) {
    const mainStore = useMainStore();
    const ans: PartyInfo[] = toEntries(mainStore.markedDates).map((kv) => {
      return { date: kv[0], placeId: kv[1] };
    });

    await googleScriptRun.decideDates(urlParams, ans);
  }
}

/** In Source Testing */
if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  test('urlParams', () => {
    const dummyUrl =
      'https://expamle.com/index.html?aId=gc39195&deployId=1234567890';
    const urlParams = getURLLocation(dummyUrl);

    expect(urlParams).toEqual({
      aId: 'gc39195',
      deployId: '1234567890',
    });
  });
}
