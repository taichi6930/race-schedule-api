import {
    Effect,
    PolicyStatement,
    Role,
    ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import type * as aws_s3 from 'aws-cdk-lib/aws-s3';
import type { Construct } from 'constructs';

export function createLambdaExecutionRole(
    scope: Construct,
    bucket: aws_s3.IBucket,
): Role {
    // Lambda 実行に必要な IAM ロールを作成
    const role = new Role(scope, 'LambdaExecutionRole', {
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    // Lambda が S3 バケットにアクセスできるようにするポリシーステートメントを追加
    role.addToPolicy(
        new PolicyStatement({
            actions: [
                's3:GetObject',
                's3:PutObject',
                's3:ListBucket',
                's3:DeleteObject',
            ],
            resources: [bucket.bucketArn + '/*', bucket.bucketArn],
        }),
    );

    // Lambdaのログ出力権限を追加
    role.addToPolicy(
        new PolicyStatement({
            actions: [
                'logs:CreateLogGroup',
                'logs:CreateLogStream',
                'logs:PutLogEvents',
            ],
            effect: Effect.ALLOW,
            resources: ['*'],
        }),
    );

    // EFSへのアクセス権限を追加
    role.addToPolicy(
        new PolicyStatement({
            actions: [
                'elasticfilesystem:ClientMount',
                'elasticfilesystem:ClientWrite',
                'elasticfilesystem:ClientRootAccess',
            ],
            effect: Effect.ALLOW,
            resources: ['*'],
        }),
    );

    // 必要最小限のEC2権限を追加（ENI操作用）
    role.addToPolicy(
        new PolicyStatement({
            actions: [
                'ec2:CreateNetworkInterface',
                'ec2:DeleteNetworkInterface',
                'ec2:DescribeNetworkInterfaces',
            ],
            effect: Effect.ALLOW,
            resources: ['*'],
        }),
    );

    return role;
}
