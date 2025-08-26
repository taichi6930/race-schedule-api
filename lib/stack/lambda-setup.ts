import { aws_lambda_nodejs, Duration } from 'aws-cdk-lib';
import type { Role } from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import type { Construct } from 'constructs';

export function createLambdaFunction(
    scope: Construct,
    role: Role,
    functionName: string,
    environment: Record<string, string>,
    layerArns: string[] = [],
): aws_lambda_nodejs.NodejsFunction {
    const lambdaProps: aws_lambda_nodejs.NodejsFunctionProps = {
        functionName,
        architecture: lambda.Architecture.ARM_64,
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: 'lib/src/index.ts',
        role,
        environment,
        timeout: Duration.seconds(90),
        memorySize: 1024,
        // include layers if provided
        layers:
            layerArns.length > 0
                ? layerArns.map((arn, idx) =>
                      lambda.LayerVersion.fromLayerVersionArn(
                          scope,
                          `${functionName}Layer${idx}`,
                          arn,
                      ),
                  )
                : undefined,
    };

    return new aws_lambda_nodejs.NodejsFunction(
        scope,
        functionName,
        lambdaProps,
    );
}
