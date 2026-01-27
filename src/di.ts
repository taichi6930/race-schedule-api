import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IDBGateway } from '../packages/api/src/gateway/interface/IDBGateway';
import type { IGoogleCalendarGateway } from '../packages/api/src/gateway/interface/iGoogleCalendarGateway';
import { DBGateway } from './gateway/implement/dbGateway';
import { OldGoogleCalendarGateway } from './gateway/implement/oldGoogleCalendarGateway';
import { ScrapingApiGateway } from './gateway/implement/scrapingApiGateway';
import type { IScrapingApiGateway } from './gateway/interface/iScrapingApiGateway';
import { OldGoogleCalendarRepository } from './repository/implement/oldGoogleCalendarRepository';
import { PlaceRepositoryFromHtml } from './repository/implement/placeRepositoryFromHtml';
import { PlaceRepositoryFromStorage } from './repository/implement/placeRepositoryFromStorage';
import { RaceRepositoryFromHtml } from './repository/implement/raceRepositoryFromHtml';
import { RaceRepositoryFromStorage } from './repository/implement/raceRepositoryFromStorage';
import type { ICalendarRepository } from './repository/interface/ICalendarRepository';
import type { IPlaceRepository } from './repository/interface/IPlaceRepository';
import type { IRaceRepository } from './repository/interface/IRaceRepository';
import { OldCalendarService } from './service/implement/oldCalendarService';
import { OldPlaceService } from './service/implement/oldPlaceService';
import { OldRaceService } from './service/implement/oldRaceService';
import type { IOldCalendarService } from './service/interface/IOldCalendarService';
import type { IOldPlaceService } from './service/interface/IOldPlaceService';
import type { IOldRaceService } from './service/interface/IOldRaceService';
import { OldCalendarUseCase } from './usecase/implement/oldCalendarUseCase';
import { OldPlaceUseCase } from './usecase/implement/oldPlaceUsecase';
import { OldRaceUseCase } from './usecase/implement/oldRaceUsecase';
import type { IOldCalendarUseCase } from './usecase/interface/IOldCalendarUseCase';
import type { IOldPlaceUseCase } from './usecase/interface/IOldPlaceUsecase';
import type { IOldRaceUseCase } from './usecase/interface/IOldRaceUsecase';

container.register<IDBGateway>('DBGateway', { useClass: DBGateway });

// ScrapingApiGatewayを登録
container.register<IScrapingApiGateway>('ScrapingApiGateway', {
    useClass: ScrapingApiGateway,
});
container.register<IRaceRepository>('RaceRepositoryFromStorage', {
    useClass: RaceRepositoryFromStorage,
});
container.register<IRaceRepository>('RaceRepositoryFromHtml', {
    useClass: RaceRepositoryFromHtml,
});
container.register<IOldRaceService>('RaceService', {
    useClass: OldRaceService,
});
container.register<IOldRaceUseCase>('RaceUsecase', {
    useClass: OldRaceUseCase,
});

// PlaceRepositoryとServiceの登録
container.register<IPlaceRepository>('PlaceRepositoryFromStorage', {
    useClass: PlaceRepositoryFromStorage,
});
container.register<IPlaceRepository>('PlaceRepositoryFromHtml', {
    useClass: PlaceRepositoryFromHtml,
});
container.register<IOldPlaceService>('PlaceService', {
    useClass: OldPlaceService,
});
container.register<IOldPlaceUseCase>('PlaceUsecase', {
    useClass: OldPlaceUseCase,
});
container.register<IGoogleCalendarGateway>('GoogleCalendarGateway', {
    useClass: OldGoogleCalendarGateway,
});
container.register<ICalendarRepository>('CalendarRepository', {
    useClass: OldGoogleCalendarRepository,
});
container.register<IOldCalendarService>('CalendarService', {
    useClass: OldCalendarService,
});
container.register<IOldCalendarUseCase>('CalendarUsecase', {
    useClass: OldCalendarUseCase,
});

export { container } from 'tsyringe';
