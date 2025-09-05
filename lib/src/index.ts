import 'reflect-metadata';
import '../container'; // DIコンテナの設定をインポート

import serverlessExpress from '@codegenie/serverless-express';
import type { Application } from 'express';
import express from 'express';
import { container } from 'tsyringe';

import { PublicGamblingControllerFromAWS } from './controller/publicGamblingController';

// Expressアプリケーションの設定
const app: Application = express();

// DIコンテナからControllerを取得
const publicGamblingController = container.resolve(
    PublicGamblingControllerFromAWS,
);

// Expressの設定
app.use(express.json());

// ルーティングの設定
app.use('/api/races/all', publicGamblingController.router);

// health check
app.get('/health', (_, res) => {
    res.send('ok health check');
});

// Lambda用のハンドラーをエクスポート
export const handler = serverlessExpress({ app });

// アプリケーションの起動
const PORT = process.env.PORT ?? '3000';
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
