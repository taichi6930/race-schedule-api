import { aws_lambda_nodejs, Duration } from 'aws-cdk-lib';
import type { IVpc } from 'aws-cdk-lib/aws-ec2';
import type * as ec2 from 'aws-cdk-lib/aws-ec2';
import type { AccessPoint, FileSystem } from 'aws-cdk-lib/aws-efs';
import type { Role } from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import type { Construct } from 'constructs';

import { ENV } from '../src/utility/env';

export interface LambdaFunctionProps {
    role: Role;
    vpc: IVpc;
    securityGroup: ec2.SecurityGroup;
    filesystem: {
        efs: FileSystem;
        accessPoint: AccessPoint;
        mountPath: string;
    };
}

export function createLambdaFunction(
    scope: Construct,
    props: LambdaFunctionProps,
): aws_lambda_nodejs.NodejsFunction {
    return new aws_lambda_nodejs.NodejsFunction(
        scope,
        'RaceScheduleAppLambda',
        {
            architecture: lambda.Architecture.X86_64, // better-sqlite3はARM64をサポートしていないため
            runtime: lambda.Runtime.NODEJS_20_X,
            entry: 'lib/src/index.ts',
            vpc: props.vpc,
            securityGroups: [props.securityGroup],
            role: props.role,
            filesystem: lambda.FileSystem.fromEfsAccessPoint(
                props.filesystem.accessPoint,
                props.filesystem.mountPath,
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
                SQLITE_PATH: props.filesystem.mountPath,
            },
            bundling: {
                nodeModules: ['better-sqlite3'],
                forceDockerBundling: true,
            },
            timeout: Duration.seconds(90),
            memorySize: 1024,
        },
    );
}
