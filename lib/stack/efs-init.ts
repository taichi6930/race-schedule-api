import * as cdk from 'aws-cdk-lib';
import type * as efs from 'aws-cdk-lib/aws-efs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

/**
 * EFSの初期化を行うカスタムリソース
 */
export class EfsInitializer extends Construct {
    public constructor(
        scope: Construct,
        id: string,
        props: {
            fileSystem: efs.FileSystem;
            accessPoint: efs.AccessPoint;
        },
    ) {
        super(scope, id);

        // EFS初期化用のLambda関数を作成
        const initFunction = new lambda.Function(this, 'EfsInitFunction', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'index.handler',
            code: lambda.Code.fromInline(`
                exports.handler = async (event) => {
                    const fs = require('fs').promises;
                    const path = require('path');
                    
                    // カスタムリソースのイベントタイプに応じて処理
                    if (event.RequestType === 'Create' || event.RequestType === 'Update') {
                        try {
                            // SQLiteディレクトリを作成
                            const dbDir = '/mnt/sqlite';
                            await fs.mkdir(dbDir, { recursive: true });
                            
                            // ディレクトリの権限を設定
                            await fs.chmod(dbDir, 0o775);
                            
                            // 初期化完了を通知
                            await sendResponse(event, 'SUCCESS', { Message: 'EFS initialized successfully' });
                        } catch (error) {
                            console.error('Error:', error);
                            await sendResponse(event, 'FAILED', { Message: error.message });
                        }
                    } else if (event.RequestType === 'Delete') {
                        // 削除時は何もしない
                        await sendResponse(event, 'SUCCESS', { Message: 'Nothing to do on delete' });
                    }
                };
                
                // CloudFormationにレスポンスを送信
                async function sendResponse(event, status, data) {
                    const https = require('https');
                    const url = require('url');
                    
                    const responseBody = JSON.stringify({
                        Status: status,
                        Reason: 'See the details in CloudWatch Log Stream',
                        PhysicalResourceId: event.LogicalResourceId,
                        StackId: event.StackId,
                        RequestId: event.RequestId,
                        LogicalResourceId: event.LogicalResourceId,
                        Data: data,
                    });
                    
                    const parsedUrl = url.parse(event.ResponseURL);
                    const options = {
                        hostname: parsedUrl.hostname,
                        port: 443,
                        path: parsedUrl.path,
                        method: 'PUT',
                        headers: {
                            'Content-Type': '',
                            'Content-Length': responseBody.length,
                        },
                    };
                    
                    return new Promise((resolve, reject) => {
                        const request = https.request(options, (response) => {
                            response.on('end', () => resolve());
                        });
                        
                        request.on('error', (error) => reject(error));
                        request.write(responseBody);
                        request.end();
                    });
                }
            `),
            filesystem: lambda.FileSystem.fromEfsAccessPoint(
                props.accessPoint,
                '/mnt/sqlite',
            ),
            timeout: cdk.Duration.seconds(30),
            memorySize: 512,
        });

        // カスタムリソースを作成
        new cdk.CustomResource(this, 'EfsInitResource', {
            serviceToken: initFunction.functionArn,
        });

        // 必要な権限を付与
        initFunction.role?.addToPrincipalPolicy(
            new iam.PolicyStatement({
                actions: [
                    'elasticfilesystem:ClientMount',
                    'elasticfilesystem:ClientWrite',
                ],
                resources: [props.fileSystem.fileSystemArn],
                effect: iam.Effect.ALLOW,
            }),
        );
    }
}
