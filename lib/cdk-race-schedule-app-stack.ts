import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import type { Construct } from 'constructs';
import * as dotenv from 'dotenv';

import { createApiGateway } from './stack/api-setup';
import { createLambdaExecutionRole } from './stack/iam-setup';
import { createLambdaFunction } from './stack/lambda-setup';

dotenv.config({ path: './.env' });

export class CdkRaceScheduleAppStack extends cdk.Stack {
    public constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // S3バケットの参照
        const bucket = s3.Bucket.fromBucketName(
            this,
            'RaceScheduleBucket',
            'race-schedule-bucket',
        );

        // Lambda実行に必要なIAMロールを作成
        const lambdaRole = createLambdaExecutionRole(this, bucket);

        // Lambda関数を作成
        const lambdaFunction = createLambdaFunction(this, lambdaRole);

        // API Gatewayの設定
        const api = createApiGateway(this, lambdaFunction);

        // API Gateway エンドポイントの出力
        new cdk.CfnOutput(this, 'RaceScheduleAppApiGatewayEndpoint', {
            value: api.deploymentStage.urlForPath(),
        });
    }
}
