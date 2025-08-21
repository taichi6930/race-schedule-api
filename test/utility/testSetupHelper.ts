import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IS3Gateway } from '../../lib/src/gateway/interface/iS3Gateway';
import type { RaceEntity } from '../../lib/src/repository/entity/raceEntity';
import type { ICalendarRepository } from '../../lib/src/repository/interface/ICalendarRepository';
import type { IPlaceRepository } from '../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../lib/src/repository/interface/IRaceRepository';
import type { ICalendarService } from '../../lib/src/service/interface/ICalendarService';
import type { IPlaceDataService } from '../../lib/src/service/interface/IPlaceDataService';
import type { IPlayerDataService } from '../../lib/src/service/interface/IPlayerDataService';
import type { IRaceDataService } from '../../lib/src/service/interface/IRaceDataService';
import { mockS3Gateway } from '../unittest/src/mock/gateway/mockS3Gateway';
import { mockCalendarRepository } from '../unittest/src/mock/repository/mockCalendarRepository';
import { mockPlaceRepository } from '../unittest/src/mock/repository/mockPlaceRepository';
import { mockRaceRepository } from '../unittest/src/mock/repository/mockRaceRepository';
import { calendarServiceMock } from '../unittest/src/mock/service/calendarServiceMock';
import { placeDataServiceMock } from '../unittest/src/mock/service/placeDataServiceMock';
import { playerDataServiceMock } from '../unittest/src/mock/service/playerDataServiceMock';
import { raceDataServiceMock } from '../unittest/src/mock/service/raceDataServiceMock';

/**
 * afterEach処理の共通化
 */
export function clearMocks(): void {
    jest.clearAllMocks();
}

/**
 * テスト用のセットアップ
 */
export interface TestSetup {
    s3Gateway: jest.Mocked<IS3Gateway>;
    calendarRepository: jest.Mocked<ICalendarRepository>;
    jraPlaceRepositoryFromHtml: jest.Mocked<IPlaceRepository>;
    placeRepositoryFromStorage: jest.Mocked<IPlaceRepository>;
    narPlaceRepositoryFromHtml: jest.Mocked<IPlaceRepository>;
    keirinPlaceRepositoryFromHtml: jest.Mocked<IPlaceRepository>;
    boatracePlaceRepositoryFromHtml: jest.Mocked<IPlaceRepository>;
    autoracePlaceRepositoryFromHtml: jest.Mocked<IPlaceRepository>;
    raceRepositoryFromStorage: jest.Mocked<IRaceRepository<RaceEntity>>;
    jraRaceRepositoryFromHtml: jest.Mocked<IRaceRepository<RaceEntity>>;
    narRaceRepositoryFromHtml: jest.Mocked<IRaceRepository<RaceEntity>>;
    overseasRaceRepositoryFromHtml: jest.Mocked<IRaceRepository<RaceEntity>>;
    mechanicalRacingRaceRepositoryFromStorage: jest.Mocked<
        IRaceRepository<RaceEntity>
    >;
    keirinRaceRepositoryFromHtml: jest.Mocked<IRaceRepository<RaceEntity>>;
    boatraceRaceRepositoryFromHtml: jest.Mocked<IRaceRepository<RaceEntity>>;
    autoraceRaceRepositoryFromHtml: jest.Mocked<IRaceRepository<RaceEntity>>;
    calendarService: jest.Mocked<ICalendarService>;
    raceDataService: jest.Mocked<IRaceDataService>;
    placeDataService: jest.Mocked<IPlaceDataService>;
    playerDataService: jest.Mocked<IPlayerDataService>;
}

/**
 * テスト用のセットアップ
 * @returns セットアップ済みのサービス
 */
