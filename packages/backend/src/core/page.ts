import { registerUrlParam } from 'backend/source/urlParam';

/** ブラウザのタブに表示されるページタイトル */
const pageTitle = 'JRC Chorus -練習日程調整-';
/** アイコンとして参照する画像のURL（一般的なHPのように<header>をHTMLファイルに入れることはできない） */
const iconUrl = 'https://cdn.quasar.dev/logo-v2/favicon/favicon.ico';

export function constructHomePage(e: any) {
  registerUrlParam(e);
  return HtmlService.createHtmlOutputFromFile('index.html')
    .setTitle(pageTitle)
    .setFaviconUrl(iconUrl)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
