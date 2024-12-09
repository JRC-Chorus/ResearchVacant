import { PartyInfo, SHOWING_DATE_FORMAT } from '@research-vacant/common';
import dayjs from 'dayjs';
import { expect } from 'vitest';
import { loadPlaceProps } from './places/base';

/**
 * Teamsへのメッセージ送信の基本関数
 *
 * カードのデザインを作成するツール
 * @url https://www.adaptivecards.io/designer/
 */
function buildMessage(title: string, infos: PartyInfo[], desc: string) {
  // 場所一覧
  const places = infos.map<any>((info, idx) => {
    const targetPlace = loadPlaceProps(info.placeId);
    return {
      type: 'TextBlock',
      text: `${dayjs(info.date).format(SHOWING_DATE_FORMAT)} ＠${
        targetPlace.placeName
      }`,
      weight: 'Bolder',
      size: 'Large',
      separator: idx === 0,
      horizontalAlignment: 'Center',
      spacing: 'Small',
    };
  });

  // 場所一覧のトップにテキストを追加
  places.unshift({
    type: 'TextBlock',
    text: '開催日',
    weight: 'Bolder',
    horizontalAlignment: 'Center',
  });

  // 返却するスタイル定義
  return [
    {
      type: 'TextBlock',
      text: title,
      wrap: true,
      size: 'large',
      weight: 'bolder',
    },
    {
      type: 'Container',
      items: places,
      backgroundImage: {
        fillMode: 'Repeat',
        horizontalAlignment: 'Center',
        verticalAlignment: 'Center',
      },
      style: 'accent',
    },
    {
      type: 'TextBlock',
      text: desc,
      wrap: true,
    },
    // {
    //   type: 'TextBlock',
    //   text: '参加予定者',
    //   weight: 'Bolder',
    //   spacing: 'Large',
    //   wrap: true,
    // },
    // {
    //   type: 'TextBlock',
    //   text: '田中 太郎',
    //   separator: true,
    //   wrap: true,
    // },
    // {
    //   type: 'TextBlock',
    //   text: '佐藤 次郎',
    //   spacing: 'None',
    //   wrap: true,
    // },
  ];
}

/**
 * 構成したAPI要求をHTTPSで通信する
 *
 * cf) テスト用にAwaitを付けているが，実際には同期的に処理されるため，本番実装においてはAwaitは効果を発揮しない
 */
async function sendRequest(url: string, data: any) {
  const res = await UrlFetchApp.fetch(url, {
    method: 'post',
    muteHttpExceptions: true,
    contentType: 'application/json',
    payload: data,
  });

  // 送信ステータスの確認
  if (res.getResponseCode() === 200 || res.getResponseCode() === 202) {
    return;
  } else {
    throw new Error(
      `Teams Webhookの送信でエラーが発生しました: ${res.getResponseCode()}, ${res.getContentText()}`
    );
  }
}

/**
 * Teamsで決定した開催日の情報を送信する
 */
export async function sendNotifyPartyDate4Teams(
  webhookUrl: string,
  title: string,
  desc: string,
  infos: PartyInfo[]
) {
  // メッセージ領域を構築
  const messageBody = buildMessage(title, infos, desc);

  // APIデータを構成
  const jsonData = JSON.stringify({
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: {
          $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
          version: '1.5',
          type: 'AdaptiveCard',
          body: messageBody,
        },
      },
    ],
  });

  // API通信
  await sendRequest(webhookUrl, jsonData);
}

/** In Source Testing */
if (import.meta.vitest) {
  const { test, describe } = import.meta.vitest;

  describe.skip('teams test', async () => {
    // mocks
    const { Utilities, UrlFetchApp } = await import('@research-vacant/mock');
    global.Utilities = new Utilities();
    global.UrlFetchApp = new UrlFetchApp();

    test('test sending', async () => {
      const { RvDate } = await import('@research-vacant/common');

      // 環境変数にURLを指定しておく
      const webhookURL = process.env.TEAMS_WEBHOOK_URL ?? '';
      expect(webhookURL !== '').toBe(true); // ここでエラーの時には，環境変数にテスト用WebhookのURLを登録する

      // ダミーデータを作成
      const title = '日程調整結果（テストから送信）';
      const desc = 'テストから送信\n\n記載事項に意味なし';
      const samplePlaces = loadPlaceProps();
      const info: PartyInfo[] = [
        {
          date: RvDate.parse('2024-10-10'),
          placeId: samplePlaces[0].placeId,
        },
      ];

      // メッセージを送信（Mockは非同期で処理するためAwait必須 / 本番実装は同期処理のためAwait不要）
      await sendNotifyPartyDate4Teams(webhookURL, title, desc, info);
    });
  });
}
