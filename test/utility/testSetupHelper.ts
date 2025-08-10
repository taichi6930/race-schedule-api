import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IOldCalendarGateway } from '../../lib/src/gateway/interface/iCalendarGateway';
import type { AutoraceRaceEntity } from '../../lib/src/repository/entity/autoraceRaceEntity';
import type { BoatraceRaceEntity } from '../../lib/src/repository/entity/boatraceRaceEntity';
import type { JraPlaceEntity } from '../../lib/src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../lib/src/repository/entity/jraRaceEntity';
import type { KeirinRaceEntity } from '../../lib/src/repository/entity/keirinRaceEntity';
import type { MechanicalRacingPlaceEntity } from '../../lib/src/repository/entity/mechanicalRacingPlaceEntity';
import type { NarPlaceEntity } from '../../lib/src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../../lib/src/repository/entity/narRaceEntity';
import type { WorldPlaceEntity } from '../../lib/src/repository/entity/worldPlaceEntity';
import type { WorldRaceEntity } from '../../lib/src/repository/entity/worldRaceEntity';
import type { ICalendarRepository } from '../../lib/src/repository/interface/ICalendarRepository';
import type { IPlaceRepository } from '../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../lib/src/repository/interface/IRaceRepository';
import type { ICalendarService } from '../../lib/src/service/interface/ICalendarService';
import type { IPlaceDataService } from '../../lib/src/service/interface/IPlaceDataService';
import type { IPlayerDataService } from '../../lib/src/service/interface/IPlayerDataService';
import type { IRaceDataService } from '../../lib/src/service/interface/IRaceDataService';
import { mockOldGoogleCalendarGateway } from '../unittest/src/mock/gateway/mockGoogleCalendarGateway';
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
    autoraceGoogleCalendarGateway: jest.Mocked<IOldCalendarGateway>;

    jraCalendarRepository: jest.Mocked<ICalendarRepository<JraRaceEntity>>;
    narCalendarRepository: jest.Mocked<ICalendarRepository<NarRaceEntity>>;
    worldCalendarRepository: jest.Mocked<ICalendarRepository<WorldRaceEntity>>;
    keirinCalendarRepository: jest.Mocked<
        ICalendarRepository<KeirinRaceEntity>
    >;
    boatraceCalendarRepository: jest.Mocked<
        ICalendarRepository<BoatraceRaceEntity>
    >;
    autoraceCalendarRepository: jest.Mocked<
        ICalendarRepository<AutoraceRaceEntity>
    >;
    jraPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<JraPlaceEntity>
    >;
    jraPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<JraPlaceEntity>
    >;
    narPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<NarPlaceEntity>
    >;
    narPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<NarPlaceEntity>
    >;
    keirinPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<MechanicalRacingPlaceEntity>
    >;
    keirinPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<MechanicalRacingPlaceEntity>
    >;
    boatracePlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<MechanicalRacingPlaceEntity>
    >;
    boatracePlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<MechanicalRacingPlaceEntity>
    >;
    autoracePlaceRepositoryFromStorageImpl: jest.Mocked<
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
        IRaceRepository<NarRaceEntity, NarPlaceEntity>
    >;
    narRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<NarRaceEntity, NarPlaceEntity>
    >;
    worldRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
    >;
    worldRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
    >;
    keirinRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<KeirinRaceEntity, MechanicalRacingPlaceEntity>
    >;
    keirinRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<KeirinRaceEntity, MechanicalRacingPlaceEntity>
    >;
    boatraceRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<BoatraceRaceEntity, MechanicalRacingPlaceEntity>
    >;
    boatraceRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<BoatraceRaceEntity, MechanicalRacingPlaceEntity>
    >;
    autoraceRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<AutoraceRaceEntity, MechanicalRacingPlaceEntity>
    >;
    autoraceRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<AutoraceRaceEntity, MechanicalRacingPlaceEntity>
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
    const autoraceGoogleCalendarGateway = mockOldGoogleCalendarGateway();
    container.registerInstance(
        'AutoraceGoogleCalendarGateway',
        autoraceGoogleCalendarGateway,
    );
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
        NarRaceEntity,
        NarPlaceEntity
    >();
    container.registerInstance<IRaceRepository<NarRaceEntity, NarPlaceEntity>>(
        'NarRaceRepositoryFromStorage',
        narRaceRepositoryFromStorageImpl,
    );

    const narRaceRepositoryFromHtmlImpl = mockRaceRepository<
        NarRaceEntity,
        NarPlaceEntity
    >();
    container.registerInstance<IRaceRepository<NarRaceEntity, NarPlaceEntity>>(
        'NarRaceRepositoryFromHtml',
        narRaceRepositoryFromHtmlImpl,
    );
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

    // keirin
    const keirinRaceRepositoryFromStorageImpl = mockRaceRepository<
        KeirinRaceEntity,
        MechanicalRacingPlaceEntity
    >();
    container.registerInstance<
        IRaceRepository<KeirinRaceEntity, MechanicalRacingPlaceEntity>
    >('KeirinRaceRepositoryFromStorage', keirinRaceRepositoryFromStorageImpl);
    const keirinRaceRepositoryFromHtmlImpl = mockRaceRepository<
        KeirinRaceEntity,
        MechanicalRacingPlaceEntity
    >();
    container.registerInstance<
        IRaceRepository<KeirinRaceEntity, MechanicalRacingPlaceEntity>
    >('KeirinRaceRepositoryFromHtml', keirinRaceRepositoryFromHtmlImpl);

    // boatrace
    const boatraceRaceRepositoryFromStorageImpl = mockRaceRepository<
        BoatraceRaceEntity,
        MechanicalRacingPlaceEntity
    >();
    container.registerInstance<
        IRaceRepository<BoatraceRaceEntity, MechanicalRacingPlaceEntity>
    >(
        'BoatraceRaceRepositoryFromStorage',
        boatraceRaceRepositoryFromStorageImpl,
    );
    const boatraceRaceRepositoryFromHtmlImpl = mockRaceRepository<
        BoatraceRaceEntity,
        MechanicalRacingPlaceEntity
    >();
    container.registerInstance<
        IRaceRepository<BoatraceRaceEntity, MechanicalRacingPlaceEntity>
    >('BoatraceRaceRepositoryFromHtml', boatraceRaceRepositoryFromHtmlImpl);

    const autoraceRaceRepositoryFromStorageImpl = mockRaceRepository<
        AutoraceRaceEntity,
        MechanicalRacingPlaceEntity
    >();
    container.registerInstance<
        IRaceRepository<AutoraceRaceEntity, MechanicalRacingPlaceEntity>
    >(
        'AutoraceRaceRepositoryFromStorage',
        autoraceRaceRepositoryFromStorageImpl,
    );
    const autoraceRaceRepositoryFromHtmlImpl = mockRaceRepository<
        AutoraceRaceEntity,
        MechanicalRacingPlaceEntity
    >();
    container.registerInstance<
        IRaceRepository<AutoraceRaceEntity, MechanicalRacingPlaceEntity>
    >('AutoraceRaceRepositoryFromHtml', autoraceRaceRepositoryFromHtmlImpl);

    const jraCalendarRepository = mockCalendarRepository<JraRaceEntity>();
    container.registerInstance('JraCalendarRepository', jraCalendarRepository);
    const narCalendarRepository = mockCalendarRepository<NarRaceEntity>();
    container.registerInstance('NarCalendarRepository', narCalendarRepository);
    const worldCalendarRepository = mockCalendarRepository<WorldRaceEntity>();
    container.registerInstance(
        'WorldCalendarRepository',
        worldCalendarRepository,
    );
    const keirinCalendarRepository = mockCalendarRepository<KeirinRaceEntity>();
    container.registerInstance(
        'KeirinCalendarRepository',
        keirinCalendarRepository,
    );
    const boatraceCalendarRepository =
        mockCalendarRepository<BoatraceRaceEntity>();
    container.registerInstance(
        'BoatraceCalendarRepository',
        boatraceCalendarRepository,
    );
    const autoraceCalendarRepository =
        mockCalendarRepository<AutoraceRaceEntity>();
    container.registerInstance(
        'AutoraceCalendarRepository',
        autoraceCalendarRepository,
    );
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
        mockPlaceRepository<NarPlaceEntity>();
    container.registerInstance<IPlaceRepository<NarPlaceEntity>>(
        'NarPlaceRepositoryFromStorage',
        narPlaceRepositoryFromStorageImpl,
    );

    const narPlaceRepositoryFromHtmlImpl =
        mockPlaceRepository<NarPlaceEntity>();
    container.registerInstance<IPlaceRepository<NarPlaceEntity>>(
        'NarPlaceRepositoryFromHtml',
        narPlaceRepositoryFromHtmlImpl,
    );

    const keirinPlaceRepositoryFromStorageImpl =
        mockPlaceRepository<MechanicalRacingPlaceEntity>();
    container.registerInstance<IPlaceRepository<MechanicalRacingPlaceEntity>>(
        'KeirinPlaceRepositoryFromStorage',
        keirinPlaceRepositoryFromStorageImpl,
    );

    const keirinPlaceRepositoryFromHtmlImpl =
        mockPlaceRepository<MechanicalRacingPlaceEntity>();
    container.registerInstance<IPlaceRepository<MechanicalRacingPlaceEntity>>(
        'KeirinPlaceRepositoryFromHtml',
        keirinPlaceRepositoryFromHtmlImpl,
    );

    const boatracePlaceRepositoryFromStorageImpl =
        mockPlaceRepository<MechanicalRacingPlaceEntity>();
    container.registerInstance<IPlaceRepository<MechanicalRacingPlaceEntity>>(
        'BoatracePlaceRepositoryFromStorage',
        boatracePlaceRepositoryFromStorageImpl,
    );

    const boatracePlaceRepositoryFromHtmlImpl =
        mockPlaceRepository<MechanicalRacingPlaceEntity>();
    container.registerInstance<IPlaceRepository<MechanicalRacingPlaceEntity>>(
        'BoatracePlaceRepositoryFromHtml',
        boatracePlaceRepositoryFromHtmlImpl,
    );

    const autoracePlaceRepositoryFromStorageImpl =
        mockPlaceRepository<MechanicalRacingPlaceEntity>();
    container.registerInstance<IPlaceRepository<MechanicalRacingPlaceEntity>>(
        'AutoracePlaceRepositoryFromStorage',
        autoracePlaceRepositoryFromStorageImpl,
    );

    const autoracePlaceRepositoryFromHtmlImpl =
        mockPlaceRepository<MechanicalRacingPlaceEntity>();
    container.registerInstance<IPlaceRepository<MechanicalRacingPlaceEntity>>(
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
        autoraceGoogleCalendarGateway,
        jraCalendarRepository,
        narCalendarRepository,
        worldCalendarRepository,
        keirinCalendarRepository,
        boatraceCalendarRepository,
        autoraceCalendarRepository,
        jraPlaceRepositoryFromStorageImpl,
        jraPlaceRepositoryFromHtmlImpl,
        narPlaceRepositoryFromStorageImpl,
        narPlaceRepositoryFromHtmlImpl,
        keirinPlaceRepositoryFromStorageImpl,
        keirinPlaceRepositoryFromHtmlImpl,
        boatracePlaceRepositoryFromStorageImpl,
        boatracePlaceRepositoryFromHtmlImpl,
        autoracePlaceRepositoryFromStorageImpl,
        autoracePlaceRepositoryFromHtmlImpl,
        jraRaceRepositoryFromStorageImpl,
        jraRaceRepositoryFromHtmlImpl,
        narRaceRepositoryFromStorageImpl,
        narRaceRepositoryFromHtmlImpl,
        worldRaceRepositoryFromStorageImpl,
        worldRaceRepositoryFromHtmlImpl,
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
