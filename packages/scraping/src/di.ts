import 'reflect-metadata';

import { container } from 'tsyringe';

import { PlaceController } from './controller/placeController';
import { PlaceDataHtmlGateway } from './gateway/implement/placeDataHtmlGateway';
import { R2Gateway } from './gateway/implement/R2Gateway';
import type { IPlaceDataHtmlGateway } from './gateway/interface/iPlaceDataHtmlGateway';
import type { IR2Gateway } from './gateway/interface/IR2Gateway';
import { PlaceHtmlR2Repository } from './repository/implement/placeHtmlRepository';
import type { IPlaceHtmlRepository } from './repository/interface/IPlaceHtmlRepository';
import { PlaceService } from './service/placeService';
import { PlaceUsecase } from './usecase/placeUsecase';

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
container.register<PlaceService>('PlaceService', {
    useClass: PlaceService,
});

// PlaceUsecaseのDI登録
container.register<PlaceUsecase>('PlaceUsecase', {
    useClass: PlaceUsecase,
});

// PlaceControllerのDI登録
container.register<PlaceController>(PlaceController, {
    useClass: PlaceController,
});
