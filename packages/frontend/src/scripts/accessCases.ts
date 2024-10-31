import {
  AnswerSummary,
  CheckedOuterPlace,
  deepcopy,
  Member,
  MemberID,
  MemberStatus,
  OuterPlace,
  pickRandom,
  RvDate,
} from '@research-vacant/common';

/**
 * 回答対象日
 */
const defaultAnsDates: AnswerSummary['ansDates'] = [
  { date: RvDate.parse('2024-10-1'), ans: [] },
  { date: RvDate.parse('2024-10-2'), ans: [] },
  { date: RvDate.parse('2024-10-3'), ans: [] },
  { date: RvDate.parse('2024-10-4'), ans: [] },
  { date: RvDate.parse('2024-10-5'), ans: [] },
  { date: RvDate.parse('2024-10-6'), ans: [] },
  { date: RvDate.parse('2024-10-7'), ans: [] },
  { date: RvDate.parse('2024-10-8'), ans: [] },
  { date: RvDate.parse('2024-10-9'), ans: [] },
  { date: RvDate.parse('2024-10-10'), ans: [] },
  { date: RvDate.parse('2024-10-11'), ans: [] },
  { date: RvDate.parse('2024-10-12'), ans: [] },
  { date: RvDate.parse('2024-10-13'), ans: [] },
  { date: RvDate.parse('2024-10-14'), ans: [] },
  { date: RvDate.parse('2024-10-15'), ans: [] },
  { date: RvDate.parse('2024-10-16'), ans: [] },
  { date: RvDate.parse('2024-10-17'), ans: [] },
  { date: RvDate.parse('2024-10-18'), ans: [] },
];

/**
 * ダミーメンバー
 */
const sampleMember: Member = {
  id: MemberID.parse('1ef26ba4-f7b6-4616-9da6-263223fef29b'),
  firstName: 'サンプル',
  lastName: '太郎',
  mailAddress: 'sample-taro@email.com',
};

/**
 * ダミー施設
 */
const samplePlace: CheckedOuterPlace = {
  placeName: 'サンプル施設',
  placeURL: 'https://github.com/JRC-Chorus/ResearchVacant',
  isNeedReserve: true,
  vacantInfo: getRandomAns(),
};

/**
 * デフォルトで指定した日付群に対して，適当な回答を付与した回答群を生成
 */
function getRandomAns() {
  return defaultAnsDates.map((defaultAns) => {
    return {
      date: defaultAns.date,
      ans: pickRandom(['OK', 'NG', 'Pending'] as const),
    };
  });
}

/**
 * accessManagerの戻り値を生成する（開発用のダミーデータを生成）
 */
export function loadAccessMock(status: MemberStatus['status']): MemberStatus {
  switch (status) {
    case 'noAns':
      return {
        status,
        summary: {
          ansDates: defaultAnsDates,
          freeTxts: [],
        },
      };
    case 'alreadyAns':
      return {
        status,
        summary: {
          ansDates: defaultAnsDates,
          selfAns: {
            userId: sampleMember.id,
            userName: `${sampleMember.firstName} ${sampleMember.lastName}`,
            freeText: '前回の入力',
            ansDates: getRandomAns(),
          },
          freeTxts: [],
        },
      };
    case 'finished':
      return {
        status,
        summary: {
          ansDates: defaultAnsDates,
          freeTxts: [],
        },
        partyDates: [
          {
            date: defaultAnsDates[7].date,
            ans: [
              {
                status: 'OK',
                ansPersonNames: [
                  `${sampleMember.firstName} ${sampleMember.lastName}`,
                ],
              },
              {
                status: 'NG',
                ansPersonNames: [],
              },
              {
                status: 'Pending',
                ansPersonNames: [],
              },
            ],
            pos: OuterPlace.parse(samplePlace),
          },
        ],
      };
    case 'judging':
      // 適当にデータを追加
      const judgingAnsDates = deepcopy(defaultAnsDates).map((ans) => {
        ans.ans.push({
          status: pickRandom(['OK', 'NG', 'Pending'] as const),
          ansPersonNames: [
            `${sampleMember.firstName} ${sampleMember.lastName}`,
          ],
        });
        return ans;
      });
      return {
        status,
        summary: {
          ansDates: judgingAnsDates,
          freeTxts: [],
        },
        isManager: true,
        places: [samplePlace],
      };
    case 'invalidUser':
    case 'beforeOpening':
      return { status };
  }
}
