import { input, select } from '@inquirer/prompts';
import { EnvHandler } from 'app/source/env';
import { execa } from 'execa';
import fs from 'fs';
import loading from 'loading-cli';

// カレントディレクトリはtsxの実行場所である`packages\backend`になる
const CLASP_JSON_PATH = '../../.clasp.json';
const PROXY_ENV_PATH = '../proxy/.env.local';
const BACKEND_ENV_PATH = '../backend/.env.local';

/**
 * 既存の.clasp.jsonを読み込む
 */
function loadClaspJson(): string {
  if (fs.existsSync(CLASP_JSON_PATH)) {
    const claspJson = fs.readFileSync(CLASP_JSON_PATH, 'utf8');
    return JSON.parse(claspJson)['scriptId'];
  }

  return '';
}

/**
 * 取得した`scriptID`を以下のファイルに書き込む
 *
 * - `.clasp.json`: clasp利用に必須
 */
function writeScriptID(scriptID: string) {
  // .clasp.jsonに書き込む
  const claspJson = {
    scriptId: scriptID,
    rootDir: './dist',
  };
  fs.writeFileSync(CLASP_JSON_PATH, JSON.stringify(claspJson, null, 2));
}

/**
 * ローディング中の表示を出しながらコマンドを実行する
 */
async function exeCommandWithloading(title: string, command: string) {
  const load = loading({
    text: title,
    color: 'red',
    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  }).start();

  const output = await execa(command);

  load.stop();

  return output;
}

/**
 * デプロイ済みのID一覧を取得する
 *
 * @param [forceDeployWithNoDeployments=true] IDが存在しない場合は，強制的にデプロイを実行する
 */
async function loadDeploymentIds(forceDeployWithNoDeployments: boolean = true) {
  const getDeploymentIds = (outputStr: string) =>
    outputStr
      .split('\n')
      .map((line) => {
        const match = line.match(/- ([\w-]+) @(\d+)(?:\s+(.+))?/);
        return match
          ? {
              id: match[1],
              number: parseInt(match[2], 10),
              description: match[3] ?? '',
            }
          : '';
      })
      .filter((id) => id !== '');

  const output = await exeCommandWithloading(
    'Listing deployments...',
    'yarn clasp deployments'
  );

  const depIds = getDeploymentIds(output.stdout);
  if (depIds.length === 0 && forceDeployWithNoDeployments) {
    const firstDeployOutput = await exeCommandWithloading(
      'First Deploying...',
      'yarn clasp deploy'
    );
    return getDeploymentIds(firstDeployOutput.stdout);
  }

  return depIds;
}

/**
 * 取得した`deployID`を以下のファイルに書き込む
 *
 * - `proxy/.env` : GAS APIへのアクセスに必要
 * - `backend/.env`: `yarn deploy`の際にデプロイ先を指定する
 */
function writeDeploymentId(deployID: string) {
  // proxy/.envに書き込む
  const proxyEnv = {
    VITE_DEPLOY_ID: deployID,
  };
  EnvHandler.writeEnv(PROXY_ENV_PATH, proxyEnv);

  // backend/.envに書き込む
  const backendEnv = {
    VITE_DEPLOY_ID: deployID,
  };
  EnvHandler.writeEnv(BACKEND_ENV_PATH, backendEnv);
}

async function main() {
  const defaultScriptID = loadClaspJson();

  const scriptID = await input({
    message: 'What is the scriptID in GAS?',
    default: defaultScriptID,
    required: true,
  });
  writeScriptID(scriptID);

  const deployments = await loadDeploymentIds();
  const deploymentID = await select({
    message: 'Select a deploymentID in GAS?',
    choices: deployments.map((dep) => {
      return {
        name: `${dep.id} @${dep.number} ${dep.description}`,
        value: dep.id,
      };
    }),
  });
  writeDeploymentId(deploymentID);
}

main();
