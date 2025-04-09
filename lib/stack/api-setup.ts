import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import type { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import type { Construct } from 'constructs';

export function createApiGateway(
    scope: Construct,
    lambdaFunction: NodejsFunction,
    suffix: string,
): apigateway.LambdaRestApi {
    return new apigateway.LambdaRestApi(scope, `RaceScheduleAppApi${suffix}`, {
        handler: lambdaFunction,
        defaultCorsPreflightOptions: {
            // すべてのオリジンを許可
            allowOrigins: apigateway.Cors.ALL_ORIGINS,

            // すべてのHTTPメソッドを許可
            allowMethods: ['GET', 'POST'],

            // すべてのヘッダーを許可
            allowHeaders: ['Content-Type', 'Authorization'],
            maxAge: Duration.minutes(1),
        },
        deployOptions: {
            stageName: 'v1',
        },
    });
}
