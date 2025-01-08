import { EnvHandler } from 'app/source/env';
import fs from 'fs';
import { AWS_STACK_RESULT_PATH, BACKEND_ENV_PATH } from './core/constVals';

function loadUrlFuncResult() {
  if (fs.existsSync(AWS_STACK_RESULT_PATH)) {
    const claspJson = fs.readFileSync(AWS_STACK_RESULT_PATH, 'utf8');
    return JSON.parse(claspJson)['ResearchVacantStack']['urlFuncResult'];
  }

  return '';
}

function main() {
  const url = loadUrlFuncResult();

  const target = {
    AWS_URL: url,
  };
  EnvHandler.updateEnv(BACKEND_ENV_PATH, target);
}

main();
