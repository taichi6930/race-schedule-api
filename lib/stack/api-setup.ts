import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import type { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import type { Construct } from 'constructs';

export function createApiGateway(
    scope: Construct,
    lambdaFunction: NodejsFunction,
): apigateway.LambdaRestApi {
    return new apigateway.LambdaRestApi(scope, 'RaceScheduleAppApi', {
        handler: lambdaFunction,
        defaultCorsPreflightOptions: {
            
            allowOrigins: apigateway.Cors.ALL_ORIGINS,

            
            allowMethods: ['GET', 'POST'],

            
            allowHeaders: ['Content-Type', 'Authorization'],
            maxAge: Duration.minutes(1),
        },
        deployOptions: {
            stageName: 'v1',
        },
    });
}
