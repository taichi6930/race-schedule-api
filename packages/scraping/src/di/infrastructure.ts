import 'reflect-metadata';

import { container } from 'tsyringe';

import { PlaceDataHtmlGateway } from '../gateway/implement/placeDataHtmlGateway';
import { R2Gateway } from '../gateway/implement/R2Gateway';
import { RaceDataHtmlGateway } from '../gateway/implement/raceDataHtmlGateway';
import type { IPlaceDataHtmlGateway } from '../gateway/interface/iPlaceDataHtmlGateway';
import type { IR2Gateway } from '../gateway/interface/IR2Gateway';
import type { IRaceDataHtmlGateway } from '../gateway/interface/iRaceDataHtmlGateway';
import { PlaceHtmlR2Repository } from '../repository/implement/placeHtmlRepository';
import { RaceHtmlR2Repository } from '../repository/implement/raceHtmlRepository';
import type { IPlaceHtmlRepository } from '../repository/interface/IPlaceHtmlRepository';
import type { IRaceHtmlRepository } from '../repository/interface/IRaceHtmlRepository';

/**
 * Gateway層とRepository層のDI登録
 */
export const registerInfrastructure = (): void => {
    // R2Gateway
    container.register<IR2Gateway>('R2Gateway', {
        useClass: R2Gateway,
    });

    // PlaceDataHtmlGateway
    container.register<IPlaceDataHtmlGateway>('PlaceDataHtmlGateway', {
        useClass: PlaceDataHtmlGateway,
    });

    // RaceDataHtmlGateway
    container.register<IRaceDataHtmlGateway>('RaceDataHtmlGateway', {
        useClass: RaceDataHtmlGateway,
    });

    // PlaceHtmlRepository
    container.register<IPlaceHtmlRepository>('PlaceHtmlRepository', {
        useClass: PlaceHtmlR2Repository,
    });

    // RaceHtmlRepository
    container.register<IRaceHtmlRepository>('RaceHtmlRepository', {
        useClass: RaceHtmlR2Repository,
    });
};
