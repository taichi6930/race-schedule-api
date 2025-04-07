import { RemovalPolicy } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as efs from 'aws-cdk-lib/aws-efs';
import type { Construct } from 'constructs';

export interface EfsSetupProps {
    vpc: ec2.IVpc;
}

export interface EfsSetupResult {
    fileSystem: efs.FileSystem;
    accessPoint: efs.AccessPoint;
    lambdaSecurityGroup: ec2.SecurityGroup;
}

export function createEfsFileSystem(
    scope: Construct,
    props: EfsSetupProps,
): EfsSetupResult {
    // Lambda用のセキュリティグループを作成
    const lambdaSecurityGroup = new ec2.SecurityGroup(
        scope,
        'LambdaSecurityGroup',
        {
            vpc: props.vpc,
            description: 'Security group for Lambda',
            allowAllOutbound: true,
        },
    );

    // EFS用のセキュリティグループを作成
    const efsSecurityGroup = new ec2.SecurityGroup(scope, 'EfsSecurityGroup', {
        vpc: props.vpc,
        description: 'Security group for EFS',
        allowAllOutbound: true,
    });

    // EFSファイルシステムを作成
    const fileSystem = new efs.FileSystem(scope, 'RaceScheduleEfs', {
        vpc: props.vpc,
        lifecyclePolicy: efs.LifecyclePolicy.AFTER_14_DAYS, // 14日間アクセスのないファイルを自動的にIAストレージクラスに移動
        performanceMode: efs.PerformanceMode.GENERAL_PURPOSE,
        throughputMode: efs.ThroughputMode.BURSTING,
        removalPolicy: RemovalPolicy.RETAIN, // プロダクション環境では削除保護を有効化
        securityGroup: efsSecurityGroup,
    });

    // EFSセキュリティグループにLambdaからのアクセスを許可
    efsSecurityGroup.addIngressRule(
        lambdaSecurityGroup,
        ec2.Port.tcp(2049),
        'Allow NFS access from Lambda',
    );

    // EFSアクセスポイントを作成 (SQLite用)
    const accessPoint = fileSystem.addAccessPoint('SqliteAccessPoint', {
        path: '/sqlite',
        createAcl: {
            ownerGid: '1000',
            ownerUid: '1000',
            permissions: '750',
        },
        posixUser: {
            gid: '1000',
            uid: '1000',
        },
    });

    return { fileSystem, accessPoint, lambdaSecurityGroup };
}
