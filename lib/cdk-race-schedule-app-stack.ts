import path from 'node:path';

import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import type { Construct } from 'constructs';

// StackPropsを拡張してlambdaEnvを追加
export interface RaceScheduleAppStackProps extends cdk.StackProps {
    lambdaEnv: Record<string, string>;
    // optional: when provided, CDK will create a Bucket with this name if it does not exist
    s3BucketName?: string;
    // optional local asset path to an initial sqlite DB to deploy into the bucket
    initialDbAssetPath?: string;
    // optional ARN or path to a Lambda Layer to attach to the function (LayerVersion ARN)
    lambdaLayerArn?: string;
}

import { createApiGateway } from './stack/api-setup';
import { createLambdaExecutionRole } from './stack/iam-setup';
import { createLambdaFunction } from './stack/lambda-setup';

export class CdkRaceScheduleAppStack extends cdk.Stack {
    public constructor(
        scope: Construct,
        id: string,
        props: RaceScheduleAppStackProps,
    ) {
        super(scope, id, props);

        // S3バケットの作成/参照
        const s3BucketName =
            (props.lambdaEnv && props.lambdaEnv.S3_BUCKET_NAME) ??
            props.s3BucketName;
        let bucket: s3.IBucket;
        if (s3BucketName) {
            // try to import existing bucket if name provided, otherwise create
            try {
                bucket = s3.Bucket.fromBucketName(
                    this,
                    'RaceScheduleBucketImported',
                    s3BucketName,
                );
            } catch {
                // fallback to creating a bucket with the provided name
                bucket = new s3.Bucket(this, 'RaceScheduleBucket', {
                    bucketName: s3BucketName,
                    removalPolicy: cdk.RemovalPolicy.RETAIN,
                });
            }
        } else {
            // create a bucket if no name provided
            bucket = new s3.Bucket(this, 'RaceScheduleBucket', {
                removalPolicy: cdk.RemovalPolicy.RETAIN,
            });
        }

        // Lambda実行に必要なIAMロールを作成
        const lambdaRole = createLambdaExecutionRole(
            this,
            bucket,
            s3BucketName || '',
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
        // If a Layer ARN was provided in props, attach it to the Lambda
        const layerArns: string[] = props.lambdaLayerArn
            ? [props.lambdaLayerArn]
            : [];

        const lambdaFunction = createLambdaFunction(
            this,
            lambdaRole,
            lambdaFunctionName,
            lambdaEnv,
            layerArns,
        );

        // Deploy an initial DB asset if provided
        if (props.initialDbAssetPath) {
            new s3deploy.BucketDeployment(this, 'InitialDbDeploy', {
                sources: [
                    s3deploy.Source.asset(
                        path.resolve(props.initialDbAssetPath),
                    ),
                ],
                destinationBucket: bucket,
                destinationKeyPrefix: props.lambdaEnv.S3_SQLITE_KEY || 'prod',
            });
        }

        // API Gatewayの設定
        const api = createApiGateway(this, lambdaFunction);

        // API Gateway エンドポイントの出力
        new cdk.CfnOutput(this, 'RaceScheduleAppApiGatewayEndpoint', {
            value: api.deploymentStage.urlForPath(),
        });
    }
}