export function setupTestMock(): TestSetup {
    const s3Gateway = mockS3Gateway();
    container.registerInstance('S3Gateway', s3Gateway);

    const raceRepositoryFromStorage = mockRaceRepository<RaceEntity>();
    container.registerInstance<IRaceRepository<RaceEntity>>(
        'RaceRepositoryFromStorage',
        raceRepositoryFromStorage,
    );
    const jraRaceRepositoryFromHtml = mockRaceRepository<RaceEntity>();
    container.registerInstance<IRaceRepository<RaceEntity>>(
        'JraRaceRepositoryFromHtml',
        jraRaceRepositoryFromHtml,
    );
    const narRaceRepositoryFromHtml = mockRaceRepository<RaceEntity>();
    container.registerInstance<IRaceRepository<RaceEntity>>(
        'NarRaceRepositoryFromHtml',
        narRaceRepositoryFromHtml,
    );
    const overseasRaceRepositoryFromHtml = mockRaceRepository<RaceEntity>();
    container.registerInstance<IRaceRepository<RaceEntity>>(
        'OverseasRaceRepositoryFromHtml',
        overseasRaceRepositoryFromHtml,
    );

    const mechanicalRacingRaceRepositoryFromStorage =
        mockRaceRepository<RaceEntity>();
    container.registerInstance<IRaceRepository<RaceEntity>>(
        'MechanicalRacingRaceRepositoryFromStorage',
        mechanicalRacingRaceRepositoryFromStorage,
    );

    const keirinRaceRepositoryFromHtml = mockRaceRepository<RaceEntity>();
    container.registerInstance<IRaceRepository<RaceEntity>>(
        'KeirinRaceRepositoryFromHtml',
        keirinRaceRepositoryFromHtml,
    );

    const boatraceRaceRepositoryFromHtml = mockRaceRepository<RaceEntity>();
    container.registerInstance<IRaceRepository<RaceEntity>>(
        'BoatraceRaceRepositoryFromHtml',
        boatraceRaceRepositoryFromHtml,
    );

    const autoraceRaceRepositoryFromHtml = mockRaceRepository<RaceEntity>();
    container.registerInstance<IRaceRepository<RaceEntity>>(
        'AutoraceRaceRepositoryFromHtml',
        autoraceRaceRepositoryFromHtml,
    );

    const calendarRepository = mockCalendarRepository();
    container.registerInstance('CalendarRepository', calendarRepository);

    const jraPlaceRepositoryFromHtml = mockPlaceRepository();
    container.registerInstance<IPlaceRepository>(
        'JraPlaceRepositoryFromHtml',
        jraPlaceRepositoryFromHtml,
    );
    const placeRepositoryFromStorage = mockPlaceRepository();
    container.registerInstance<IPlaceRepository>(
        'PlaceRepositoryFromStorage',
        placeRepositoryFromStorage,
    );
    const narPlaceRepositoryFromHtml = mockPlaceRepository();
    container.registerInstance<IPlaceRepository>(
        'NarPlaceRepositoryFromHtml',
        narPlaceRepositoryFromHtml,
    );
    const keirinPlaceRepositoryFromHtml = mockPlaceRepository();
    container.registerInstance<IPlaceRepository>(
        'KeirinPlaceRepositoryFromHtml',
        keirinPlaceRepositoryFromHtml,
    );
    const boatracePlaceRepositoryFromHtml = mockPlaceRepository();
    container.registerInstance<IPlaceRepository>(
        'BoatracePlaceRepositoryFromHtml',
        boatracePlaceRepositoryFromHtml,
    );
    const autoracePlaceRepositoryFromHtml = mockPlaceRepository();
    container.registerInstance<IPlaceRepository>(
        'AutoracePlaceRepositoryFromHtml',
        autoracePlaceRepositoryFromHtml,
    );
    const calendarService = calendarServiceMock();
    container.registerInstance<ICalendarService>(
        'PublicGamblingCalendarService',
        calendarService,
    );
    const raceDataService = raceDataServiceMock();
    container.registerInstance<IRaceDataService>(
        'PublicGamblingRaceDataService',
        raceDataService,
    );
    const placeDataService = placeDataServiceMock();
    container.registerInstance<IPlaceDataService>(
        'PublicGamblingPlaceDataService',
        placeDataService,
    );
    const playerDataService = playerDataServiceMock();
    container.registerInstance<IPlayerDataService>(
        'PlayerDataService',
        playerDataService,
    );

    return {
        s3Gateway,
        calendarRepository,
        jraPlaceRepositoryFromHtml,
        placeRepositoryFromStorage,
        narPlaceRepositoryFromHtml,
        keirinPlaceRepositoryFromHtml,
        boatracePlaceRepositoryFromHtml,
        autoracePlaceRepositoryFromHtml,
        raceRepositoryFromStorage,
        jraRaceRepositoryFromHtml,
        narRaceRepositoryFromHtml,
        overseasRaceRepositoryFromHtml,
        mechanicalRacingRaceRepositoryFromStorage,
        keirinRaceRepositoryFromHtml,
        boatraceRaceRepositoryFromHtml,
        autoraceRaceRepositoryFromHtml,
        calendarService,
        raceDataService,
        placeDataService,
        playerDataService,
    };
}
