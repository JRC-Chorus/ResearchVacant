import {
  AnsDate,
  Answer,
  MemberStatus,
  PartyInfo,
  ResearchDetails,
} from '@research-vacant/common';
import dayjs from 'dayjs';
import { loadPlaceProps, loadPlaces } from 'backend/source/places/base';
import {
  getAnsweredMemberIDs,
  getAnswerSummary,
  registAnswer,
} from 'backend/source/spreadsheet/answers';
import { getConfig } from 'backend/source/spreadsheet/config';
import {
  getPartys,
  registPartyDate,
} from 'backend/source/spreadsheet/decideRecord';
import { getMembers } from 'backend/source/spreadsheet/members';
import { getSessions, updateSession } from 'backend/source/spreadsheet/session';
import { sendNotifyPartyDate4Teams } from 'backend/source/teams';
import { isMember, parseRecievedIds } from './access/checker';

/**
 * フロントエンドからのアクセスがあったときに，当該アクセスに対するレスポンスを定義
 */
export function accessManager(params: Record<string, string>): MemberStatus {
  const ids = parseRecievedIds(params);
  if (ids === void 0 || !isMember(ids.memberId)) {
    Logger.log(
      `WARN) Accessed by Invalid User (AccessID: ${params}, MemberID: ${ids?.memberId})`
    );
    return { status: 'invalidUser' };
  } else {
    Logger.log(
      `Accessed by member (MemberID: ${ids.memberId}, SessionID: ${ids.sessionId})`
    );
  }

  const answerIds = getAnsweredMemberIDs(ids.sessionId);
  const session = getSessions()[ids.sessionId];
  const summary = getAnswerSummary(session, ids.memberId);
  const isManager = !!getMembers()[ids.memberId].roles?.manager;
  const details: ResearchDetails = {
    researchStartDate: session.startDate,
    researchEndDate: session.endDate,
    partyCount: session.partyCount,
    bikou: session.bikou,
  };

  if (session.status === 'ready') {
    Logger.log('Accessed Status is BeforeOpening');
    return {
      status: 'beforeOpening',
    };
  } else if (
    !answerIds.some((id) => id === ids.memberId) &&
    session.status === 'opening'
  ) {
    Logger.log('Accessed Status is noAns');
    const response = {
      status: 'noAns',
      summary: summary,
      isManager: isManager,
      details: details,
    } as const;
    Logger.log('Response Data');
    Logger.log(response);
    return response;
  } else if (session.status === 'opening') {
    Logger.log('Accessed Status is alreadyAns');
    const response = {
      status: 'alreadyAns',
      summary: summary,
      isManager: isManager,
      details: details,
    } as const;
    Logger.log('Response Data');
    Logger.log(response);
    return response;
  } else if (session.status === 'judge') {
    Logger.log('Accessed Status is judging');
    const targetPlaces = loadPlaces(ids.sessionId);
    const response = {
      status: 'judging',
      isManager: isManager,
      summary: summary,
      places: targetPlaces,
      details: details,
    } as const;
    Logger.log('Response Data');
    Logger.log(response);
    return response;
  } else if (session.status === 'closed') {
    Logger.log('Accessed Status is finished');
    const targetRecord = getPartys()[ids.sessionId];
    const response = {
      status: 'finished',
      isManager: isManager,
      summary: summary,
      partyDates: targetRecord.infos.map((info) => {
        return {
          date: info.date,
          pos: loadPlaceProps(info.placeId),
          ans: summary.ansDates.find((d) => d.date === info.date)?.ans ?? [],
        };
      }),
      details: details,
    } as const;
    Logger.log('Response Data');
    Logger.log(response);
  }

  // 上記以外の状態のアクセスは存在しないが，エラーハンドリングとして無効なユーザーを返す
  return {
    status: 'invalidUser',
  };
}

/**
 * フロントエンドで記入した回答を提出する
 */
export function submitAnswers(
  params: Record<string, string>,
  ans: AnsDate[],
  freeTxt: string,
  partyCount: string,
  bikou: string
) {
  // Check and Get some data
  const ids = parseRecievedIds(params);
  const members = getMembers();
  if (ids === void 0 || !isMember(ids.memberId)) {
    throw new Error('Invalid user is accessed');
  }

  // update session (only enable by manager)
  if (!!getMembers()[ids.memberId].roles?.manager) {
    updateSession(ids.sessionId, undefined, partyCount, bikou);
  }

  // Regist answer
  const answer: Answer = {
    ansDates: ans,
    userId: ids.memberId,
    userName: `${members[ids.memberId].firstName} ${
      members[ids.memberId].lastName
    }`,
    freeText: freeTxt,
  };
  registAnswer(ids.sessionId, answer);
}

/**
 * 開催日を決定した際にフロントエンドから呼び出す関数
 *
 * 当該セッションのステータスを'judge' -> 'closed'とする
 */
