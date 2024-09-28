import { constructHomePage } from './core/page';
import { FrontAPI } from './schema/api';
import { getSampleData } from './source/spreadsheet/sample';
import { getUrlParams } from './source/urlParam';
import { objEach } from './utils/obj/objmap';

const declareAPI: FrontAPI = {
  doGet: constructHomePage,
  getParams: getUrlParams,
  getSampleData: getSampleData,
};

/** APIをGASに登録 */
objEach(declareAPI, (k, func) => {
  global[k] = func;
});
