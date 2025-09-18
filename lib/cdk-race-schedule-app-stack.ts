import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import type { Construct } from 'constructs';

// StackPropsを拡張してlambdaEnvを追加
export interface RaceScheduleAppStackProps extends cdk.StackProps {
    lambdaEnv: Record<string, string>;
}

import { createLambdaExecutionRole } from './stack/iam-setup';
import { createLambdaFunction } from './stack/lambda-setup';

export class CdkRaceScheduleAppStack extends cdk.Stack {
    public constructor(
        scope: Construct,
        id: string,
        props: RaceScheduleAppStackProps,
    ) {
        super(scope, id, props);

        // S3バケット名を環境変数から取得
        const s3BucketName = props.lambdaEnv.S3_BUCKET_NAME;
        const bucket = s3.Bucket.fromBucketName(
            this,
            'RaceScheduleBucket',
            s3BucketName,
        );

        // Lambda実行に必要なIAMロールを作成
        const lambdaRole = createLambdaExecutionRole(
            this,
            bucket,
            s3BucketName,
        );
        // Lambda関数名・CDKリソースIDをStack名（id）でユニーク化

        const lambdaFunctionName = props.lambdaEnv.LAMBDA_FUNCTION_NAME;

        // Lambda用の環境変数オブジェクトを作成
        // props.lambdaEnv からLambda用の環境変数を組み立てる
        const lambdaEnv = {
            ...props.lambdaEnv,
            S3_BUCKET_NAME: s3BucketName,
            GOOGLE_PRIVATE_KEY: props.lambdaEnv.GOOGLE_PRIVATE_KEY.replace(
                /\\n/g,
                '\n',
            ),
        };

        // Lambda関数を作成（CDKリソースIDも同じ値を使う）
        const lambdaFunction = createLambdaFunction(
            this,
            lambdaRole,
            lambdaFunctionName,
            lambdaEnv,
        );
        console.log(`Lambda Function Name: ${lambdaFunction.functionName}`);
    }
}
