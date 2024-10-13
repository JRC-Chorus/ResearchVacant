import { randomIntegerWithLength } from './_utils';
import { UserClass } from './User';

/**
 * Session Base Class
 * @link https://developers.google.com/apps-script/reference/base/session
 */
export default class Session {
  static getActiveUser(): UserClass {
    return new UserClass('activeuser@example.com');
  }

  static getActiveUserLocale(): string {
    return 'en';
  }

  static getEffectiveUser(): UserClass {
    return new UserClass('activeuser@example.com');
  }

  static getScriptTimeZone(): string {
    return 'GMT';
  }

  static getTemporaryActiveUserKey(): string {
    return 'auKey_' + String(randomIntegerWithLength(16));
  }
}
