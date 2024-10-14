import type Trigger from './Trigger';
import ClockTriggerBuilder from './Triggers/ClockTriggerBuilder';
import TriggerBuilder from './Triggers/TriggerBuilder';

// Setup triggers so they remian constant to scope
const _triggers: Trigger[] = [];

/**
 * ScriptApp
 * @link https://developers.google.com/apps-script/reference/script/script-app
 */
export default class ScriptApp {
  static getProjectTriggers(): Trigger[] {
    return _triggers;
  }

  static getUserTriggers(): Trigger[] {
    return _triggers;
  }

  static newTrigger(functionName: string): TriggerBuilder {
    const pusher = (trigger: Trigger) => _triggers.push(trigger);

    return new TriggerBuilder(functionName, pusher);
  }

  static deleteTrigger(trigger: Trigger): void {}
}

/** In Source Testing */
if (import.meta.vitest) {
  const { test, expect, describe, it } = import.meta.vitest;

  describe('ScriptApp', async () => {
    describe('newTrigger', () => {
      it('should create a new TriggerBuilder', () => {
        const actual = ScriptApp.newTrigger('foobar');

        expect(actual).toBeInstanceOf(TriggerBuilder);
      });

      it('should return a new ClockTriggerBuilder with timeBased() triggers', () => {
        const actual = ScriptApp.newTrigger('foobar').timeBased();

        expect(actual).toBeInstanceOf(ClockTriggerBuilder);
      });
    });

    describe('getProjectTriggers', () => {
      it('should return an array of Trigger instances of created triggers', () => {
        const t1 = ScriptApp.newTrigger('foobar').timeBased().create();
        const t2 = ScriptApp.newTrigger('nope_not_real').timeBased().create();
        const triggers = ScriptApp.getProjectTriggers();

        expect(triggers.length).toEqual(2);
      });
    });
  });
}
