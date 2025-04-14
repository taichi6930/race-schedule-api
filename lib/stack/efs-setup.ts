import * as cdk from 'aws-cdk-lib';
import type * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as efs from 'aws-cdk-lib/aws-efs';
import { Construct } from 'constructs';

export class EfsSetup extends Construct {
    public readonly fileSystem: efs.FileSystem;
    public readonly accessPoint: efs.AccessPoint;

    public constructor(scope: Construct, id: string, vpc: ec2.IVpc) {
        super(scope, id);

        // EFSファイルシステムの作成
        this.fileSystem = new efs.FileSystem(this, 'RaceScheduleEfs', {
            vpc,
            removalPolicy: cdk.RemovalPolicy.DESTROY, // テスト環境用
            performanceMode: efs.PerformanceMode.GENERAL_PURPOSE,
            encrypted: true,
            lifecyclePolicy: efs.LifecyclePolicy.AFTER_14_DAYS, // 14日間アクセスのないファイルを IA に移動
            outOfInfrequentAccessPolicy:
                efs.OutOfInfrequentAccessPolicy.AFTER_1_ACCESS, // 1回のアクセスで IA から戻す
        });

        // アクセスポイントの作成
        this.accessPoint = this.fileSystem.addAccessPoint(
            'RaceScheduleEfsAccessPoint',
            {
                path: '/sqlite',
                createAcl: {
                    ownerGid: '1001',
                    ownerUid: '1001',
                    permissions: '755',
                },
                posixUser: {
                    gid: '1001',
                    uid: '1001',
                },
            },
        );
    }
}
