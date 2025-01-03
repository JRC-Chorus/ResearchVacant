import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambda_node from 'aws-cdk-lib/aws-lambda-nodejs';
import type { Construct } from 'constructs';

const envs = require('dotenv').config({ path: './.env.local' });

// process.envの値を定義
// 型定義は`proxy/src/global.d.ts`に記述
const define: Record<string, string> = {};
Object.entries(envs.parsed).map(([k, v]) => {
  define[k] = String(v);
});

export class ResearchVacantStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apiLambda = new lambda_node.NodejsFunction(this, 'ApiLambda', {
      entry: 'src/api.ts',
      runtime: lambda.Runtime.NODEJS_20_X,
      bundling: {
        format: lambda_node.OutputFormat.ESM,
        sourceMap: true,
      },
      environment: define,
    });

    const urlfunc = apiLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedMethods: [lambda.HttpMethod.ALL],
        allowedOrigins: ['*'],
      },
    });

    new cdk.CfnOutput(this, 'urlFuncResult', {
      value: urlfunc.url,
    });
  }
}
