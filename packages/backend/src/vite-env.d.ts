/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEPLOY_ID: string
  readonly VITE_AWS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}