import type { aws_efs } from 'aws-cdk-lib';
import { aws_lambda_nodejs, Duration } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import type { Role } from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import type { Construct } from 'constructs';

import { ENV } from '../src/utility/env';

interface LambdaConfig {
    vpc: ec2.Vpc;
    filesystem: aws_efs.FileSystem;
    accessPoint: aws_efs.AccessPoint;
}

export function createLambdaFunction(
    scope: Construct,
    role: Role,
    config: LambdaConfig,
): aws_lambda_nodejs.NodejsFunction {
    return new aws_lambda_nodejs.NodejsFunction(
        scope,
        'RaceScheduleAppLambda',
        {
            architecture: lambda.Architecture.ARM_64,
            runtime: lambda.Runtime.NODEJS_20_X,
            entry: 'lib/src/index.ts',
            role,
            environment: {
                ENV,
                NODE_ENV: 'production', // 本番環境では'production'を設定
                JRA_CALENDAR_ID: process.env.JRA_CALENDAR_ID ?? '',
                NAR_CALENDAR_ID: process.env.NAR_CALENDAR_ID ?? '',
                KEIRIN_CALENDAR_ID: process.env.KEIRIN_CALENDAR_ID ?? '',
                WORLD_CALENDAR_ID: process.env.WORLD_CALENDAR_ID ?? '',
                AUTORACE_CALENDAR_ID: process.env.AUTORACE_CALENDAR_ID ?? '',
                BOATRACE_CALENDAR_ID: process.env.BOATRACE_CALENDAR_ID ?? '',
                TEST_CALENDAR_ID: process.env.TEST_CALENDAR_ID ?? '',
                GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL ?? '',
                GOOGLE_PRIVATE_KEY: (
                    process.env.GOOGLE_PRIVATE_KEY ?? ''
                ).replace(/\\n/g, '\n'),
            },
            timeout: Duration.seconds(300), // SQLiteの処理に十分な時間を確保
            memorySize: 2048, // SQLite操作のためにメモリを増やす
            vpc: config.vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
            },
            filesystem: lambda.FileSystem.fromEfsAccessPoint(
                config.accessPoint,
                '/mnt/sqlite',
            ),
        },
    );
}
