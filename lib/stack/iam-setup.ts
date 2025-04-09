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
    tableBucket: aws_s3.IBucket,
    suffix: string,
): Role {
    // Lambda 実行に必要な IAM ロールを作成
    const role = new Role(scope, `LambdaExecutionRole${suffix}`, {
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    // Lambda が S3 バケットにアクセスできるようにするポリシーステートメントを追加
    role.addToPolicy(
        new PolicyStatement({
            actions: ['s3:GetObject', 's3:PutObject'],
            resources: [bucket.bucketArn + '/*'],
        }),
    );

    // Lambda が S3 テーブルバケットにアクセスできるようにするポリシーステートメントを追加
    role.addToPolicy(
        new PolicyStatement({
            actions: [
                's3:GetObject',
                's3:PutObject',
                's3:ListBucket',
                's3:DeleteObject',
            ],
            resources: [tableBucket.bucketArn + '/*'],
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

    // Lambda が EC2 の CreateNetworkInterface アクションを実行できるようにするポリシーステートメントを追加
    role.addToPolicy(
        new PolicyStatement({
            actions: ['ec2:CreateNetworkInterface'],
            effect: Effect.ALLOW,
            resources: ['*'], // リソースを特定のサブネットに制限する場合は、適切なリソース ARN を指定します
        }),
    );

    // Lambda が EC2 の DescribeNetworkInterfaces アクションを実行できるようにするポリシーステートメントを追加
    role.addToPolicy(
        new PolicyStatement({
            actions: ['ec2:DescribeNetworkInterfaces'],
            effect: Effect.ALLOW,
            resources: ['*'], // リソースを特定のネットワークインターフェースに制限する場合は、適切なリソース ARN を指定します
        }),
    );

    // Lambda が EC2 の DeleteNetworkInterface アクションを実行できるようにするポリシーステートメントを追加
    role.addToPolicy(
        new PolicyStatement({
            actions: ['ec2:DeleteNetworkInterface'],
            effect: Effect.ALLOW,
            resources: ['*'], // リソースを特定のネットワークインターフェースに制限する場合は、適切なリソース ARN を指定します
        }),
    );

    return role;
}
