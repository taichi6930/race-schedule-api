import 'reflect-metadata';
import '../container'; // DIコンテナの設定をインポート

import serverlessExpress from '@codegenie/serverless-express';
import type { Application } from 'express';
import express from 'express';

// Expressアプリケーションの設定
const app: Application = express();

// Expressの設定
app.use(express.json());

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
