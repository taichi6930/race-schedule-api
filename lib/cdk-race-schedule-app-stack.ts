import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import type { Construct } from 'constructs';


export interface RaceScheduleAppStackProps extends cdk.StackProps {
    lambdaEnv: Record<string, string>;
}

import { createApiGateway } from './stack/api-setup';
import { createLambdaExecutionRole } from './stack/iam-setup';
import { createLambdaFunction } from './stack/lambda-setup';

export class CdkRaceScheduleAppStack extends cdk.Stack {
    public constructor(
        scope: Construct,
        id: string,
        props: RaceScheduleAppStackProps,
    ) {
        super(scope, id, props);

        
        const s3BucketName = props.lambdaEnv.S3_BUCKET_NAME;
        const bucket = s3.Bucket.fromBucketName(
            this,
            'RaceScheduleBucket',
            s3BucketName,
        );

        
        const lambdaRole = createLambdaExecutionRole(
            this,
            bucket,
            s3BucketName,
        );
        

        const lambdaFunctionName = props.lambdaEnv.LAMBDA_FUNCTION_NAME;

        
        
        const lambdaEnv = {
            ...props.lambdaEnv,
            S3_BUCKET_NAME: s3BucketName,
            GOOGLE_PRIVATE_KEY: props.lambdaEnv.GOOGLE_PRIVATE_KEY.replace(
                /\\n/g,
                '\n',
            ),
        };

        
        const lambdaFunction = createLambdaFunction(
            this,
            lambdaRole,
            lambdaFunctionName,
            lambdaEnv,
        );

        
        const api = createApiGateway(this, lambdaFunction);

        
        new cdk.CfnOutput(this, 'RaceScheduleAppApiGatewayEndpoint', {
            value: api.deploymentStage.urlForPath(),
        });
    }
}
