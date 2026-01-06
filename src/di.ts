import 'reflect-metadata';

import { container } from 'tsyringe';

import { DBGateway } from './gateway/implement/dbGateway';
import { OldGoogleCalendarGateway } from './gateway/implement/oldGoogleCalendarGateway';
import { PlaceDataHtmlGateway } from './gateway/implement/placeDataHtmlGateway';
import { RaceDataHtmlGateway } from './gateway/implement/raceDataHtmlGateway';
import type { IDBGateway } from './gateway/interface/iDbGateway';
import type { IOldGoogleCalendarGateway } from './gateway/interface/iGoogleCalendarGateway';
import type { IPlaceDataHtmlGateway } from './gateway/interface/iPlaceDataHtmlGateway';
import type { IRaceDataHtmlGateway } from './gateway/interface/iRaceDataHtmlGateway';
import { GoogleCalendarRepository } from './repository/implement/googleCalendarRepository';
import { PlaceRepositoryFromHtml } from './repository/implement/placeRepositoryFromHtml';
import { PlaceRepositoryFromStorage } from './repository/implement/placeRepositoryFromStorage';
import { PlayerRepository } from './repository/implement/playerRepository';
import { RaceRepositoryFromHtml } from './repository/implement/raceRepositoryFromHtml';
import { RaceRepositoryFromStorage } from './repository/implement/raceRepositoryFromStorage';
import type { ICalendarRepository } from './repository/interface/ICalendarRepository';
import type { IPlaceRepository } from './repository/interface/IPlaceRepository';
import type { IPlayerRepository } from './repository/interface/IPlayerRepository';
import type { IRaceRepository } from './repository/interface/IRaceRepository';
import { OldCalendarService } from './service/implement/oldCalendarService';
import { OldPlaceService } from './service/implement/oldPlaceService';
import { OldRaceService } from './service/implement/oldRaceService';
import { PlayerService } from './service/implement/playerService';
import type { IOldCalendarService } from './service/interface/IOldCalendarService';
import type { IOldPlaceService } from './service/interface/IOldPlaceService';
import type { IOldRaceService } from './service/interface/IOldRaceService';
import type { IPlayerService } from './service/interface/IPlayerService';
import { OldCalendarUseCase } from './usecase/implement/oldCalendarUseCase';
import { OldPlaceUseCase } from './usecase/implement/oldPlaceUsecase';
import { OldRaceUseCase } from './usecase/implement/oldRaceUsecase';
import { PlayerUseCase } from './usecase/implement/playerUsecase';
import type { IOldCalendarUseCase } from './usecase/interface/IOldCalendarUseCase';
import type { IOldPlaceUseCase } from './usecase/interface/IOldPlaceUsecase';
import type { IOldRaceUseCase } from './usecase/interface/IOldRaceUsecase';
import type { IPlayerUseCase } from './usecase/interface/IPlayerUsecase';

container.register<IPlayerRepository>('PlayerRepository', {
    useClass: PlayerRepository,
});
container.register<IPlayerService>('PlayerService', {
    useClass: PlayerService,
});
container.register<IPlayerUseCase>('PlayerUsecase', {
    useClass: PlayerUseCase,
});
container.register<IDBGateway>('DBGateway', { useClass: DBGateway });
container.register<IRaceDataHtmlGateway>('RaceDataHtmlGateway', {
    useClass: RaceDataHtmlGateway,
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
container.register<IPlaceDataHtmlGateway>('PlaceDataHtmlGateway', {
    useClass: PlaceDataHtmlGateway,
});
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
container.register<IOldGoogleCalendarGateway>('GoogleCalendarGateway', {
    useClass: OldGoogleCalendarGateway,
});
container.register<ICalendarRepository>('CalendarRepository', {
    useClass: GoogleCalendarRepository,
});
container.register<IOldCalendarService>('CalendarService', {
    useClass: OldCalendarService,
});
container.register<IOldCalendarUseCase>('CalendarUsecase', {
    useClass: OldCalendarUseCase,
});

export { container } from 'tsyringe';
