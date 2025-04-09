import { aws_lambda_nodejs, Duration } from 'aws-cdk-lib';
import type { Role } from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import type { Construct } from 'constructs';

import type { EnvType } from '../src/utility/env';
import { allowedEnvs } from '../src/utility/env';

export function createLambdaFunction(
    scope: Construct,
    role: Role,
    suffix: string,
    funcEnv: EnvType,
): aws_lambda_nodejs.NodejsFunction {
    return new aws_lambda_nodejs.NodejsFunction(
        scope,
        `RaceScheduleAppLambda${suffix}`,
        {
            architecture: lambda.Architecture.ARM_64,
            runtime: lambda.Runtime.NODEJS_20_X,
            entry: 'lib/src/index.ts',
            role,
            environment: {
                ENV: funcEnv,
                JRA_CALENDAR_ID:
                    funcEnv === allowedEnvs.production
                        ? (process.env.JRA_CALENDAR_ID ?? '')
                        : (process.env.TEST_CALENDAR_ID ?? ''),
                NAR_CALENDAR_ID:
                    funcEnv === allowedEnvs.production
                        ? (process.env.NAR_CALENDAR_ID ?? '')
                        : (process.env.TEST_CALENDAR_ID ?? ''),
                KEIRIN_CALENDAR_ID:
                    funcEnv === allowedEnvs.production
                        ? (process.env.KEIRIN_CALENDAR_ID ?? '')
                        : (process.env.TEST_CALENDAR_ID ?? ''),
                WORLD_CALENDAR_ID:
                    funcEnv === allowedEnvs.production
                        ? (process.env.WORLD_CALENDAR_ID ?? '')
                        : (process.env.TEST_CALENDAR_ID ?? ''),
                AUTORACE_CALENDAR_ID:
                    funcEnv === allowedEnvs.production
                        ? (process.env.AUTORACE_CALENDAR_ID ?? '')
                        : (process.env.TEST_CALENDAR_ID ?? ''),
                BOATRACE_CALENDAR_ID:
                    funcEnv === allowedEnvs.production
                        ? (process.env.BOATRACE_CALENDAR_ID ?? '')
                        : (process.env.TEST_CALENDAR_ID ?? ''),
                GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL ?? '',
                GOOGLE_PRIVATE_KEY: (
                    process.env.GOOGLE_PRIVATE_KEY ?? ''
                ).replace(/\\n/g, '\n'),
            },
            timeout: Duration.seconds(90),
            memorySize: 1024,
        },
    );
}
