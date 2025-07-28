import 'reflect-metadata';
import '../container'; // DIコンテナの設定をインポート

import serverlessExpress from '@codegenie/serverless-express';
import type { Application } from 'express';
import express from 'express';
import { container } from 'tsyringe';

import { AutoraceRaceController } from './controller/autoraceRaceController';
import { BoatraceRaceController } from './controller/boatraceRaceController';
import { JraRaceController } from './controller/jraRaceController';
import { KeirinRaceController } from './controller/keirinRaceController';
import { NarRaceController } from './controller/narRaceController';
import { PublicGamblingController } from './controller/publicGamblingController';
import { WorldRaceController } from './controller/worldRaceController';

// Expressアプリケーションの設定
const app: Application = express();

// DIコンテナからControllerを取得
const narRaceController = container.resolve(NarRaceController);
const jraRaceController = container.resolve(JraRaceController);
const worldRaceController = container.resolve(WorldRaceController);
const keirinRaceController = container.resolve(KeirinRaceController);
const autoraceRaceController = container.resolve(AutoraceRaceController);
const boatraceController = container.resolve(BoatraceRaceController);
const publicGamblingController = container.resolve(PublicGamblingController);

// Expressの設定
app.use(express.json());

// ルーティングの設定
app.use('/api/races/nar', narRaceController.router);
app.use('/api/races/jra', jraRaceController.router);
app.use('/api/races/world', worldRaceController.router);
app.use('/api/races/keirin', keirinRaceController.router);
app.use('/api/races/autorace', autoraceRaceController.router);
app.use('/api/races/boatrace', boatraceController.router);
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
