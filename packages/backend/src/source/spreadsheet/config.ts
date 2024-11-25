import {
  Config,
  fromEntries,
  getDefaults,
  keys,
  researchFrequencyEnum,
} from '@research-vacant/common';
import { getSheet, warpLock } from './common';

const CONFIG_SHEET_NAME = '設定';

const configShowingKey: { [key in keyof Config]: string } = {
  webappUrl: '公開中のアプリのリンク（必須）',
  teamsLink: '通知したいチャンネルの Teams Webhook リンク',
  researchFrequency: `調査の頻度（${researchFrequencyEnum.join(' / ')}）`,
  answerRange: '調査に対する回答が可能な日数',
  remindDateBeforeEndResearch:
    'リマインドは調査終了の何日前に送信するか（`-1`なら送信しない）',
  researchPartyCount: '調査対象の期間における開催回数',
  researchGlobalComment: '調査画面における備考欄に表示するコメント',
  approverRoles: '開催日の承認を担当するロール',
  researchTargetCycle: '調査対象の期間は現在から何サイクル後とするか',
  prohibitReans: '再回答を禁止するか',
  mustAttendRoles: '必ず出席を求めるロール',
  announceAnswerMailSubject: '下記依頼メールの件名',
  announceAnswerMail:
    '各調査の一番最初に回答を依頼するために送信するメールの文面',
  remindMailSubject: '下記リマインドメールの文面',
  remindMail: '依頼済みの調査のリマインドメールの文面',
  requestApproveMailSubject: '下記承認メールの文面',
  requestApproveMail:
    '管理者に調査結果を通知し，開催日承認を依頼するメールの文面',
  announceDecidedDateNotice: '決定した開催日をTeamsで通知する際のTeamsの文面',
};

let configCache: Config | undefined;

/**
 * 設定シートの初期化
 */
export function initConfigSheet(clearAllData: boolean = false) {
  warpLock(() => __initConfigSheet(clearAllData));
}

function __initConfigSheet(clearAllData: boolean = false) {
  const sheet = getSheet(CONFIG_SHEET_NAME, true);

  // 既存のデータをすべて削除
  if (clearAllData) {
    sheet.clear();
  }

  // 初期値を定義
  const initConfig = getDefaults(Config);
  const writeData = keys(configShowingKey).map((k) => {
    if (typeof initConfig[k] === 'object') {
      return [configShowingKey[k], ...initConfig[k]];
    } else {
      return [configShowingKey[k], initConfig[k]];
    }
  });

  sheet.getRange(1, 1, writeData.length, 2).setValues(writeData);
}

/**
 * 設定内容を読み込み
 */
export function getConfig(): Config {
  if (!configCache) {
    const sheet = getSheet(CONFIG_SHEET_NAME);
    const configKeys = keys(configShowingKey);
    const maxDataSize = sheet.getLastColumn() - 1;
    const configVals = sheet
      .getRange(1, 2, configKeys.length, maxDataSize)
      .getValues();

    const readConfig = fromEntries(
      configVals.map((v, idx) => {
        const filteredVal = v.filter((v) => v !== void 0);
        return [
          configKeys[idx],
          filteredVal.length === 1 ? filteredVal[0] : filteredVal,
        ];
      })
    );

    configCache = Config.parse(readConfig);
  }

  return configCache;
}

/** In Source Testing */
if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  test('config sheet', async () => {
    const { SpreadsheetApp, LockService } = await import('@research-vacant/mock');
    global.SpreadsheetApp = new SpreadsheetApp();
    global.LockService = new LockService()

    // initialize
    initConfigSheet();

    const defaultConfig = getDefaults(Config);
    expect(getConfig().researchPartyCount).toBe(
      defaultConfig.researchPartyCount
    );
  });
}
