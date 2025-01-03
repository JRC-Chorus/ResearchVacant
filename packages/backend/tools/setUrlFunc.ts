import { EnvHandler } from '@research-vacant/common';
import fs from 'fs';

const AWS_STACK_RESULT_PATH = '../proxy/stackResult.json';
const BACKEND_ENV_PATH = './.env.local';

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
    AWS_URL: url
  }
  EnvHandler.updateEnv(BACKEND_ENV_PATH, target)
}

main();
