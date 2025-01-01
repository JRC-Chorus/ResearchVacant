# ResearchVacant

毎月の練習日を部員に問い合わせて，最も適切な日程をシステム管理者に通知するシステム

部員への問い合わせはメールにて実行され，決定した候補日は Teams に通知する

# システム構成

## Requirements

- [Volta](https://volta.sh)：パッケージマネージャーの管理ツール

## 環境構築

1. [インストールページ](https://docs.volta.sh/guide/getting-started)の案内に従って`Volta`をインストールする
2. このリポジトリを`clone`して，リポジトリをカレントディレクトリとする Bash を起動する
3. `yarn install`で必要な依存関係をインストールする
4. `.clasp.json`をこの`README.md`と同じ階層に作成する
   - JRC-Chorus に所属している場合：GoogleDrive に作成済みの`.clasp.json`があるため，ダウンロードして配置（特定キーを含むためリポジトリに含めていない）
   - 一般のユーザーの場合：下記の要領に従って`.clasp.json`を作成する
     1. 自身の GoogleDrive 内に任意の SpreadSheet を作成する
     2. 作成した SpreadSheet を開き，「拡張機能」＞「Apps Script」を選択する
     3. 開いた画面の URL は`https://script.google.com/u/0/home/projects/【ID文字列】/edit`のようになっているはずなので，【ID 文字列】部分をコピーする
     4. 下記のように`.clasp.json`を作成する
        ```json
        {
          "scriptId": "コピーした【ID文字列】",
          "rootDir": "./dist"
        }
        ```
5. `yarn clasp login`で JRC-Chorus のアカウント（一般ユーザーは SpreadSheet を作成したアカウント）にログインする
   - この時，一般ユーザーは GAS を外部から操作できるように，[Google App Script API](https://script.google.com/home/usersettings)を有効にしておく必要がある
   - ログイン時には以下のGoogle App Script関連の権限を許可する
     - Google Apps Script のデプロイの作成と更新 です。
     - Google Apps Script のプロジェクトの作成と更新 です。
6. （一般ユーザーの場合：`yarn push`によってプログラムコードを SpreadSheet 付属の GAS にアップロード）
7. （一般ユーザーの場合：Apps Script の画面にある「デプロイ」からコードをデプロイする）
8. （一般ユーザーの場合：`./package.json`の中の`clasp:deploy`のデプロイ ID を上記デプロイ時の ID に更新する）
9. `yarn open`でデプロイ済みの本ソフトを開く

### 参考記事

- [コストゼロからはじめよう！React + Vite + Google Apps Script で SPA を無料公開: Qiita](https://qiita.com/takatama/items/7253d89e52d816bee739)

## デプロイ

ローカルにある本コードは clasp によって所定の URL にアップロードしたうえで，Google のサーバー上で実行される

コードをアップロードしたい際には`yarn deploy`を実行することで，所定の URL にアプリが公開される

公開前に GAS 上での動作を確認したい際には`yarn push`を実行後，`yarn open`で`@HEAD`を選択することでアップロード後の様子を確認することができる

## 構成全体図

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```
