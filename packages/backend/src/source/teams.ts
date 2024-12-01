import { PartyInfo, SHOWING_DATE_FORMAT } from '@research-vacant/common';
import dayjs from 'dayjs';
import https from 'https';
import { loadPlaceProps } from './places/base';
import { getConfig } from './spreadsheet/config';

/**
 * Teamsへのメッセージ送信の基本関数
 *
 * カードのデザインを作成するツール
 * @url https://www.adaptivecards.io/designer/
 */
async function buildMessage(title: string, infos: PartyInfo[], desc: string) {
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
  const returnObj: any[] = [
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
  ];

  return returnObj;
}

function sendRequest(url: string, data: any) {
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
        console.error(
          `エラーが発生しました: ${res.statusCode}, ${responseBody}`
        );
      }
    });
  });

  req.on('error', (e) => {
    console.error(`リクエストエラー: ${e.message}`);
  });

  req.write(data);
  req.end();
}

/**
 * Teamsで決定した開催日の情報を送信する
 */
export function sendNotifyPartyDate4Teams(infos: PartyInfo[]) {
  const config = getConfig();
  const messageBody = buildMessage(config.teamsTitle, infos, config.teamsDesc);

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

  sendRequest(config.teamsLink, jsonData);
}
