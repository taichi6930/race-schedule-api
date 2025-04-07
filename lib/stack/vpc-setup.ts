import * as ec2 from 'aws-cdk-lib/aws-ec2';
import type { Construct } from 'constructs';

export function createVpc(scope: Construct): ec2.Vpc {
    const vpc = new ec2.Vpc(scope, 'RaceScheduleVpc', {
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
            {
                cidrMask: 24,
                name: 'Isolated',
                subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            },
        ],
    });

    // Lambda関数がVPC内から各種AWSサービスにアクセスするためのエンドポイントを追加
    vpc.addInterfaceEndpoint('CloudWatchLogsEndpoint', {
        service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
    });

    vpc.addInterfaceEndpoint('SecretsManagerEndpoint', {
        service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
    });

    vpc.addInterfaceEndpoint('SsmEndpoint', {
        service: ec2.InterfaceVpcEndpointAwsService.SSM,
    });

    return vpc;
}
