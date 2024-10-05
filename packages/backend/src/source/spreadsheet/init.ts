import { initConfigSheet } from './config';
import { initMemberSheet } from './members';
import { initSessionSheet } from './session';

/**
 * シートを初期化する
 */
export function initSheet() {
  initMemberSheet();
  initConfigSheet();
  initSessionSheet();
}
