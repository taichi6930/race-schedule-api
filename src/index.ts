import "reflect-metadata";
import express from "express";
import serverlessExpress from '@codegenie/serverless-express';
import { container } from "tsyringe";
import { NarRaceData } from "./domain/narRaceData";
import { ICalendarService } from "./service/interface/ICalendarService";
import { IRaceRepository } from "./repository/interface/IRaceRepository";
import { NarPlaceData } from "./domain/narPlaceData";
import { NarRaceController } from "./controller/narRaceController";
import { IRaceCalendarUseCase } from "./usecase/interface/IRaceCalendarUseCase";
import { NarRaceCalendarUseCase } from "./usecase/implement/narRaceCalendarUseCase";
import { MockGoogleCalendarService } from "./service/mock/mockGoogleCalendarService";
import { NarRaceRepositoryFromS3Impl } from "./repository/implement/narRaceRepositoryFromS3Impl";
import { IS3Gateway } from "./gateway/interface/iS3Gateway";
import { MockS3Gateway } from "./gateway/mock/mockS3Gateway";

// Expressアプリケーションの設定
const app = express();

// DIコンテナの初期化
// s3Gatewayの実装クラスをDIコンテナに登錄する
container.register<IS3Gateway<NarRaceData>>(
    'IS3Gateway',
    { useFactory: () => new MockS3Gateway<NarRaceData>('race-schedule-bucket', 'nar/race/') }
);

// ICalendarServiceの実装クラスをDIコンテナに登錄する
container.register<ICalendarService<NarRaceData>>(
    'ICalendarService',
    { useClass: MockGoogleCalendarService }
);

// Repositoryの実装クラスをDIコンテナに登錄する
container.register<IRaceRepository<NarRaceData, NarPlaceData>>('IRaceRepositoryFromS3',
    { useClass: NarRaceRepositoryFromS3Impl }
);

// Usecaseの実装クラスをDIコンテナに登錄する
container.register<IRaceCalendarUseCase<NarRaceData>>(
    'IRaceCalendarUseCase',
    { useClass: NarRaceCalendarUseCase }
);

const narRaceController = container.resolve(NarRaceController);

app.use(express.json());
app.use('/api/races', narRaceController.router);

// Lambda用のハンドラーをエクスポート
export const handler = serverlessExpress({ app });

// アプリケーションの起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
