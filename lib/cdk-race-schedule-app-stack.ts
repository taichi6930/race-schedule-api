import {
    aws_s3,
    aws_s3tables,
    CfnOutput,
    Stack,
    type StackProps,
} from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as dotenv from 'dotenv';

import { createApiGateway } from './stack/api-setup';
import { createEfsFileSystem } from './stack/efs-setup';
import { createLambdaExecutionRole } from './stack/iam-setup';
import { createLambdaFunction } from './stack/lambda-setup';
import { createVpc } from './stack/vpc-setup';

dotenv.config({ path: './.env' });

export class CdkRaceScheduleAppStack extends Stack {
    public constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

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

        // VPCを作成
        const vpc = createVpc(this);

        // EFSを作成
        const { fileSystem, accessPoint, lambdaSecurityGroup } =
            createEfsFileSystem(this, { vpc });
        createEfsFileSystem(this, { vpc });

        // Lambda実行に必要なIAMロールを作成
        const lambdaRole = createLambdaExecutionRole(
            this,
            bucket,
            s3TableBucket,
        );

        // Lambda関数を作成
        const lambdaFunction = createLambdaFunction(this, {
            role: lambdaRole,
            vpc,
            securityGroup: lambdaSecurityGroup,
            filesystem: {
                efs: fileSystem,
                accessPoint: accessPoint,
                mountPath: '/mnt/sqlite',
            },
        });

        // API Gatewayの設定
        const api = createApiGateway(this, lambdaFunction);

        // API Gateway エンドポイントの出力
        new CfnOutput(this, 'RaceScheduleAppApiGatewayEndpoint', {
            value: api.deploymentStage.urlForPath(),
        });
    }
}
