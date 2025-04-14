import { aws_lambda_nodejs, Duration } from 'aws-cdk-lib';
import type { IVpc } from 'aws-cdk-lib/aws-ec2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import type { IAccessPoint } from 'aws-cdk-lib/aws-efs';
import type { Role } from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import type { Construct } from 'constructs';

import { ENV } from '../src/utility/env';

export function createLambdaFunction(
    scope: Construct,
    role: Role,
    vpc: IVpc,
    efsAccessPoint: IAccessPoint,
): aws_lambda_nodejs.NodejsFunction {
    return new aws_lambda_nodejs.NodejsFunction(
        scope,
        'RaceScheduleAppLambda',
        {
            architecture: lambda.Architecture.ARM_64,
            runtime: lambda.Runtime.NODEJS_20_X,
            entry: 'lib/src/index.ts',
            role,
            vpc,
            filesystem: lambda.FileSystem.fromEfsAccessPoint(
                efsAccessPoint,
                '/mnt/sqlite',
            ),
            environment: {
                ENV,
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
                SQLITE_PATH: '/mnt/sqlite/database.sqlite',
            },
            timeout: Duration.seconds(90),
            memorySize: 1024,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            },
        },
    );
}
