import {
    aws_ec2,
    aws_s3,
    aws_s3tables,
    CfnOutput,
    Stack,
    type StackProps,
} from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as dotenv from 'dotenv';

import { createApiGateway } from './stack/api-setup';
import { EfsSetup } from './stack/efs-setup';
import { createLambdaExecutionRole } from './stack/iam-setup';
import { createLambdaFunction } from './stack/lambda-setup';

dotenv.config({ path: './.env' });

export class CdkRaceScheduleAppStack extends Stack {
    public constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // 新しいVPCを作成（NAT Gatewayなし）
        const vpc = new aws_ec2.Vpc(this, 'RaceScheduleVpc', {
            maxAzs: 2,
            natGateways: 0,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'Isolated',
                    subnetType: aws_ec2.SubnetType.PRIVATE_ISOLATED,
                },
            ],
        });

        // VPCエンドポイントの設定
        new aws_ec2.GatewayVpcEndpoint(this, 'S3VpcEndpoint', {
            vpc,
            service: aws_ec2.GatewayVpcEndpointAwsService.S3,
            subnets: [{ subnetType: aws_ec2.SubnetType.PRIVATE_ISOLATED }],
        });

        new aws_ec2.InterfaceVpcEndpoint(this, 'ApiGatewayVpcEndpoint', {
            vpc,
            service: aws_ec2.InterfaceVpcEndpointAwsService.APIGATEWAY,
            subnets: { subnetType: aws_ec2.SubnetType.PRIVATE_ISOLATED },
        });

        new aws_ec2.InterfaceVpcEndpoint(this, 'LambdaVpcEndpoint', {
            vpc,
            service: aws_ec2.InterfaceVpcEndpointAwsService.LAMBDA,
            subnets: { subnetType: aws_ec2.SubnetType.PRIVATE_ISOLATED },
        });

        // EFSの設定
        const _efs = new EfsSetup(this, 'RaceScheduleEfsSetup', vpc);

        // S3バケットの参照
        const bucket = aws_s3.Bucket.fromBucketName(
            this,
            'RaceScheduleBucket',
            'race-schedule-bucket',
        );

        const s3TableBucket = new aws_s3tables.CfnTableBucket(
            this,
            'RaceScheduleTableBucket',
            {
                tableBucketName: 'race-schedule-table-bucket',

                // オプション: 参照されなくなったファイルの自動削除設定
                unreferencedFileRemoval: {
                    noncurrentDays: 90, // 旧バージョンのファイルを90日後に削除
                    status: 'Enabled', // 削除を有効化
                    unreferencedDays: 90, // 参照されなくなったファイルを90日後に削除
                },
            },
        );

        // Lambda実行に必要なIAMロールを作成
        const lambdaRole = createLambdaExecutionRole(
            this,
            bucket,
            s3TableBucket,
        );

        // Lambda関数を作成（VPCとEFSの設定を追加）
        const lambdaFunction = createLambdaFunction(
            this,
            lambdaRole,
            vpc,
            _efs.accessPoint,
        );

        // API Gatewayの設定
        const api = createApiGateway(this, lambdaFunction);

        // API Gateway エンドポイントの出力
        new CfnOutput(this, 'RaceScheduleAppApiGatewayEndpoint', {
            value: api.deploymentStage.urlForPath(),
        });
    }
}
