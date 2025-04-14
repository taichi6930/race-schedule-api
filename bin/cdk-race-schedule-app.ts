#!/usr/bin/env node
import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';

import { CdkRaceScheduleAppStack } from '../lib/cdk-race-schedule-app-stack';

const app = new cdk.App();
new CdkRaceScheduleAppStack(app, 'CdkRaceScheduleAppStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    },
});
