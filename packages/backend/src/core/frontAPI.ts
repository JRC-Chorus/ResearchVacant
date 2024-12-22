import { AnsDate, FrontAPI, keys, PartyInfo } from '@research-vacant/common';
import { getUrlParams } from 'backend/source/urlParam';

const includeAll = <T>(targetArray: T[], searchElements: T[]) =>
  targetArray.every((target) => searchElements.includes(target));

export function frontApiFuncs(apis: FrontAPI, e: Record<string, string>) {
  const tmpFuncName = getUrlParams(e)?.funcName;
  const funcName = keys(apis).find((fName) => fName === tmpFuncName);

  if (funcName) {
    const params = keys(e);
    try {
      // TODO: '@typescript-eslint/switch-exhaustiveness-check'を入れてSwitchの条件漏れを確認させる
      switch (funcName) {
        case 'accessManager':
          return apis.accessManager(e);
        case 'submitAnswers':
          if (includeAll(params, ['ans', 'freeTxt', 'partyCount', 'bikou'])) {
            const ans = AnsDate.array().parse(e['ans']);
            return apis.submitAnswers(
              e,
              ans,
              e['freeTxt'],
              e['partyCount'],
              e['bikou']
            );
          }
        case 'decideDates':
          if (includeAll(params, ['infos'])) {
            const infos = PartyInfo.array().parse(e['infos']);
            return apis.decideDates(e, infos);
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
