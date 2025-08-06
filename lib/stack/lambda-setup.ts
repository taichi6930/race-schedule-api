import { aws_lambda_nodejs, Duration } from 'aws-cdk-lib';
import type { Role } from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import type { Construct } from 'constructs';

export function createLambdaFunction(
    scope: Construct,
    role: Role,
    functionName: string,
    environment: Record<string, string>,
): aws_lambda_nodejs.NodejsFunction {
    return new aws_lambda_nodejs.NodejsFunction(scope, functionName, {
        functionName,
        architecture: lambda.Architecture.ARM_64,
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: 'lib/src/index.ts',
        role,
        environment,
        timeout: Duration.seconds(90),
        memorySize: 1024,
        layers: [
            lambda.LayerVersion.fromLayerVersionArn(
                scope,
                'BetterSqlite3Layer',
                'arn:aws:lambda:ap-northeast-1:485169041965:layer:better-sqlite3:2',
            ),
        ],
    });
}
