#!/usr/bin/env node

import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkRaceScheduleAppStack } from '../lib/cdk-race-schedule-app-stack';
import * as dotenv from 'dotenv';
import * as path from 'path';

const app = new cdk.App();

// 3環境分のStackを同時に生成（各.envを個別にパースしてpropsで渡す）
const stackEnv = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
};

function loadEnvFile(file: string): Record<string, string> {
    const result = dotenv.config({ path: path.resolve(__dirname, '..', file) });
    // dotenv.config()はprocess.envも書き換えるが、result.parsedで値を取得できる
    // undefinedの場合は空オブジェクト
    return result.parsed ? { ...result.parsed } : {};
}

const prodEnv = loadEnvFile('.env.production');
const testEnv = loadEnvFile('.env.test');
const devEnv = loadEnvFile('.env.dev');

// If LAMBDA_LAYER_ARN is present in the .env.production, pass it to the stack so the Lambda receives the native layer.
const prodLayerArn =
    prodEnv['LAMBDA_LAYER_ARN'] ||
    process.env.LAMBDA_LAYER_ARN ||
    'arn:aws:lambda:ap-northeast-1:485169041965:layer:better-sqlite3:3';

new CdkRaceScheduleAppStack(app, 'CdkRaceScheduleAppStack-Prod', {
    env: stackEnv,
    lambdaEnv: prodEnv,
    lambdaLayerArn: prodLayerArn,
});
new CdkRaceScheduleAppStack(app, 'CdkRaceScheduleAppStack-Test', {
    env: stackEnv,
    lambdaEnv: testEnv,
});
new CdkRaceScheduleAppStack(app, 'CdkRaceScheduleAppStack-Dev', {
    env: stackEnv,
    lambdaEnv: devEnv,
});
