import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as efs from 'aws-cdk-lib/aws-efs';
import { Construct } from 'constructs';

export class EfsSetup extends Construct {
    public readonly fileSystem: efs.FileSystem;
    public readonly accessPoint: efs.AccessPoint;

    public constructor(scope: Construct, id: string, vpc: ec2.Vpc) {
        super(scope, id);

        // EFS用のセキュリティグループを作成
        const securityGroup = new ec2.SecurityGroup(this, 'EfsSecurityGroup', {
            vpc,
            description: 'Security group for EFS',
            allowAllOutbound: true,
        });

        // NFS (2049) ポートへのアクセスを許可
        securityGroup.addIngressRule(
            ec2.Peer.ipv4(vpc.vpcCidrBlock),
            ec2.Port.tcp(2049),
            'Allow NFS access from within VPC',
        );

        // EFSファイルシステムの作成
        this.fileSystem = new efs.FileSystem(this, 'RaceScheduleEfs', {
            vpc,
            lifecyclePolicy: efs.LifecyclePolicy.AFTER_14_DAYS,
            performanceMode: efs.PerformanceMode.GENERAL_PURPOSE,
            throughputMode: efs.ThroughputMode.BURSTING,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
            securityGroup,
        });

        // アクセスポイントの作成（SQLite用）
        this.accessPoint = this.fileSystem.addAccessPoint('SqliteAccessPoint', {
            path: '/sqlite',
            createAcl: {
                ownerGid: '1001', // Lambdaプロセスのgid
                ownerUid: '1001', // Lambdaプロセスのuid
                permissions: '775', // グループメンバーにも書き込み権限を付与
            },
            posixUser: {
                gid: '1001', // Lambdaプロセスのgid
                uid: '1001', // Lambdaプロセスのuid
                secondaryGids: [], // 必要に応じて追加のグループIDを設定
            },
        });

        // タグの設定
        cdk.Tags.of(this.fileSystem).add('Name', 'RaceScheduleEfs');
    }

    /**
     * Lambda関数用のEFSマウントポイントを作成
     */
    public createEfsMountPoint(): efs.AccessPoint {
        return this.accessPoint;
    }
}
