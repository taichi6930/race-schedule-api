import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as efs from 'aws-cdk-lib/aws-efs';
import type * as lambda from 'aws-cdk-lib/aws-lambda';
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

        // VPCの作成
        const vpc = new ec2.Vpc(this, 'RaceScheduleVpc', {
            maxAzs: 2,
            natGateways: 1,
        });

        // EFSファイルシステムの作成
        const fileSystem = new efs.FileSystem(this, 'RaceScheduleEfs', {
            vpc,
            removalPolicy: cdk.RemovalPolicy.DESTROY, // 開発環境用。本番環境では RETAIN にすること
        });

        // Lambdaがアクセスするためのアクセスポイントを作成
        const accessPoint = fileSystem.addAccessPoint(
            'RaceScheduleEfsAccessPoint',
            {
                path: '/race-schedule',
                createAcl: {
                    ownerGid: '1001',
                    ownerUid: '1001',
                    permissions: '750',
                },
                posixUser: {
                    gid: '1001',
                    uid: '1001',
                },
            },
        );

        // S3バケットの参照
        const bucket = s3.Bucket.fromBucketName(
            this,
            'RaceScheduleBucket',
            'race-schedule-bucket',
        );

        // Lambda実行に必要なIAMロールを作成
        const lambdaRole = createLambdaExecutionRole(this, bucket);

        // EFSセキュリティグループの設定
        fileSystem.connections.allowDefaultPortFrom(
            ec2.Peer.ipv4(vpc.vpcCidrBlock),
        );

        // Lambda関数のEFS設定
        const efsConfig: lambda.FileSystem = {
            config: {
                arn: accessPoint.accessPointArn,
                localMountPath: '/mnt/efs',
            },
        };

        // Lambda関数を作成（EFS設定を追加）
        const lambdaFunction = createLambdaFunction(
            this,
            lambdaRole,
            vpc,
            efsConfig,
        );

        // API Gatewayの設定
        const api = createApiGateway(this, lambdaFunction);

        // API Gateway エンドポイントの出力
        new cdk.CfnOutput(this, 'RaceScheduleAppApiGatewayEndpoint', {
            value: api.deploymentStage.urlForPath(),
        });
    }
}
