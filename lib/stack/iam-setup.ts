import * as iam from 'aws-cdk-lib/aws-iam';
import type * as s3 from 'aws-cdk-lib/aws-s3';
import type { Construct } from 'constructs';

export function createLambdaExecutionRole(
    scope: Construct,
    bucket: s3.IBucket,
    s3BucketName: string,
): iam.Role {
    // Lambda 実行に必要な IAM ロールを作成
    const role = new iam.Role(scope, 'LambdaExecutionRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    // Lambda が S3 バケットにアクセスできるようにするポリシーステートメントを追加
    role.addToPolicy(
        new iam.PolicyStatement({
            actions: [
                's3:GetObject',
                's3:PutObject',
                's3:ListBucket',
                's3:DeleteObject',
            ],
            resources: [
                `arn:aws:s3:::${s3BucketName}`,
                `arn:aws:s3:::${s3BucketName}/*`,
            ],
        }),
    );

    // Lambdaのログ出力権限を追加
    role.addToPolicy(
        new iam.PolicyStatement({
            actions: [
                'logs:CreateLogGroup',
                'logs:CreateLogStream',
                'logs:PutLogEvents',
            ],
            effect: iam.Effect.ALLOW,
            resources: ['*'],
        }),
    );

    return role;
}
