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
    jraPlaceRepositoryFromHtmlImpl: jest.Mocked<IPlaceRepository<PlaceEntity>>;
    placeRepositoryFromStorageImpl: jest.Mocked<IPlaceRepository<PlaceEntity>>;
    narPlaceRepositoryFromHtmlImpl: jest.Mocked<IPlaceRepository<PlaceEntity>>;
    keirinPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<PlaceEntity>
    >;
    boatracePlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<PlaceEntity>
    >;
    autoracePlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<PlaceEntity>
    >;
    raceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<RaceEntity, PlaceEntity>
    >;
    jraRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<RaceEntity, PlaceEntity>
    >;
    narRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<RaceEntity, PlaceEntity>
    >;
    overseasRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<RaceEntity, PlaceEntity>
    >;
    mechanicalRacingRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<RaceEntity, PlaceEntity>
    >;
    keirinRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<RaceEntity, PlaceEntity>
    >;
    boatraceRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<RaceEntity, PlaceEntity>
    >;
    autoraceRaceRepositoryFromHtmlImpl: jest.Mocked<
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

    const raceRepositoryFromStorageImpl = mockRaceRepository<
        RaceEntity,
        PlaceEntity
    >();
    container.registerInstance<IRaceRepository<RaceEntity, PlaceEntity>>(
        'RaceRepositoryFromStorage',
        raceRepositoryFromStorageImpl,
    );
    const jraRaceRepositoryFromHtmlImpl = mockRaceRepository<
        RaceEntity,
        PlaceEntity
    >();
    container.registerInstance<IRaceRepository<RaceEntity, PlaceEntity>>(
        'JraRaceRepositoryFromHtml',
        jraRaceRepositoryFromHtmlImpl,
    );
    const narRaceRepositoryFromHtmlImpl = mockRaceRepository<
        RaceEntity,
        PlaceEntity
    >();
    container.registerInstance<IRaceRepository<RaceEntity, PlaceEntity>>(
        'NarRaceRepositoryFromHtml',
        narRaceRepositoryFromHtmlImpl,
    );
    const overseasRaceRepositoryFromHtmlImpl = mockRaceRepository<
        RaceEntity,
        PlaceEntity
    >();
    container.registerInstance<IRaceRepository<RaceEntity, PlaceEntity>>(
        'OverseasRaceRepositoryFromHtml',
        overseasRaceRepositoryFromHtmlImpl,
    );

    const mechanicalRacingRaceRepositoryFromStorageImpl = mockRaceRepository<
        RaceEntity,
        PlaceEntity
    >();
    container.registerInstance<IRaceRepository<RaceEntity, PlaceEntity>>(
        'MechanicalRacingRaceRepositoryFromStorage',
        mechanicalRacingRaceRepositoryFromStorageImpl,
    );

    const keirinRaceRepositoryFromHtmlImpl = mockRaceRepository<
        RaceEntity,
        PlaceEntity
    >();
    container.registerInstance<IRaceRepository<RaceEntity, PlaceEntity>>(
        'KeirinRaceRepositoryFromHtml',
        keirinRaceRepositoryFromHtmlImpl,
    );

    const boatraceRaceRepositoryFromHtmlImpl = mockRaceRepository<
        RaceEntity,
        PlaceEntity
    >();
    container.registerInstance<IRaceRepository<RaceEntity, PlaceEntity>>(
        'BoatraceRaceRepositoryFromHtml',
        boatraceRaceRepositoryFromHtmlImpl,
    );

    const autoraceRaceRepositoryFromHtmlImpl = mockRaceRepository<
        RaceEntity,
        PlaceEntity
    >();
    container.registerInstance<IRaceRepository<RaceEntity, PlaceEntity>>(
        'AutoraceRaceRepositoryFromHtml',
        autoraceRaceRepositoryFromHtmlImpl,
    );

    const calendarRepository = mockCalendarRepository();
    container.registerInstance('CalendarRepository', calendarRepository);

    const jraPlaceRepositoryFromHtmlImpl = mockPlaceRepository<PlaceEntity>();
    container.registerInstance<IPlaceRepository<PlaceEntity>>(
        'JraPlaceRepositoryFromHtml',
        jraPlaceRepositoryFromHtmlImpl,
    );
    const placeRepositoryFromStorageImpl = mockPlaceRepository<PlaceEntity>();
    container.registerInstance<IPlaceRepository<PlaceEntity>>(
        'PlaceRepositoryFromStorage',
        placeRepositoryFromStorageImpl,
    );
    const narPlaceRepositoryFromHtmlImpl = mockPlaceRepository<PlaceEntity>();
    container.registerInstance<IPlaceRepository<PlaceEntity>>(
        'NarPlaceRepositoryFromHtml',
        narPlaceRepositoryFromHtmlImpl,
    );
    const keirinPlaceRepositoryFromHtmlImpl =
        mockPlaceRepository<PlaceEntity>();
    container.registerInstance<IPlaceRepository<PlaceEntity>>(
        'KeirinPlaceRepositoryFromHtml',
        keirinPlaceRepositoryFromHtmlImpl,
    );
    const boatracePlaceRepositoryFromHtmlImpl =
        mockPlaceRepository<PlaceEntity>();
    container.registerInstance<IPlaceRepository<PlaceEntity>>(
        'BoatracePlaceRepositoryFromHtml',
        boatracePlaceRepositoryFromHtmlImpl,
    );
    const autoracePlaceRepositoryFromHtmlImpl =
        mockPlaceRepository<PlaceEntity>();
    container.registerInstance<IPlaceRepository<PlaceEntity>>(
        'AutoracePlaceRepositoryFromHtml',
        autoracePlaceRepositoryFromHtmlImpl,
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
        jraPlaceRepositoryFromHtmlImpl,
        placeRepositoryFromStorageImpl,
        narPlaceRepositoryFromHtmlImpl,
        keirinPlaceRepositoryFromHtmlImpl,
        boatracePlaceRepositoryFromHtmlImpl,
        autoracePlaceRepositoryFromHtmlImpl,
        raceRepositoryFromStorageImpl,
        jraRaceRepositoryFromHtmlImpl,
        narRaceRepositoryFromHtmlImpl,
        overseasRaceRepositoryFromHtmlImpl,
        mechanicalRacingRaceRepositoryFromStorageImpl,
        keirinRaceRepositoryFromHtmlImpl,
        boatraceRaceRepositoryFromHtmlImpl,
        autoraceRaceRepositoryFromHtmlImpl,
        calendarService,
        raceDataService,
        placeDataService,
        playerDataService,
    };
}
