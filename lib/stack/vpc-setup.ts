import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class VpcSetup extends Construct {
    public readonly vpc: ec2.Vpc;

    public constructor(scope: Construct, id: string) {
        super(scope, id);

        // VPCの作成
        this.vpc = new ec2.Vpc(this, 'RaceScheduleVpc', {
            maxAzs: 2,
            natGateways: 1,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'Public',
                    subnetType: ec2.SubnetType.PUBLIC,
                },
                {
                    cidrMask: 24,
                    name: 'Private',
                    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
                },
            ],
        });

        // VPCエンドポイントの作成（EFSアクセス用）
        this.vpc.addInterfaceEndpoint('EfsEndpoint', {
            service: ec2.InterfaceVpcEndpointAwsService.ELASTIC_FILESYSTEM,
        });

        // タグの設定
        cdk.Tags.of(this.vpc).add('Name', 'RaceScheduleVpc');
    }
}
