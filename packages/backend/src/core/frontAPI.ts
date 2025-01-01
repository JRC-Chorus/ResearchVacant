import {
  AnsDate,
  ApiRequest,
  ApiResponse,
  FrontAPI,
  keys,
  PartyInfo,
} from '@research-vacant/common';

export function frontApiFuncs(
  apis: FrontAPI,
  e: Record<string, string>
): ApiResponse {
  const parsedParams = ApiRequest.safeParse(e);
  const funcName = keys(apis).find(
    (fName) => fName === parsedParams.data?.func
  );

  if (parsedParams.success && funcName) {
    try {
      // TODO: '@typescript-eslint/switch-exhaustiveness-check'を入れてSwitchの条件漏れを確認させる
      switch (funcName) {
        case 'accessManager':
          const memberStatus = apis.accessManager(e);
          return {
            status: 'success',
            val: memberStatus,
          };
        case 'submitAnswers':
          if (parsedParams.data.args.length === 5) {
            apis.submitAnswers(
              parsedParams.data.args[0],
              AnsDate.array().parse(parsedParams.data.args[1]),
              parsedParams.data.args[2],
              parsedParams.data.args[3],
              parsedParams.data.args[4]
            );
            return { status: 'success' };
          }
        case 'decideDates':
          if (parsedParams.data.args.length === 2) {
            apis.decideDates(
              parsedParams.data.args[0],
              PartyInfo.array().parse(parsedParams.data.args[1])
            );
            return { status: 'success' };
          }
      }
    } catch (err) {
      if (err instanceof Error) {
        return {
          status: 'fail',
          errTitle: err.name,
          errDescription: `${err.message}\n\n${err.stack}`,
        };
      }
      return {
        status: 'fail',
        errTitle: String(err),
      };
    }
  }

  return {
    status: 'fail',
    errTitle: '400 BAD REQUEST (Invalid funcName or params)',
  };
}

/** In Source Testing */
if (import.meta.vitest) {
  const { describe, test, expect } = import.meta.vitest;
  describe('frontAPI', async () => {
    // apis
    const apis: FrontAPI = {
      accessManager: (params) => {
        return { status: 'invalidUser' };
      },
      submitAnswers: (params, ans, freeTxt, partyCount, biko) => {},
      decideDates: (params, infos) => {},
    };

    test('accessManager_API_noArgs', () => {
      const res = frontApiFuncs(apis, {
        aId: 'SAMPLE ACCESS ID',
        func: 'accessManager',
        args: '',
      });
      expect(res).toMatchObject({
        status: 'success',
        val: { status: 'invalidUser' },
      });
    });

    test('accessManager_API_hasArgs', () => {
      const res = frontApiFuncs(apis, {
        aId: '65e6bd0b6954191c71d350c9de249387',
        func: 'submitAnswers',
        args: decodeURIComponent(
          '%5B%7B%22aId%22%3A%2265e6bd0b6954191c71d350c9de249387%22%2C%22deployId%22%3A%22AKfycbz3sPuwSQkW9nyaLXpTfZ9GzMZGaE_9CHUTEo_rjpbkz11WyTtFbMN7k-j8s_q1NpI4Eg%22%7D%2C%5B%7B%22date%22%3A%222025-03-01%22%2C%22ans%22%3A%22NG%22%7D%2C%7B%22date%22%3A%222025-03-02%22%2C%22ans%22%3A%22NG%22%7D%2C%7B%22date%22%3A%222025-03-03%22%2C%22ans%22%3A%22OK%22%7D%2C%7B%22date%22%3A%222025-03-25%22%2C%22ans%22%3A%22OK%22%7D%2C%7B%22date%22%3A%222025-03-26%22%2C%22ans%22%3A%22OK%22%7D%2C%7B%22date%22%3A%222025-03-27%22%2C%22ans%22%3A%22OK%22%7D%2C%7B%22date%22%3A%222025-03-28%22%2C%22ans%22%3A%22OK%22%7D%2C%7B%22date%22%3A%222025-03-29%22%2C%22ans%22%3A%22NG%22%7D%5D%2C%22%22%2C%22%EF%BC%91%E5%9B%9E%EF%BC%88%EF%BC%92%E5%9B%9E%E3%81%AB%E5%A4%89%E6%9B%B4%E3%81%AE%E5%8F%AF%E8%83%BD%E6%80%A7%E3%81%82%E3%82%8A%EF%BC%89%22%2C%22%3C+%E7%89%B9%E3%81%AB%E3%81%AA%E3%81%97+%3E%22%5D'
        ),
      });
      expect(res).toMatchObject({
        status: 'success',
      });
    });
  });
}
