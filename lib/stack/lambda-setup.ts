import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import { aws_lambda_nodejs } from 'aws-cdk-lib';
import * as aws_ec2 from 'aws-cdk-lib/aws-ec2';
import * as aws_efs from 'aws-cdk-lib/aws-efs';
import type { Role } from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import type { Construct } from 'constructs';

import type { EnvType } from '../src/utility/env';
import { allowedEnvs } from '../src/utility/env';

interface VpcResources {
    vpc: aws_ec2.IVpc;
    lambdaSg: aws_ec2.SecurityGroup;
    efsSg: aws_ec2.SecurityGroup;
}

interface EfsResources {
    fileSystem: aws_efs.FileSystem;
    accessPoint: aws_efs.AccessPoint;
}

export function createVpcResources(scope: Construct): VpcResources {
    // 既存のデフォルトVPCを使用
    const vpc = aws_ec2.Vpc.fromLookup(scope, 'DefaultVPC', {
        isDefault: true,
    });

    // Lambdaのセキュリティグループ
    const lambdaSg = new aws_ec2.SecurityGroup(scope, 'LambdaSecurityGroup', {
        vpc,
        description: 'Security group for Lambda functions',
        allowAllOutbound: true,
    });

    // EFSのセキュリティグループ
    const efsSg = new aws_ec2.SecurityGroup(scope, 'EFSSecurityGroup', {
        vpc,
        description: 'Security group for EFS',
        allowAllOutbound: false,
    });

    // EFSからLambdaへのアクセスを許可
    efsSg.addIngressRule(
        lambdaSg,
        aws_ec2.Port.tcp(2049),
        'Allow NFS access from Lambda',
    );

    return { vpc, lambdaSg, efsSg };
}

export function createEfsResources(
    scope: Construct,
    vpc: aws_ec2.IVpc,
    efsSg: aws_ec2.SecurityGroup,
): EfsResources {
    // EFSファイルシステムの作成
    const fileSystem = new aws_efs.FileSystem(scope, 'RaceScheduleEFS', {
        vpc,
        securityGroup: efsSg,
        performanceMode: aws_efs.PerformanceMode.GENERAL_PURPOSE,
        lifecyclePolicy: aws_efs.LifecyclePolicy.AFTER_30_DAYS,
        encrypted: true,
        removalPolicy: RemovalPolicy.DESTROY,
    });

    // EFSアクセスポイントの作成
    const accessPoint = fileSystem.addAccessPoint(
        'RaceScheduleEFSAccessPoint',
        {
            path: '/sqlite',
            createAcl: {
                ownerGid: '1001',
                ownerUid: '1001',
                permissions: '750',
            },
            posixUser: {
                gid: '1001',
                uid: '1001',
            },
        },
    );

    return { fileSystem, accessPoint };
}

export function createLambdaFunction(
    scope: Construct,
    role: Role,
    suffix: string,
    funcEnv: EnvType,
    vpc: aws_ec2.IVpc,
    lambdaSg: aws_ec2.SecurityGroup,
    efsAccessPoint: aws_efs.AccessPoint,
): aws_lambda_nodejs.NodejsFunction {
    return new aws_lambda_nodejs.NodejsFunction(
        scope,
        `RaceScheduleAppLambda${suffix}`,
        {
            architecture: lambda.Architecture.ARM_64,
            runtime: lambda.Runtime.NODEJS_20_X,
            entry: 'lib/src/index.ts',
            role,
            vpc,
            vpcSubnets: {
                subnetType: aws_ec2.SubnetType.PUBLIC,
            },
            allowPublicSubnet: true,
            securityGroups: [lambdaSg],
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
                EFS_MOUNT_PATH: '/mnt/sqlite',
            },
            timeout: Duration.seconds(900),
            memorySize: 1024,
            filesystem: lambda.FileSystem.fromEfsAccessPoint(
                efsAccessPoint,
                '/mnt/sqlite',
            ),
        },
    );
}
