import fs from 'fs';

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

  static updateEnv(path: string, env: Record<string, string>) {
    fs.writeFileSync(
      path,
      Object.entries(env)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n')
    );
  }
}
