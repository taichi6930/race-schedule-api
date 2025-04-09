#!/usr/bin/env node
import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';

import {
    ProductionRaceScheduleAppStack,
    TestRaceScheduleAppStack,
} from '../lib/cdk-race-schedule-app-stack';

const app = new cdk.App();

// 環境変数を使用してAWSアカウントとリージョンを設定
const env = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
};

// 本番環境のスタックをデプロイ
new ProductionRaceScheduleAppStack(app, 'RaceScheduleAppStack-Prod', {
    env,
    description: 'Race Schedule App Production Stack',
});

// テスト環境のスタックをデプロイ
new TestRaceScheduleAppStack(app, 'RaceScheduleAppStack-Test', {
    env,
    description: 'Race Schedule App Test Stack',
});
