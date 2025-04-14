import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as efs from 'aws-cdk-lib/aws-efs';
import { Construct } from 'constructs';

export class EfsSetup extends Construct {
    public readonly fileSystem: efs.FileSystem;
    public readonly accessPoint: efs.AccessPoint;

    public constructor(scope: Construct, id: string, vpc: ec2.IVpc) {
        super(scope, id);

        // EFSファイルシステムの作成
        this.fileSystem = new efs.FileSystem(this, 'FileSystem', {
            vpc,
            lifecyclePolicy: efs.LifecyclePolicy.AFTER_7_DAYS, // 7日間アクセスのないファイルはIA（低コスト）ストレージに移動
            performanceMode: efs.PerformanceMode.GENERAL_PURPOSE,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            securityGroup: new ec2.SecurityGroup(this, 'EfsSecurityGroup', {
                vpc,
                description: 'Allow EFS access',
                allowAllOutbound: true,
            }),
        });

        // アクセスポイントの作成
        this.accessPoint = this.fileSystem.addAccessPoint('LambdaAccessPoint', {
            path: '/lambda',
            createAcl: {
                ownerGid: '1001',
                ownerUid: '1001',
                permissions: '750',
            },
            posixUser: {
                gid: '1001',
                uid: '1001',
            },
        });
    }
}
