import { constructHomePage } from './core/page';
import { researchManager } from './core/research';
import { FrontAPI } from './schema/api';
import { getSampleData } from './source/spreadsheet/sample';
import { getUrlParams } from './source/urlParam';

declare const global: FrontAPI;

/** APIをGASに登録 */
global.doGet = constructHomePage;
global.getParams = getUrlParams;
global.researchManager = researchManager;

/** サンプルAPI（本番時には元の関数を含めて削除） */
global.getSampleData = getSampleData;
