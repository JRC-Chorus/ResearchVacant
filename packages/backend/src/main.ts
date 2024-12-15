import { FrontAPI } from '@research-vacant/common';
import { accessManager, decideDates, submitAnswers } from './core/access';
import { migrateEnv } from './core/migrate';
// import { constructHomePage } from './core/page';
import { researchManager } from './core/research';

declare const global: FrontAPI;

/** システムが動作するために実行不可欠な関数 */
// global.doGet = constructHomePage;
global.migrateEnv = migrateEnv;
global.researchManager = researchManager;

/** フロントエンドに向けたAPI */
global.accessManager = accessManager;
global.submitAnswers = submitAnswers;
global.decideDates = decideDates;
