import { aws_s3, CfnOutput, Stack, type StackProps } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as dotenv from 'dotenv';

import { allowedEnvs, type EnvType } from './src/utility/env';
import { createApiGateway } from './stack/api-setup';
import { createLambdaExecutionRole } from './stack/iam-setup';
import { createLambdaFunction } from './stack/lambda-setup';

dotenv.config({ path: './.env' });

export abstract class CdkRaceScheduleAppStack extends Stack {
    protected constructor(
        scope: Construct,
        id: string,
        protected readonly suffix: string,
        funcEnv: EnvType,
        props?: StackProps,
    ) {
        super(scope, id, props);

        // S3バケットの参照
        const bucket = aws_s3.Bucket.fromBucketName(
            this,
            `RaceScheduleBucket${this.suffix}`,
            `race-schedule-bucket${this.suffix}`,
        );

        const s3TableBucket = aws_s3.Bucket.fromBucketName(
            this,
            `RaceScheduleTableBucket${this.suffix}`,
            `race-schedule-table-bucket${this.suffix}`,
        );

        // Lambda実行に必要なIAMロールを作成
        const lambdaRole = createLambdaExecutionRole(
            this,
            bucket,
            s3TableBucket,
            this.suffix,
        );

        // Lambda関数を作成
        const lambdaFunction = createLambdaFunction(
            this,
            lambdaRole,
            this.suffix,
            funcEnv,
        );

        // API Gatewayの設定
        const api = createApiGateway(this, lambdaFunction, this.suffix);

        // API Gateway エンドポイントの出力
        new CfnOutput(this, `RaceScheduleAppApiGatewayEndpoint${this.suffix}`, {
            value: api.deploymentStage.urlForPath(),
        });
    }
}

export class ProductionRaceScheduleAppStack extends CdkRaceScheduleAppStack {
    public constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, '', allowedEnvs.production, props);
    }
}

export class TestRaceScheduleAppStack extends CdkRaceScheduleAppStack {
    public constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, '-test', allowedEnvs.test, props);
    }
}
