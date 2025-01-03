import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambda_node from 'aws-cdk-lib/aws-lambda-nodejs';
import type { Construct } from 'constructs';

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
