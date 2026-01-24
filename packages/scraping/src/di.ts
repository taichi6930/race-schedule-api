import 'reflect-metadata';

import { container } from 'tsyringe';

import { PlaceController } from './controller/placeController';
import { RaceController } from './controller/raceController';
import { PlaceDataHtmlGateway } from './gateway/implement/placeDataHtmlGateway';
import { R2Gateway } from './gateway/implement/R2Gateway';
import { RaceDataHtmlGateway } from './gateway/implement/raceDataHtmlGateway';
import type { IPlaceDataHtmlGateway } from './gateway/interface/iPlaceDataHtmlGateway';
import type { IR2Gateway } from './gateway/interface/IR2Gateway';
import type { IRaceDataHtmlGateway } from './gateway/interface/iRaceDataHtmlGateway';
import { PlaceHtmlR2Repository } from './repository/implement/placeHtmlRepository';
import { RaceHtmlR2Repository } from './repository/implement/raceHtmlRepository';
import type { IPlaceHtmlRepository } from './repository/interface/IPlaceHtmlRepository';
import type { IRaceHtmlRepository } from './repository/interface/IRaceHtmlRepository';
import type { IPlaceService } from './service/interface/IPlaceService';
import type { IRaceService } from './service/interface/IRaceService';
import { PlaceService } from './service/placeService';
import { RaceService } from './service/raceService';
import type { IPlaceUsecase } from './usecase/interface/IPlaceUsecase';
import type { IRaceUsecase } from './usecase/interface/IRaceUsecase';
import { PlaceUsecase } from './usecase/placeUsecase';
import { RaceUsecase } from './usecase/raceUsecase';

container.register<IR2Gateway>('R2Gateway', {
    useClass: R2Gateway,
});

// HTML取得に必要なGateway/Repository
container.register<IPlaceDataHtmlGateway>('PlaceDataHtmlGateway', {
    useClass: PlaceDataHtmlGateway,
});
container.register<IPlaceHtmlRepository>('PlaceHtmlRepository', {
    useClass: PlaceHtmlR2Repository,
});

// Service
container.register<IPlaceService>('PlaceService', {
    useClass: PlaceService,
});

// PlaceUsecaseのDI登録
container.register<IPlaceUsecase>('PlaceUsecase', {
    useClass: PlaceUsecase,
});

// PlaceControllerのDI登録
container.register<PlaceController>(PlaceController, {
    useClass: PlaceController,
});

// Race関連のDI登録
container.register<IRaceDataHtmlGateway>('RaceDataHtmlGateway', {
    useClass: RaceDataHtmlGateway,
});
container.register<IRaceHtmlRepository>('RaceHtmlRepository', {
    useClass: RaceHtmlR2Repository,
});
container.register<IRaceService>('RaceService', {
    useClass: RaceService,
});
container.register<IRaceUsecase>('RaceUsecase', {
    useClass: RaceUsecase,
});
container.register<RaceController>(RaceController, {
    useClass: RaceController,
});
