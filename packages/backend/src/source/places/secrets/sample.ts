import {
  AnsDate,
  CheckedOuterPlace,
  OuterPlace,
  PlaceID,
  RvDate,
} from '@research-vacant/common';
import { Dayjs } from 'dayjs';

const BASE_INFO: OuterPlace = {
  placeName: '部室（サンプル開催場所）',
  placeURL: 'https://github.com/JRC-Chorus/ResearchVacant',
  isNeedReserve: false,
};
let samplePlace: OuterPlace & { placeId: PlaceID };

/**
 * 開催場所の定義サンプル（施設の空き状況情報なし）
 */
export function getSamplePlaceWithVacants(
  genId: (p: OuterPlace) => PlaceID,
  targetDates: Dayjs[]
): CheckedOuterPlace {
  const isVacants = getVacantInfo(targetDates);
  return Object.assign(BASE_INFO, {
    placeId: genId(BASE_INFO),
    vacantInfo: isVacants,
  });
}

/**
 * 開催場所の定義サンプル（施設の空き状況情報なし）
 */
export function getSamplePlace(genId: (p: OuterPlace) => PlaceID) {
  if (!samplePlace) {
    samplePlace = Object.assign(BASE_INFO, { placeId: genId(BASE_INFO) });
  }
  return samplePlace;
}

/**
 * 施設の空き状況取得
 */
function getVacantInfo(targetDates: Dayjs[]): AnsDate[] {
  // 外部API等から空き日程を取得する
  const isVacants = targetDates.map((d) => getIsVacant(d));

  // 体裁を整えて返す
  return targetDates.map((d, idx) => {
    return {
      date: RvDate.parse(d.format()),
      ans: isVacants[idx] ? 'OK' : 'NG',
    };
  });
}

/**
 * 特定の日付の空き状況を取得する（API取得に100msかかる想定）
 */
function getIsVacant(date: Dayjs) {
  Utilities.sleep(100);
  return true;
}
