import {
  AnsDate,
  AnsStatus,
  Answer,
  AnswerSummary,
  fromEntries,
  keys,
  MemberID,
  RvDate,
  Session,
  SessionID,
  toEntries,
  values,
} from '@research-vacant/common';
import dayjs from 'dayjs';
import { getSheet, warpLock } from './common';

const ansHeader: Record<keyof Answer, string> = {
  userId: 'メンバーID',
  userName: '氏名',
  freeText: '自由記述',
  ansDates: '回答結果',
};
let cachedAnswers: Record<MemberID, Answer> | undefined;

/**
 * 回答記録シートの初期化
 */
export function initAnsRecordSheet(
  sessionId: SessionID,
  clearAllData: boolean = false
) {
  warpLock(() => __initAnsRecordSheet(sessionId, clearAllData));
}

function __initAnsRecordSheet(
  sessionId: SessionID,
  clearAllData: boolean = false
) {
  // gen sheet
  const ansSheet = getSheet(sessionId, true);

  // 既存のデータをすべて削除
  if (clearAllData) {
    ansSheet.clear();
  }

  // write header text
  const headerVals = values(ansHeader);
  ansSheet.getRange(1, 1, 1, headerVals.length).setValues([headerVals]);
}

/**
 * 回答記録シートの読み取り
 */
function getAnswers(
  sessionId: SessionID,
  loadForce: boolean = false
): Record<MemberID, Answer> {
  if (!cachedAnswers || loadForce) {
    const sheet = getSheet(sessionId);

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      cachedAnswers = {};
    } else {
      // 元データを取得
      const srcData = sheet
        .getRange(2, 1, lastRow - 1, keys(ansHeader).length)
        .getValues();
      // 日付一覧が何列目にあるか
      const ansDatesIdx = keys(ansHeader).findIndex((k) => k === 'ansDates');
      // 回答一覧に整形
      const answers = srcData.map((line) =>
        Answer.parse(
          fromEntries(
            toEntries(ansHeader).map(([k, v], idx) => {
              // 日付一覧のみ特殊処理
              if (idx === ansDatesIdx) {
                const parsed = AnsDate.array().parse(
                  JSON.parse(line[ansDatesIdx])
                );
                return [k, parsed];
              } else {
                return [k, line[idx]];
              }
            })
          )
        )
      );
      cachedAnswers = fromEntries(answers.map((ans) => [ans.userId, ans]));
    }
  }

  return cachedAnswers;
}

/**
 * 回答済みのメンバーID一覧
 */
export function getAnsweredMemberIDs(sessionId: SessionID) {
  return keys(getAnswers(sessionId));
}

/**
 * 回答結果のサマリを提示
 *
 * 回答の生データは返さない（フロントエンドにデータ処理を行わせない）
 */
export function getAnswerSummary(
  session: Session,
  accessedMemberId: MemberID
): AnswerSummary {
  const answers = values(getAnswers(session.id));

  const returnSummary: AnswerSummary = {
    ansDates: [],
    freeTxts: [],
  };
  const selfAns: Answer | undefined = answers.find(
    (a) => a.userId === accessedMemberId
  );

  // 初期化
  const tmpAnsDates: Record<RvDate, Record<AnsStatus, string[]>> = fromEntries(
    [...Array(dayjs(session.endDate).diff(session.startDate, 'day'))].map(
      (_, idx) => [
        RvDate.parse(dayjs(session.startDate).add(idx, 'day').format()),
        fromEntries(AnsStatus.map((status) => [status, []])),
      ]
    )
  );
  // 回答を登録
  answers.forEach((userAns) => {
    // 日付の回答者を登録
    userAns.ansDates.forEach((ans) => {
      if (keys(tmpAnsDates).some((d) => d === ans.date)) {
        tmpAnsDates[ans.date][ans.ans].push(userAns.userName);
      }
    });

    // 自由記述
    if (userAns.freeText !== '') {
      returnSummary.freeTxts.push({
        txt: userAns.freeText,
        ansName: userAns.userName,
      });
    }
  });

  // 日付一覧を整形して登録
  returnSummary.ansDates = toEntries(tmpAnsDates).map(([date, ansStatus]) => {
    const ans = toEntries(ansStatus).map(([status, names]) => {
      return {
        status: status,
        ansPersonNames: names,
      };
    });
    return { date, ans };
  });

  // 自身の回答が存在する場合は登録
  if ((selfAns?.ansDates.length ?? 0) > 0) {
    returnSummary.selfAns = selfAns;
  }

  return returnSummary;
}

/**
 * 回答一覧をSpreadSheetに書き込み
 *
 * 引数で書き込みたい一覧を渡してのキャッシュ更新もできるが，渡さない場合はキャッシュが書き込まれる
 *
 * cf) ここではすべてのデータを毎回書き換える実装としているが，書き換えのサーバー処理より通信の方が実行時間は支配的になると考えてこのままにしている．
 * 遅延が目立つ場合には，書き込むデータをアップデートしたいデータのみに絞る実装に変更．
 */
function writeAnswers(
  sessionId: SessionID,
  answers?: Record<MemberID, Answer>
) {
  if (answers) {
    cachedAnswers = answers;
  }
  if (!cachedAnswers) {
    throw new Error('No writable answer data');
  }

  // initialize
  initAnsRecordSheet(sessionId, true);

  // write new data
  const headerKeys = keys(ansHeader);
  const writeData = values(cachedAnswers).map((s) =>
    // 日付はオブジェクト状態でデータベースに格納するため，文字列化して書き込む
    headerKeys.map((k) => {
      if (k === 'ansDates') {
        return JSON.stringify(s[k]);
      } else {
        return s[k];
      }
    })
  );
  const sheet = getSheet(sessionId);
  sheet
    .getRange(2, 1, writeData.length, headerKeys.length)
    .setValues(writeData);
}

/**
 * 回答を登録 / 更新
 */
export function registAnswer(sessionId: SessionID, record: Answer) {
  // update cache
  const answers = getAnswers(sessionId);
  answers[record.userId] = record;

  // write for db
  warpLock(() => writeAnswers(sessionId, answers));
}

/** In Source Testing */
if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  test('jsonParseTest', () => {
    const sampleTxt = '[1,"い","う"]';

    const parsed: string[] = JSON.parse(sampleTxt);
    const reParsed = JSON.stringify(parsed);

    expect(reParsed).toBe(sampleTxt);
    expect(parsed.length).toBe(3);
    expect(parsed[1]).toBe('い');
  });

  test('sortTest', () => {
    const sample = {
      '2024-01-01': 1,
      '2024-03-10': 10,
      '2024-02-05': 100,
    };

    const ordered = fromEntries(toEntries(sample).sort());
    expect(keys(ordered)).toMatchObject([
      '2024-01-01',
      '2024-02-05',
      '2024-03-10',
    ]);
  });
}
