# Proxy（フロントエンド <--> バックエンド間の通信を仲介）

社内セキュリティの都合により，`script.google.com`へのアクセスができないことから，AWSのLambda関数を経由して，`script.google.com`へのアクセスを行う．

## 事前準備（AWSのアカウント作成）

1. [AWS（=Amazon Web Services）](https://aws.amazon.com/)のアカウントを作成する．
1. [AWS IAM](https://console.aws.amazon.com/iam/home)で，アカウント内で実際にプログラムを動かすユーザーを作成する．
  - この時，このユーザーにAdmin権限を渡しておく
  - 作成したユーザーの「ARNに記載の12桁の番号」「ユーザー名」「パスワード」を控えておく
1. 一旦ログアウトし，IAMで作成したユーザーで再度ログインする．
1. ログイン出来たらアカウント作成は完了．


## デプロイ

1. [AWS CLI](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/getting-started-install.html)をインストールする．
1. [AWS IAM](https://console.aws.amazon.com/iam/home)にアクセスし，「ユーザー」＞「プログラムを動かすユーザー」を選択する．
1. 「アクセスキーを作成」を選択し，「CLI用のアクセスキー」を作成する（作成完了後に，「.csvファイルをダウンロード」というボタンがあるため，必ずダウンロードしておく）
1. `aws configure`でAWSの認証情報を設定する．
  - 途中で聞かれる`AWS Access Key ID`, `AWS Secret Access Key`はダウンロードしたCSVに記載の内容を入力していく
  - `Default region name`は`ap-northeast-1`を入力する．
  - `Default output format`は`json`を入力する．
1. `yarn deploy`でデプロイする．

> [!NOTE]
> まれに，`yarn deploy`の実行時に以下のようなエラーが出ることがある．この場合にはエラーの要求に合わせて，`aws-cdk-lib`, `aws-cdk`のバージョンを上げる．
> ```
> 32653   (cli): may fail on credentials coming from credential provider plugins
> 
>         Overview: Credential Providers returning empty credentials, or
>                   credentials with null expiration fields, would cause the CLI
>                   to throw an exception. If you encounter this behavior,
>                   upgrade to version 2.173.2 or higher
> 
>         Affected versions: cli: >=2.172.0 <=2.173.1
> ```
> - この場合は，バージョンを`2.173.2`以上に上げることを求められているため，以下の編集を行う．
>   1. `packages\proxy\package.json`の`aws-cdk-lib`と`aws-cdk`のバージョンを上げる．
>   1. `yarn install`で依存関係を更新する．