export function decideDates(
  params: Record<string, string>,
  infos: PartyInfo[]
) {
  // Check and Get some data
  const ids = parseRecievedIds(params);
  if (ids === void 0 || !isMember(ids.memberId)) {
    throw new Error('Invalid user is accessed');
  }

  // 開催日を登録
  registPartyDate(ids.sessionId, infos);

  // 決定を通知
  const config = getConfig();
  sendNotifyPartyDate4Teams(
    config.teamsLink,
    config.teamsTitle,
    config.teamsDesc,
    infos
  );

  // ステータスを更新
  updateSession(ids.sessionId, 'closed');
}

/** In Source Testing */
if (import.meta.vitest) {
  const { describe, test, expect } = import.meta.vitest;
  describe('accessManager', async () => {
    // mocks
    const { SpreadsheetApp, Utilities, LockService, Logger } = await import(
      '@research-vacant/mock'
    );
    global.SpreadsheetApp = new SpreadsheetApp();
    global.Utilities = new Utilities();
    global.LockService = new LockService();
    global.Logger = new Logger();

    // initialize
    const { migrateEnv } = await import('./migrate');
    migrateEnv();

    // sample member
    const { imitateRegistMember } = await import(
      'backend/source/spreadsheet/members'
    );
    imitateRegistMember({
      id: '',
      firstName: 'サンプル',
      lastName: '太郎',
      mailAddress: 'sample@email.com',
      roles: '',
    });

    // get sample member's data
    const { values } = await import('@research-vacant/common');
    const sampleMember = values(getMembers())[0];

    // start sample session
    // launch new session
    const { sessionChecker } = await import('./research/checker');
    const sampleSession = sessionChecker()[0];
    // ready to get answer
    const { initAnsRecordSheet } = await import(
      'backend/source/spreadsheet/answers'
    );
    initAnsRecordSheet(sampleSession.id);
    // open session
    updateSession(sampleSession.id, 'opening');

    // valid AccessID
    const { encodeAccessID } = await import('./access/accessID');
    const accessId = encodeAccessID(sampleSession.id, sampleMember.id);

    test('invalid AccessID', async () => {
      const memberStatus = await accessManager({
        aId: 'INVALID ACCESS-ID',
      });
      expect(memberStatus.status).toBe('invalidUser');
    });

    test('not answer yet', async () => {
      const memberStatus = await accessManager({
        aId: accessId,
      });
      expect(memberStatus.status).toBe('noAns');
    });

    // create answer
    const { RvDate } = await import('@research-vacant/common');
    const researchRangeCount =
      dayjs(sampleSession.researchRangeEnd).diff(
        sampleSession.researchRangeStart,
        'day'
      ) + 1;
    const _ans1 = [...Array(researchRangeCount)].map((_) => 'OK' as const);
    const _ans2 = [...Array(researchRangeCount)].map((_) => 'NG' as const);
    const genSampleAns: (ans: typeof _ans1 | typeof _ans2) => AnsDate[] = (
      ans
    ) =>
      [...Array(researchRangeCount)].map((_, idx) => {
        return {
          date: RvDate.parse(
            dayjs(sampleSession.researchRangeStart).add(idx, 'day').format()
          ),
          ans: ans[idx],
        };
      });
    const sampleAnswerTxt = 'Dummy free text';

    test('regist answer', async () => {
      submitAnswers(
        { aId: accessId },
        genSampleAns(_ans1),
        sampleAnswerTxt,
        sampleSession.partyCount,
        sampleSession.bikou
      );

      const memberStatus = await accessManager({
        aId: accessId,
      });
      expect(memberStatus.status).toBe('alreadyAns');
    });

    test('answer again', async () => {
      // 変更前
      const memberStatus = await accessManager({
        aId: accessId,
      });
      expect(memberStatus.status).toBe('alreadyAns');
      if ('summary' in memberStatus) {
        expect(memberStatus.summary.ansDates.length).toBe(researchRangeCount);
        expect(memberStatus.summary.ansDates[0].ans[0]).toMatchObject({
          ansPersonNames: ['サンプル 太郎'],
          status: 'OK',
        });
      }

      // 回答を変更
      submitAnswers(
        { aId: accessId },
        genSampleAns(_ans2),
        sampleAnswerTxt,
        sampleSession.partyCount,
        sampleSession.bikou
      );
      const memberStatus2 = await accessManager({
        aId: accessId,
      });
      expect(memberStatus2.status).toBe('alreadyAns');
      if ('summary' in memberStatus2) {
        expect(memberStatus2.summary.ansDates.length).toBe(researchRangeCount);
        expect(memberStatus2.summary.ansDates[0].ans[2]).toMatchObject({
          ansPersonNames: ['サンプル 太郎'],
          status: 'NG',
        });
      }
    });

    // TODO: テストを実装
    test('after closing session (Judging)', () => {});

    // TODO: テストを実装
    test('after closing session (Decided holding date)', () => {});
  });
}
