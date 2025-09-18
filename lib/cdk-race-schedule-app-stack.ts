import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';

// StackPropsを拡張してlambdaEnvを追加
export interface RaceScheduleAppStackProps extends cdk.StackProps {
    lambdaEnv: Record<string, string>;
}

export class CdkRaceScheduleAppStack extends cdk.Stack {
    public constructor(
        scope: Construct,
        id: string,
        props: RaceScheduleAppStackProps,
    ) {
        super(scope, id, props);
    }
}
