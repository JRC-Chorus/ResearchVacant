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
5. Google Driveより，`.clasp.json`をダウンロードしてトップに配置する（特定キーを含むためリポジトリに含めていない）
6. `clasp login`でJRC-Chorusのアカウントにログインする
7. `yarn open`でアップロード済みのコードを開く

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