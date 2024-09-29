import { constructHomePage } from './core/page';
import { FrontAPI } from './schema/api';
import { getSampleData } from './source/spreadsheet/sample';
import { getUrlParams } from './source/urlParam';

declare const global: FrontAPI;

/** APIをGASに登録 */
global.doGet = constructHomePage;
global.getParams = getUrlParams;
global.getSampleData = getSampleData;
