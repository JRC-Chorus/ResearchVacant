import { PartyInfo, SHOWING_DATE_FORMAT } from '@research-vacant/common';
import dayjs from 'dayjs';
import https from 'https';
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
 */
function sendRequest(url: string, data: any, resolve: () => void) {
  const parsedUrl = new URL(url);
  const options = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.pathname + parsedUrl.search, // パスとクエリパラメータを結合
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    },
  };

  const req = https.request(options, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
      responseBody += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200 || res.statusCode === 202) {
        console.log('メッセージが送信されました');
      } else {
        throw new Error(
          `Teams Webhookの送信でエラーが発生しました: ${res.statusCode}, ${responseBody}`
        );
      }

      resolve();
    });
  });

  req.on('error', (e) => {
    throw new Error(
      `Teams Webhookの送信でリクエストエラーが発生しました: ${e.message}`
    );
  });

  req.write(data);
  req.end();
}

/**
 * Teamsで決定した開催日の情報を送信する
 */
export function sendNotifyPartyDate4Teams(
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
  return new Promise<void>((resolve) =>
    sendRequest(webhookUrl, jsonData, resolve)
  );
}

/** In Source Testing */
if (import.meta.vitest) {
  const { test, describe } = import.meta.vitest;

  describe.skip('teams test', async () => {
    // mocks
    const { Utilities } = await import('@research-vacant/mock');
    global.Utilities = new Utilities();

    test('test sending', async () => {
      const { RvDate } = await import('@research-vacant/common');

      // 環境変数にURLを指定しておく
      const webhookURL = process.env.TEAMS_WEBHOOK_URL ?? '';

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

      // メッセージを送信
      await sendNotifyPartyDate4Teams(webhookURL, title, desc, info);
    });
  });
}
