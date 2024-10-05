import { Config, researchFrequencyEnum } from 'backend/schema/db/config';
import { keys } from 'backend/utils/obj/obj';
import { getSheet } from './common';
import { getDefaults } from 'backend/schema/defaultVals';

const CONFIG_SHEET_NAME = '設定';

const configShowingKey: { [key in keyof Config]: string } = {
  teamsLink: '通知したいチャンネルの Teams Webhook リンク',
  researchFrequency: `調査の頻度（${researchFrequencyEnum.join(' / ')}）`,
  answerRange: '調査に対する回答が可能な日数',
  remindDateBeforeEndResearch: 'リマインドは調査終了の何日前に送信するか（`-1`なら送信しない）',
  researchPartyCount: '調査対象の期間における開催回数',
  outerPlacePartyCount: '開催回数のうち，外部施設の利用回数',
  approverRoles: '開催日の承認を担当するロール',
  researchTargetCycle: '調査対象の期間は現在から何サイクル後とするか',
  prohibitReans: '再回答を禁止するか',
  leastRestTime: '最終開催日から最低限開けるべき日数',
  mustAttendRoles: '必ず出席を求めるロール',
  mustAttendOuterPlace: '外部会場の時には出席を求めるロール',
};

let configCache: Config | undefined;

/**
 * 設定シートの初期化
 */
export function initConfigSheet(clearAllData: boolean = false) {
  const sheet = getSheet(CONFIG_SHEET_NAME);

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

  // TODO: 10の部分は２次元配列の最大要素数を指定
  sheet.getRange(1, 1, 10, 2).setValues(writeData);
}

/**
 * 設定内容を読み込み
 */
export function getConfig(): Config {
  if (!configCache) {
    const sheet = getSheet(CONFIG_SHEET_NAME);
    const configKeys = keys(configShowingKey);
    const configVals = sheet
      .getRange(2, 1, 2, configKeys.length)
      .getValues()
      .flat();

    const readConfig = configVals.map((v, idx) => {
      return { [configKeys[idx]]: v };
    });

    configCache = Config.parse(readConfig);
  }

  return configCache;
}
