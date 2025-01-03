import fs from 'fs';
import { toEntries } from '../obj/obj';

export class EnvHandler {
  static loadEnv(path: string) {
    const fileTxt = fs.readFileSync(path, 'utf8');

    const env: Record<string, string> = {};
    fileTxt.split('\n').forEach((line) => {
      const [key, value] = line.split('=');
      env[key] = value;
    });

    return env;
  }

  /**
   * 既存のEnvがある場合には，引数で与えられた値のみを更新して保存する
   */
  static updateEnv(path: string, env: Record<string, string>) {
    const existedEnv = this.loadEnv(path);
    toEntries(env).map(([k, v]) => {
      existedEnv[k] = v;
    });

    this.writeEnv(path, existedEnv);
  }

  /**
   * 既存のEnvを上書きするように与えられた値通りのファイルを保存する
   */
  static writeEnv(path: string, env: Record<string, string>) {
    fs.writeFileSync(
      path,
      Object.entries(env)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n')
    );
  }
}
