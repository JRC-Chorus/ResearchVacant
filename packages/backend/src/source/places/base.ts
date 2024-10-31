import { AnsDate, RvDate, SessionID } from '@research-vacant/common';
import dayjs, { Dayjs } from 'dayjs';
import { getSessions } from '../spreadsheet/session';

type DateRange = [RvDate, RvDate];

export abstract class Place {
  /** 施設名 */
  abstract placeName: string;
  /** 施設情報に関するURL（地図や公式HP等） */
  abstract placeURL?: string;
  /** 予約が必要な施設か？（必要な場合，予約を促すダイアログを表示する） */
  abstract isNeedReserve: boolean;

  /** 取得する日付の範囲 */
  protected targetDateRange: DateRange;

  constructor(targetDateRange: DateRange) {
    this.targetDateRange = targetDateRange;
  }

  /** 期間内の日付一覧を返す */
  protected getTargetDateRangeList() {
    const startDay = dayjs(this.targetDateRange[0]);
    const endDay = dayjs(this.targetDateRange[1]);
    const dateCount = endDay.diff(startDay, 'day');
    return [...Array(dateCount + 1)].map((_, idx) => startDay.add(idx, 'day'));
  }

  /** 取得した情報に基づいて，施設の空き日程の一覧を返す */
  abstract getVacantInfo(): Promise<AnsDate[]>;
}

/**
 * 指定した日付の区間における施設利用可否情報を含む施設情報を返す
 *
 * TODO: 運用コードに差替え
 */
export function loadPlaces(sessionId: SessionID) {
  const targetSessoin = getSessions()[sessionId];
  const targetDateRange: DateRange = [
    targetSessoin.researchRangeStart,
    targetSessoin.researchRangeEnd,
  ];
  return [new SamplePlace(targetDateRange)];
}

/**
 * 開催場所の定義サンプル
 */
class SamplePlace extends Place {
  placeName: string = '部室（サンプル開催場所）';
  placeURL?: string | undefined =
    'https://github.com/JRC-Chorus/ResearchVacant';
  isNeedReserve: boolean = false;

  async getVacantInfo(): Promise<AnsDate[]> {
    // 対象の日付一覧を取得
    const allDate = this.getTargetDateRangeList();

    // 外部API等から空き日程を取得する
    const isVacants = await Promise.all(
      allDate.map((d) => this.getIsVacant(d))
    );

    // 体裁を整えて返す
    return allDate.map((d, idx) => {
      return {
        date: RvDate.parse(d.format()),
        ans: isVacants[idx] ? 'OK' : 'NG',
      };
    });
  }

  /** 特定の日付の空き状況を取得する（API取得に100msかかる想定） */
  protected getIsVacant(date: Dayjs) {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(true), 100);
    });
  }
}

/** In Source Testing */
if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  test('dummyPlace', async () => {
    // define obj
    const startDate = RvDate.parse('2024-10-1');
    const endDate = RvDate.parse('2024-10-31');
    const place = new SamplePlace([startDate, endDate]);

    // run checker
    const vacants = await place.getVacantInfo();

    // test results
    expect(vacants[0]).toMatchObject({
      date: startDate,
      ans: 'OK',
    });
    expect(vacants[vacants.length - 1]).toMatchObject({
      date: endDate,
      ans: 'OK',
    });
  });
}
