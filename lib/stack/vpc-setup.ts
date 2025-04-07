import * as ec2 from 'aws-cdk-lib/aws-ec2';
import type { Construct } from 'constructs';

export function createVpc(scope: Construct): ec2.Vpc {
    return new ec2.Vpc(scope, 'RaceScheduleVpc', {
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
}
