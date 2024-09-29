# ResearchVacant

毎月の練習日を部員に問い合わせて，最も適切な日程をシステム管理者に通知するシステム

部員への問い合わせはメールにて実行され，決定した候補日はTeamsに通知する



# システム構成

## Requirements
- [Volta](https://volta.sh)：パッケージマネージャーの管理ツール


## 環境構築
1. [インストールページ](https://docs.volta.sh/guide/getting-started)の案内に従って`Volta`をインストールする
2. 下記のモジュールを`npm install -g <module_name>`でグローバルインストールする
   - `@google/clasp`
3. このリポジトリを`clone`して，リポジトリをカレントディレクトリとするBashを起動する
4. `yarn install`で必要な依存関係をインストールする
5. `.clasp.json`をこの`README.md`と同じ階層に作成する
   - JRC-Chorusに所属している場合：GoogleDriveに作成済みの`.clasp.json`があるため，ダウンロードして配置（特定キーを含むためリポジトリに含めていない）
   - 一般のユーザーの場合：下記の要領に従って`.clasp.json`を作成する
     1. 自身のGoogleDrive内に任意のSpreadSheetを作成する
     2. 作成したSpreadSheetを開き，「拡張機能」＞「Apps Script」を選択する
     3. 開いた画面のURLは`https://script.google.com/u/0/home/projects/【ID文字列】/edit`のようになっているはずなので，【ID文字列】部分をコピーする
     4. 下記のように`.clasp.json`を作成する
        ```json
        {
          "scriptId": "コピーした【ID文字列】",
          "rootDir": "./dist"
        }
        ```
6. `clasp login`でJRC-Chorusのアカウント（一般ユーザーはSpreadSheetを作成したアカウント）にログインする
7. （一般ユーザーの場合：`yarn push`によってプログラムコードをSpreadSheet付属のGASにアップロード）
8. （一般ユーザーの場合：Apps Scriptの画面にある「デプロイ」からコードをデプロイする）
9. （一般ユーザーの場合：`./package.json`の中の`clasp:deploy`のデプロイIDを上記デプロイ時のIDに更新する）
10. `yarn open`でデプロイ済みの本ソフトを開く

### 参考記事
- [コストゼロからはじめよう！React + Vite + Google Apps ScriptでSPAを無料公開: Qiita](https://qiita.com/takatama/items/7253d89e52d816bee739)


## デプロイ
ローカルにある本コードはclaspによって所定のURLにアップロードしたうえで，Googleのサーバー上で実行される

コードをアップロードしたい際には`yarn deploy`を実行することで，所定のURLにアプリが公開される

公開前にGAS上での動作を確認したい際には`yarn push`を実行後，`yarn open`で`@HEAD`を選択することでアップロード後の様子を確認することができる


## 構成全体図

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```