import { FrontAPI, GlobalAPI } from '@research-vacant/common';
import { accessManager, decideDates, submitAnswers } from './core/access';
import { frontApiFuncs } from './core/frontAPI';
import { migrateEnv } from './core/migrate';
// import { constructHomePage } from './core/page';
import { researchManager } from './core/research';

/** フロントエンドに向けたAPI */
const apis: FrontAPI = {
  accessManager: accessManager,
  submitAnswers: submitAnswers,
  decideDates: decideDates,
};

declare const global: GlobalAPI;
// declare const global: FrontAPI;

//////////////////////////////////////////////////////
// フロントエンドがGASで動く場合は下記をすべてコメントイン
//////////////////////////////////////////////////////

/** システムが動作するために実行不可欠な関数 */
global.doGet = (e) => {
  Logger.log(`Parameter: ${JSON.stringify(e.parameter)}`);
  const res = JSON.stringify(frontApiFuncs(apis, e.parameter));
  Logger.log(`Response: ${res}`);
  return ContentService.createTextOutput(res).setMimeType(
    ContentService.MimeType.JSON
  );
};
// global.doGet = constructHomePage;
global.migrateEnv = migrateEnv;
global.researchManager = researchManager;

/** フロントエンドに向けたAPI */
// global.accessManager = accessManager;
// global.submitAnswers = submitAnswers;
// global.decideDates = decideDates;
