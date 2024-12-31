import { AnsDate, FrontAPI, keys, PartyInfo } from '@research-vacant/common';

const includeAll = <T>(targetArray: T[], searchElements: T[]) =>
  targetArray.every((target) => searchElements.includes(target));

export function frontApiFuncs(
  apis: FrontAPI,
  e: Record<string, string>
): string {
  const tmpFuncName = e['func'] ?? '';
  const funcName = keys(apis).find((fName) => fName === tmpFuncName);

  if (funcName) {
    const params = keys(e);
    try {
      // TODO: '@typescript-eslint/switch-exhaustiveness-check'を入れてSwitchの条件漏れを確認させる
      switch (funcName) {
        case 'accessManager':
          const memberStatus = apis.accessManager(e);
          return JSON.stringify(memberStatus);
        case 'submitAnswers':
          if (includeAll(params, ['ans', 'freeTxt', 'partyCount', 'bikou'])) {
            const ans = AnsDate.array().parse(e['ans']);
            apis.submitAnswers(
              e,
              ans,
              e['freeTxt'],
              e['partyCount'],
              e['bikou']
            );
            return 'Success';
          }
        case 'decideDates':
          if (includeAll(params, ['infos'])) {
            const infos = PartyInfo.array().parse(e['infos']);
            apis.decideDates(e, infos);
            return 'Success';
          }
      }
    } catch (err) {
      if (err instanceof Error) {
        return `${err.name}: ${err.message}\n${err.stack}`;
      }
      return String(err);
    }
  }

  return '400 BAD REQUEST (Invalid funcName or params)';
}

/** In Source Testing */
if (import.meta.vitest) {
  const { describe, test, expect } = import.meta.vitest;
  describe('frontAPI', async () => {
    // mocks
    const { SpreadsheetApp, Utilities, LockService, Logger } = await import(
      '@research-vacant/mock'
    );
    global.SpreadsheetApp = new SpreadsheetApp();
    global.Utilities = new Utilities();
    global.LockService = new LockService();
    global.Logger = new Logger();

    // apis
    const { accessManager, decideDates, submitAnswers } = await import(
      './access'
    );
    const apis: FrontAPI = {
      accessManager: accessManager,
      submitAnswers: submitAnswers,
      decideDates: decideDates,
    };

    // initialize
    const { migrateEnv } = await import('./migrate');
    migrateEnv();

    test('accessManager_API', () => {
      const res = frontApiFuncs(apis, {
        aId: 'SAMPLE ACCESS ID',
        func: 'accessManager',
      });
      expect(res).toBe(JSON.stringify({ status: 'invalidUser' }));
    });
  });
}
