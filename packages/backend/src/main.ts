import { declareAPI } from './schema/api';
import { objEach } from './utils/obj/objmap';

/** APIをGASに登録 */
objEach(declareAPI, (k, func) => {
  global[k] = func;
});
