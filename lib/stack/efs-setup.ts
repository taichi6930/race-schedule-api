import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as efs from 'aws-cdk-lib/aws-efs';
import { Construct } from 'constructs';

export class EfsSetup extends Construct {
    public readonly fileSystem: efs.FileSystem;
    public readonly accessPoint: efs.AccessPoint;

    public constructor(scope: Construct, id: string, vpc: ec2.Vpc) {
        super(scope, id);

        // EFSファイルシステムの作成
        this.fileSystem = new efs.FileSystem(this, 'RaceScheduleEfs', {
            vpc,
            lifecyclePolicy: efs.LifecyclePolicy.AFTER_14_DAYS,
            performanceMode: efs.PerformanceMode.GENERAL_PURPOSE,
            throughputMode: efs.ThroughputMode.BURSTING,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
            // セキュリティグループの設定
            securityGroup: new ec2.SecurityGroup(this, 'EfsSecurityGroup', {
                vpc,
                description: 'Security group for EFS',
                allowAllOutbound: true,
            }),
        });

        // アクセスポイントの作成（SQLite用）
        this.accessPoint = this.fileSystem.addAccessPoint('SqliteAccessPoint', {
            path: '/sqlite',
            createAcl: {
                ownerGid: '1000',
                ownerUid: '1000',
                permissions: '755',
            },
            posixUser: {
                gid: '1000',
                uid: '1000',
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
