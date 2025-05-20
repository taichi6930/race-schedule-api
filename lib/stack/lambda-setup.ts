import { Duration } from 'aws-cdk-lib';
import { aws_lambda_nodejs } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import type { Role } from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import type { Construct } from 'constructs';

import { ENV } from '../src/utility/env';

export function createLambdaFunction(
    scope: Construct,
    role: Role,
    vpc?: ec2.IVpc,
    filesystem?: lambda.FileSystem,
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
            filesystem,
            securityGroups: vpc
                ? [
                      new ec2.SecurityGroup(scope, 'RaceScheduleLambdaSG', {
                          vpc,
                          description: 'Security group for Lambda function',
                          allowAllOutbound: true,
                      }),
                  ]
                : undefined,
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
                EFS_MOUNT_PATH: '/mnt/efs',
            },
            timeout: Duration.seconds(90),
            memorySize: 1024,
        },
    );
}
