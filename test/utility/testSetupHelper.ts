import 'reflect-metadata';

import { container } from 'tsyringe';

import type { HorseRacingPlaceEntity } from '../../lib/src/repository/entity/horseRacingPlaceEntity';
import type { HorseRacingRaceEntity } from '../../lib/src/repository/entity/horseRacingRaceEntity';
import type { JraPlaceEntity } from '../../lib/src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../lib/src/repository/entity/jraRaceEntity';
import type { MechanicalRacingPlaceEntity } from '../../lib/src/repository/entity/mechanicalRacingPlaceEntity';
import type { MechanicalRacingRaceEntity } from '../../lib/src/repository/entity/mechanicalRacingRaceEntity';
import type { WorldPlaceEntity } from '../../lib/src/repository/entity/worldPlaceEntity';
import type { WorldRaceEntity } from '../../lib/src/repository/entity/worldRaceEntity';
import type { ICalendarRepository } from '../../lib/src/repository/interface/ICalendarRepository';
import type { IPlaceRepository } from '../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../lib/src/repository/interface/IRaceRepository';
import type { ICalendarService } from '../../lib/src/service/interface/ICalendarService';
import type { IPlaceDataService } from '../../lib/src/service/interface/IPlaceDataService';
import type { IPlayerDataService } from '../../lib/src/service/interface/IPlayerDataService';
import type { IRaceDataService } from '../../lib/src/service/interface/IRaceDataService';
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
    calendarRepository: jest.Mocked<ICalendarRepository>;
    jraPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<JraPlaceEntity>
    >;
    jraPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<JraPlaceEntity>
    >;
    narPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<HorseRacingPlaceEntity>
    >;
    narPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<HorseRacingPlaceEntity>
    >;
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
        IRaceRepository<JraRaceEntity, JraPlaceEntity>
    >;
    jraRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<JraRaceEntity, JraPlaceEntity>
    >;
    narRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<HorseRacingRaceEntity, HorseRacingPlaceEntity>
    >;
    narRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<HorseRacingRaceEntity, HorseRacingPlaceEntity>
    >;
    worldRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
    >;
    worldRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
    >;
    mechanicalRacingRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
    >;
    keirinRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
    >;
    keirinRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
    >;
    boatraceRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
    >;
    boatraceRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
    >;
    autoraceRaceRepositoryFromStorageImpl: jest.Mocked<
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
    const jraRaceRepositoryFromStorageImpl = mockRaceRepository<
        JraRaceEntity,
        JraPlaceEntity
    >();
    container.registerInstance<IRaceRepository<JraRaceEntity, JraPlaceEntity>>(
        'JraRaceRepositoryFromStorage',
        jraRaceRepositoryFromStorageImpl,
    );
    const jraRaceRepositoryFromHtmlImpl = mockRaceRepository<
        JraRaceEntity,
        JraPlaceEntity
    >();
    container.registerInstance<IRaceRepository<JraRaceEntity, JraPlaceEntity>>(
        'JraRaceRepositoryFromHtml',
        jraRaceRepositoryFromHtmlImpl,
    );
    const narRaceRepositoryFromStorageImpl = mockRaceRepository<
        HorseRacingRaceEntity,
        HorseRacingPlaceEntity
    >();
    container.registerInstance<
        IRaceRepository<HorseRacingRaceEntity, HorseRacingPlaceEntity>
    >('NarRaceRepositoryFromStorage', narRaceRepositoryFromStorageImpl);

    const narRaceRepositoryFromHtmlImpl = mockRaceRepository<
        HorseRacingRaceEntity,
        HorseRacingPlaceEntity
    >();
    container.registerInstance<
        IRaceRepository<HorseRacingRaceEntity, HorseRacingPlaceEntity>
    >('NarRaceRepositoryFromHtml', narRaceRepositoryFromHtmlImpl);
    // world
    const worldRaceRepositoryFromStorageImpl = mockRaceRepository<
        WorldRaceEntity,
        WorldPlaceEntity
    >();
    container.registerInstance<
        IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
    >('WorldRaceRepositoryFromStorage', worldRaceRepositoryFromStorageImpl);
    const worldRaceRepositoryFromHtmlImpl = mockRaceRepository<
        WorldRaceEntity,
        WorldPlaceEntity
    >();
    container.registerInstance<
        IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
    >('WorldRaceRepositoryFromHtml', worldRaceRepositoryFromHtmlImpl);

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
    // keirin
    const keirinRaceRepositoryFromStorageImpl = mockRaceRepository<
        MechanicalRacingRaceEntity,
        MechanicalRacingPlaceEntity
    >();
    container.registerInstance<
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
    >('KeirinRaceRepositoryFromStorage', keirinRaceRepositoryFromStorageImpl);
    const keirinRaceRepositoryFromHtmlImpl = mockRaceRepository<
        MechanicalRacingRaceEntity,
        MechanicalRacingPlaceEntity
    >();
    container.registerInstance<
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
    >('KeirinRaceRepositoryFromHtml', keirinRaceRepositoryFromHtmlImpl);

    // boatrace
    const boatraceRaceRepositoryFromStorageImpl = mockRaceRepository<
        MechanicalRacingRaceEntity,
        MechanicalRacingPlaceEntity
    >();
    container.registerInstance<
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
    >(
        'BoatraceRaceRepositoryFromStorage',
        boatraceRaceRepositoryFromStorageImpl,
    );
    const boatraceRaceRepositoryFromHtmlImpl = mockRaceRepository<
        MechanicalRacingRaceEntity,
        MechanicalRacingPlaceEntity
    >();
    container.registerInstance<
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
    >('BoatraceRaceRepositoryFromHtml', boatraceRaceRepositoryFromHtmlImpl);

    const autoraceRaceRepositoryFromStorageImpl = mockRaceRepository<
        MechanicalRacingRaceEntity,
        MechanicalRacingPlaceEntity
    >();
    container.registerInstance<
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
    >(
        'AutoraceRaceRepositoryFromStorage',
        autoraceRaceRepositoryFromStorageImpl,
    );
    const autoraceRaceRepositoryFromHtmlImpl = mockRaceRepository<
        MechanicalRacingRaceEntity,
        MechanicalRacingPlaceEntity
    >();
    container.registerInstance<
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
    >('AutoraceRaceRepositoryFromHtml', autoraceRaceRepositoryFromHtmlImpl);

    const calendarRepository = mockCalendarRepository();
    container.registerInstance('CalendarRepository', calendarRepository);

    const jraPlaceRepositoryFromStorageImpl =
        mockPlaceRepository<JraPlaceEntity>();
    container.registerInstance<IPlaceRepository<JraPlaceEntity>>(
        'JraPlaceRepositoryFromStorage',
        jraPlaceRepositoryFromStorageImpl,
    );
    const jraPlaceRepositoryFromHtmlImpl =
        mockPlaceRepository<JraPlaceEntity>();
    container.registerInstance<IPlaceRepository<JraPlaceEntity>>(
        'JraPlaceRepositoryFromHtml',
        jraPlaceRepositoryFromHtmlImpl,
    );
    const narPlaceRepositoryFromStorageImpl =
        mockPlaceRepository<HorseRacingPlaceEntity>();
    container.registerInstance<IPlaceRepository<HorseRacingPlaceEntity>>(
        'NarPlaceRepositoryFromStorage',
        narPlaceRepositoryFromStorageImpl,
    );
    const narPlaceRepositoryFromHtmlImpl =
        mockPlaceRepository<HorseRacingPlaceEntity>();
    container.registerInstance<IPlaceRepository<HorseRacingPlaceEntity>>(
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
        calendarRepository,
        jraPlaceRepositoryFromStorageImpl,
        jraPlaceRepositoryFromHtmlImpl,
        narPlaceRepositoryFromStorageImpl,
        narPlaceRepositoryFromHtmlImpl,
        mechanicalRacingPlaceRepositoryFromStorageImpl,
        keirinPlaceRepositoryFromHtmlImpl,
        boatracePlaceRepositoryFromHtmlImpl,
        autoracePlaceRepositoryFromHtmlImpl,
        jraRaceRepositoryFromStorageImpl,
        jraRaceRepositoryFromHtmlImpl,
        narRaceRepositoryFromStorageImpl,
        narRaceRepositoryFromHtmlImpl,
        worldRaceRepositoryFromStorageImpl,
        worldRaceRepositoryFromHtmlImpl,
        mechanicalRacingRaceRepositoryFromStorageImpl,
        keirinRaceRepositoryFromStorageImpl,
        keirinRaceRepositoryFromHtmlImpl,
        boatraceRaceRepositoryFromStorageImpl,
        boatraceRaceRepositoryFromHtmlImpl,
        autoraceRaceRepositoryFromStorageImpl,
        autoraceRaceRepositoryFromHtmlImpl,
        calendarService,
        raceDataService,
        placeDataService,
        playerDataService,
    };
}
