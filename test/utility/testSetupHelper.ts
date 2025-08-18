import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IS3Gateway } from '../../lib/src/gateway/interface/iS3Gateway';
import type { HorseRacingRaceEntity } from '../../lib/src/repository/entity/horseRacingRaceEntity';
import type { JraRaceEntity } from '../../lib/src/repository/entity/jraRaceEntity';
import type { MechanicalRacingPlaceEntity } from '../../lib/src/repository/entity/mechanicalRacingPlaceEntity';
import type { MechanicalRacingRaceEntity } from '../../lib/src/repository/entity/mechanicalRacingRaceEntity';
import type { PlaceEntity } from '../../lib/src/repository/entity/placeEntity';
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
    horseRacingPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<PlaceEntity>
    >;
    narPlaceRepositoryFromHtmlImpl: jest.Mocked<IPlaceRepository<PlaceEntity>>;
    mechanicalRacingPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<MechanicalRacingPlaceEntity>
    >;
    keirinPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<MechanicalRacingPlaceEntity>
    >;
    boatracePlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<MechanicalRacingPlaceEntity>
    >;
    autoracePlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<MechanicalRacingPlaceEntity>
    >;
    jraRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<JraRaceEntity, PlaceEntity>
    >;
    jraRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<JraRaceEntity, PlaceEntity>
    >;
    horseRacingRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<HorseRacingRaceEntity, PlaceEntity>
    >;
    narRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<HorseRacingRaceEntity, PlaceEntity>
    >;
    overseasRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<HorseRacingRaceEntity, PlaceEntity>
    >;
    mechanicalRacingRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
    >;
    keirinRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
    >;
    boatraceRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
    >;
    autoraceRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
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

    const jraRaceRepositoryFromStorageImpl = mockRaceRepository<
        JraRaceEntity,
        PlaceEntity
    >();
    container.registerInstance<IRaceRepository<JraRaceEntity, PlaceEntity>>(
        'JraRaceRepositoryFromStorage',
        jraRaceRepositoryFromStorageImpl,
    );
    const jraRaceRepositoryFromHtmlImpl = mockRaceRepository<
        JraRaceEntity,
        PlaceEntity
    >();
    container.registerInstance<IRaceRepository<JraRaceEntity, PlaceEntity>>(
        'JraRaceRepositoryFromHtml',
        jraRaceRepositoryFromHtmlImpl,
    );
    const horseRacingRaceRepositoryFromStorageImpl = mockRaceRepository<
        HorseRacingRaceEntity,
        PlaceEntity
    >();
    container.registerInstance<
        IRaceRepository<HorseRacingRaceEntity, PlaceEntity>
    >(
        'HorseRacingRaceRepositoryFromStorage',
        horseRacingRaceRepositoryFromStorageImpl,
    );

    const narRaceRepositoryFromHtmlImpl = mockRaceRepository<
        HorseRacingRaceEntity,
        PlaceEntity
    >();
    container.registerInstance<
        IRaceRepository<HorseRacingRaceEntity, PlaceEntity>
    >('NarRaceRepositoryFromHtml', narRaceRepositoryFromHtmlImpl);
    const overseasRaceRepositoryFromHtmlImpl = mockRaceRepository<
        HorseRacingRaceEntity,
        PlaceEntity
    >();
    container.registerInstance<
        IRaceRepository<HorseRacingRaceEntity, PlaceEntity>
    >('OverseasRaceRepositoryFromHtml', overseasRaceRepositoryFromHtmlImpl);

    const mechanicalRacingRaceRepositoryFromStorageImpl = mockRaceRepository<
        MechanicalRacingRaceEntity,
        MechanicalRacingPlaceEntity
    >();
    container.registerInstance<
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
    >(
        'MechanicalRacingRaceRepositoryFromStorage',
        mechanicalRacingRaceRepositoryFromStorageImpl,
    );

    const keirinRaceRepositoryFromHtmlImpl = mockRaceRepository<
        MechanicalRacingRaceEntity,
        MechanicalRacingPlaceEntity
    >();
    container.registerInstance<
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
    >('KeirinRaceRepositoryFromHtml', keirinRaceRepositoryFromHtmlImpl);

    const boatraceRaceRepositoryFromHtmlImpl = mockRaceRepository<
        MechanicalRacingRaceEntity,
        MechanicalRacingPlaceEntity
    >();
    container.registerInstance<
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
    >('BoatraceRaceRepositoryFromHtml', boatraceRaceRepositoryFromHtmlImpl);

    const autoraceRaceRepositoryFromHtmlImpl = mockRaceRepository<
        MechanicalRacingRaceEntity,
        MechanicalRacingPlaceEntity
    >();
    container.registerInstance<
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
    >('AutoraceRaceRepositoryFromHtml', autoraceRaceRepositoryFromHtmlImpl);

    const calendarRepository = mockCalendarRepository();
    container.registerInstance('CalendarRepository', calendarRepository);

    const jraPlaceRepositoryFromHtmlImpl = mockPlaceRepository<PlaceEntity>();
    container.registerInstance<IPlaceRepository<PlaceEntity>>(
        'JraPlaceRepositoryFromHtml',
        jraPlaceRepositoryFromHtmlImpl,
    );
    const horseRacingPlaceRepositoryFromStorageImpl =
        mockPlaceRepository<PlaceEntity>();
    container.registerInstance<IPlaceRepository<PlaceEntity>>(
        'PlaceRepositoryFromStorage',
        horseRacingPlaceRepositoryFromStorageImpl,
    );
    const narPlaceRepositoryFromHtmlImpl = mockPlaceRepository<PlaceEntity>();
    container.registerInstance<IPlaceRepository<PlaceEntity>>(
        'NarPlaceRepositoryFromHtml',
        narPlaceRepositoryFromHtmlImpl,
    );
    const keirinPlaceRepositoryFromHtmlImpl =
        mockPlaceRepository<MechanicalRacingPlaceEntity>();
    container.registerInstance<IPlaceRepository<MechanicalRacingPlaceEntity>>(
        'KeirinPlaceRepositoryFromHtml',
        keirinPlaceRepositoryFromHtmlImpl,
    );
    const boatracePlaceRepositoryFromHtmlImpl =
        mockPlaceRepository<MechanicalRacingPlaceEntity>();
    container.registerInstance<IPlaceRepository<MechanicalRacingPlaceEntity>>(
        'BoatracePlaceRepositoryFromHtml',
        boatracePlaceRepositoryFromHtmlImpl,
    );
    const autoracePlaceRepositoryFromHtmlImpl =
        mockPlaceRepository<MechanicalRacingPlaceEntity>();
    container.registerInstance<IPlaceRepository<MechanicalRacingPlaceEntity>>(
        'AutoracePlaceRepositoryFromHtml',
        autoracePlaceRepositoryFromHtmlImpl,
    );
    const mechanicalRacingPlaceRepositoryFromStorageImpl =
        mockPlaceRepository<MechanicalRacingPlaceEntity>();
    container.registerInstance<IPlaceRepository<MechanicalRacingPlaceEntity>>(
        'MechanicalRacingPlaceRepositoryFromStorage',
        mechanicalRacingPlaceRepositoryFromStorageImpl,
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
        horseRacingPlaceRepositoryFromStorageImpl,
        narPlaceRepositoryFromHtmlImpl,
        mechanicalRacingPlaceRepositoryFromStorageImpl,
        keirinPlaceRepositoryFromHtmlImpl,
        boatracePlaceRepositoryFromHtmlImpl,
        autoracePlaceRepositoryFromHtmlImpl,
        jraRaceRepositoryFromStorageImpl,
        jraRaceRepositoryFromHtmlImpl,
        horseRacingRaceRepositoryFromStorageImpl,
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
