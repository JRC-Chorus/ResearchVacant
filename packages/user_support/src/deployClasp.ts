import { EnvHandler } from 'app/source/env';
import { BACKEND_ENV_PATH } from './core/constVals';
import { exeCommandWithloading } from './core/cuiSupport';

async function main() {
  const envs = EnvHandler.loadEnv(BACKEND_ENV_PATH);

  const output = await exeCommandWithloading(
    'Deploying project...',
    'yarn clasp deploy -i ' + envs.DEPLOY_ID
  );
  console.log(output.stdout);
}

main();
