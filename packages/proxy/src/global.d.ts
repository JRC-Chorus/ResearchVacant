declare namespace NodeJS {
  // 環境変数名の定義
  interface ProcessEnv {
    /** GASのデプロイID */
    readonly DEPLOY_ID: string;
  }
}
