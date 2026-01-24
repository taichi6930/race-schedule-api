import 'reflect-metadata';

import { container } from 'tsyringe';

import { PlaceController } from '../controller/placeController';
import { RaceController } from '../controller/raceController';
import type { IPlaceService } from '../service/interface/IPlaceService';
import type { IRaceService } from '../service/interface/IRaceService';
import { PlaceService } from '../service/placeService';
import { RaceService } from '../service/raceService';
import type { IPlaceUsecase } from '../usecase/interface/IPlaceUsecase';
import type { IRaceUsecase } from '../usecase/interface/IRaceUsecase';
import { PlaceUsecase } from '../usecase/placeUsecase';
import { RaceUsecase } from '../usecase/raceUsecase';

/**
 * Service層、Usecase層、Controller層のDI登録
 */
export const registerApplication = (): void => {
    // PlaceService
    container.register<IPlaceService>('PlaceService', {
        useClass: PlaceService,
    });

    // RaceService
    container.register<IRaceService>('RaceService', {
        useClass: RaceService,
    });

    // PlaceUsecase
    container.register<IPlaceUsecase>('PlaceUsecase', {
        useClass: PlaceUsecase,
    });

    // RaceUsecase
    container.register<IRaceUsecase>('RaceUsecase', {
        useClass: RaceUsecase,
    });

    // PlaceController
    container.register<PlaceController>(PlaceController, {
        useClass: PlaceController,
    });

    // RaceController
    container.register<RaceController>(RaceController, {
        useClass: RaceController,
    });
};
