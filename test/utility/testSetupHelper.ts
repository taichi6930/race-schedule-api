import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IS3Gateway } from '../../lib/src/gateway/interface/iS3Gateway';
import type { PlaceEntity } from '../../lib/src/repository/entity/placeEntity';
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
    jraPlaceRepositoryFromHtml: jest.Mocked<IPlaceRepository<PlaceEntity>>;
    placeRepositoryFromStorage: jest.Mocked<IPlaceRepository<PlaceEntity>>;
    narPlaceRepositoryFromHtml: jest.Mocked<IPlaceRepository<PlaceEntity>>;
    keirinPlaceRepositoryFromHtml: jest.Mocked<IPlaceRepository<PlaceEntity>>;
    boatracePlaceRepositoryFromHtml: jest.Mocked<IPlaceRepository<PlaceEntity>>;
    autoracePlaceRepositoryFromHtml: jest.Mocked<IPlaceRepository<PlaceEntity>>;
    raceRepositoryFromStorage: jest.Mocked<
        IRaceRepository<RaceEntity, PlaceEntity>
    >;
    jraRaceRepositoryFromHtml: jest.Mocked<
        IRaceRepository<RaceEntity, PlaceEntity>
    >;
    narRaceRepositoryFromHtml: jest.Mocked<
        IRaceRepository<RaceEntity, PlaceEntity>
    >;
    overseasRaceRepositoryFromHtml: jest.Mocked<
        IRaceRepository<RaceEntity, PlaceEntity>
    >;
    mechanicalRacingRaceRepositoryFromStorage: jest.Mocked<
        IRaceRepository<RaceEntity, PlaceEntity>
    >;
    keirinRaceRepositoryFromHtml: jest.Mocked<
        IRaceRepository<RaceEntity, PlaceEntity>
    >;
    boatraceRaceRepositoryFromHtml: jest.Mocked<
        IRaceRepository<RaceEntity, PlaceEntity>
    >;
    autoraceRaceRepositoryFromHtml: jest.Mocked<
        IRaceRepository<RaceEntity, PlaceEntity>
    >;
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

    const raceRepositoryFromStorage = mockRaceRepository<
        RaceEntity,
        PlaceEntity
    >();
    container.registerInstance<IRaceRepository<RaceEntity, PlaceEntity>>(
        'RaceRepositoryFromStorage',
        raceRepositoryFromStorage,
    );
    const jraRaceRepositoryFromHtml = mockRaceRepository<
        RaceEntity,
        PlaceEntity
    >();
    container.registerInstance<IRaceRepository<RaceEntity, PlaceEntity>>(
        'JraRaceRepositoryFromHtml',
        jraRaceRepositoryFromHtml,
    );
    const narRaceRepositoryFromHtml = mockRaceRepository<
        RaceEntity,
        PlaceEntity
    >();
    container.registerInstance<IRaceRepository<RaceEntity, PlaceEntity>>(
        'NarRaceRepositoryFromHtml',
        narRaceRepositoryFromHtml,
    );
    const overseasRaceRepositoryFromHtml = mockRaceRepository<
        RaceEntity,
        PlaceEntity
    >();
    container.registerInstance<IRaceRepository<RaceEntity, PlaceEntity>>(
        'OverseasRaceRepositoryFromHtml',
        overseasRaceRepositoryFromHtml,
    );

    const mechanicalRacingRaceRepositoryFromStorage = mockRaceRepository<
        RaceEntity,
        PlaceEntity
    >();
    container.registerInstance<IRaceRepository<RaceEntity, PlaceEntity>>(
        'MechanicalRacingRaceRepositoryFromStorage',
        mechanicalRacingRaceRepositoryFromStorage,
    );

    const keirinRaceRepositoryFromHtml = mockRaceRepository<
        RaceEntity,
        PlaceEntity
    >();
    container.registerInstance<IRaceRepository<RaceEntity, PlaceEntity>>(
        'KeirinRaceRepositoryFromHtml',
        keirinRaceRepositoryFromHtml,
    );

    const boatraceRaceRepositoryFromHtml = mockRaceRepository<
        RaceEntity,
        PlaceEntity
    >();
    container.registerInstance<IRaceRepository<RaceEntity, PlaceEntity>>(
        'BoatraceRaceRepositoryFromHtml',
        boatraceRaceRepositoryFromHtml,
    );

    const autoraceRaceRepositoryFromHtml = mockRaceRepository<
        RaceEntity,
        PlaceEntity
    >();
    container.registerInstance<IRaceRepository<RaceEntity, PlaceEntity>>(
        'AutoraceRaceRepositoryFromHtml',
        autoraceRaceRepositoryFromHtml,
    );

    const calendarRepository = mockCalendarRepository();
    container.registerInstance('CalendarRepository', calendarRepository);

    const jraPlaceRepositoryFromHtml = mockPlaceRepository<PlaceEntity>();
    container.registerInstance<IPlaceRepository<PlaceEntity>>(
        'JraPlaceRepositoryFromHtml',
        jraPlaceRepositoryFromHtml,
    );
    const placeRepositoryFromStorage = mockPlaceRepository<PlaceEntity>();
    container.registerInstance<IPlaceRepository<PlaceEntity>>(
        'PlaceRepositoryFromStorage',
        placeRepositoryFromStorage,
    );
    const narPlaceRepositoryFromHtml = mockPlaceRepository<PlaceEntity>();
    container.registerInstance<IPlaceRepository<PlaceEntity>>(
        'NarPlaceRepositoryFromHtml',
        narPlaceRepositoryFromHtml,
    );
    const keirinPlaceRepositoryFromHtml = mockPlaceRepository<PlaceEntity>();
    container.registerInstance<IPlaceRepository<PlaceEntity>>(
        'KeirinPlaceRepositoryFromHtml',
        keirinPlaceRepositoryFromHtml,
    );
    const boatracePlaceRepositoryFromHtml = mockPlaceRepository<PlaceEntity>();
    container.registerInstance<IPlaceRepository<PlaceEntity>>(
        'BoatracePlaceRepositoryFromHtml',
        boatracePlaceRepositoryFromHtml,
    );
    const autoracePlaceRepositoryFromHtml = mockPlaceRepository<PlaceEntity>();
    container.registerInstance<IPlaceRepository<PlaceEntity>>(
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
