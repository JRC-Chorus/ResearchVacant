import {
  CheckedOuterPlace,
  keys,
  OuterPlace,
  PlaceID,
  RvDate,
  SessionID,
  values,
} from '@research-vacant/common';
import dayjs, { Dayjs } from 'dayjs';
import { encodeHash } from '../hash';
import { getSessions } from '../spreadsheet/session';
import { getSamplePlace, getSamplePlaceWithVacants } from './secrets/sample';

type DateRange = [RvDate, RvDate];
type PlaceGetter = {
  getObj: () => OuterPlace & { placeId: PlaceID };
  withVacant: (
    genId: (p: OuterPlace) => PlaceID,
    targetDates: Dayjs[]
  ) => CheckedOuterPlace;
};

/**
 * システムに登録済みの施設一覧
 *
 * 実際に使用時は「サンプル施設」を本番用に編集して利用
 */
const ALL_PLACE_GETTERS: PlaceGetter[] = [
  {
    getObj: () => getSamplePlace(placeIdGen),
    withVacant: getSamplePlaceWithVacants,
  },
];

/**
 * 施設情報を基にPlaceIDを生成する
 */
function placeIdGen(place: OuterPlace): PlaceID {
  const pId = encodeHash(Utilities.DigestAlgorithm.SHA_256, place);

  return PlaceID.parse(pId);
}

/**
 * 期間内の日付一覧を返す
 */
function getTargetDateRangeList(targetDateRange: DateRange) {
  const startDay = dayjs(targetDateRange[0]);
  const endDay = dayjs(targetDateRange[1]);
  const dateCount = endDay.diff(startDay, 'day');
  return [...Array(dateCount + 1)].map((_, idx) => startDay.add(idx, 'day'));
}

/**
 * 指定した日付の区間における施設利用可否情報を含む施設情報を返す
 *
 * 読込予定の施設がない際には「サンプル施設」を返す
 */
export function loadPlaces(sessionId: SessionID): CheckedOuterPlace[] {
  const targetSessoin = getSessions()[sessionId];
  const targetDateRange: DateRange = [
    targetSessoin.researchRangeStart,
    targetSessoin.researchRangeEnd,
  ];

  return ALL_PLACE_GETTERS.map((getter) =>
    getter.withVacant(placeIdGen, getTargetDateRangeList(targetDateRange))
  );
}

/**
 * PlaceIDで指定された施設の情報を取得する（空き情報は取得しない）
 */
export function loadPlaceProps(): (OuterPlace & { placeId: PlaceID })[];
export function loadPlaceProps(placeId: PlaceID): OuterPlace;
export function loadPlaceProps(placeId?: PlaceID) {
  const places = ALL_PLACE_GETTERS.map((getter) => getter.getObj());
  if (placeId) {
    return OuterPlace.parse(places.find((p) => p.placeId === placeId));
  } else {
    return places;
  }
}

/** In Source Testing */
if (import.meta.vitest) {
  const { test, expect, describe } = import.meta.vitest;
  describe('place', async () => {
    // dynamic import
    const { LockService, SpreadsheetApp, Utilities } = await import(
      '@research-vacant/mock'
    );
    const { migrateEnv } = await import('backend/core/migrate');
    const { researchManager } = await import('backend/core/research');

    // Mocks
    global.LockService = new LockService();
    global.SpreadsheetApp = new SpreadsheetApp();
    global.Utilities = new Utilities();

    // initialize research env
    migrateEnv();
    researchManager();

    // set target session
    const targetSession = getSessions();
    const targetSessionId = keys(targetSession)[0];
    const startDate = values(targetSession)[0].researchRangeStart;
    const endDate = values(targetSession)[0].researchRangeEnd;

    test('dummyPlace', async () => {
      // run checker
      const testPlace = (await loadPlaces(targetSessionId))[0];

      // test results
      expect(testPlace.placeId).toBe(
        'a88f9f8df7331dbb048efafbf7453232a10df98e755793094de5ea8a8c2c60b0'
      );
      expect(testPlace.vacantInfo[0]).toMatchObject({
        date: startDate,
        ans: 'OK',
      });
      expect(
        testPlace.vacantInfo[testPlace.vacantInfo.length - 1]
      ).toMatchObject({
        date: endDate,
        ans: 'OK',
      });
    });
  });
}
