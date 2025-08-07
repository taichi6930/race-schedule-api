import 'reflect-metadata';

import { container } from 'tsyringe';

import type { AutoraceRaceEntity } from '../../lib/src/repository/entity/autoraceRaceEntity';
import type { BoatraceRaceEntity } from '../../lib/src/repository/entity/boatraceRaceEntity';
import type { JraPlaceEntity } from '../../lib/src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../lib/src/repository/entity/jraRaceEntity';
import type { KeirinRaceEntity } from '../../lib/src/repository/entity/keirinRaceEntity';
import type { MechanicalRacingPlaceEntity } from '../../lib/src/repository/entity/mechanicalRacingPlaceEntity';
import type { NarPlaceEntity } from '../../lib/src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../../lib/src/repository/entity/narRaceEntity';
import type { WorldRaceEntity } from '../../lib/src/repository/entity/worldRaceEntity';
import type { ICalendarRepository } from '../../lib/src/repository/interface/ICalendarRepository';
import type { IPlaceRepository } from '../../lib/src/repository/interface/IPlaceRepository';
import type { ICalendarService } from '../../lib/src/service/interface/ICalendarService';
import type { IPlaceDataService } from '../../lib/src/service/interface/IPlaceDataService';
import type { IPlayerDataService } from '../../lib/src/service/interface/IPlayerDataService';
import type { IRaceDataService } from '../../lib/src/service/interface/IRaceDataService';
import { mockCalendarRepository } from '../unittest/src/mock/repository/mockCalendarRepository';
import { mockPlaceRepository } from '../unittest/src/mock/repository/mockPlaceRepository';
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
 * ユースケーステスト用のセットアップ
 */
export interface UseCaseTestSetup {
    calendarService: jest.Mocked<ICalendarService>;
    raceDataService: jest.Mocked<IRaceDataService>;
    placeDataService: jest.Mocked<IPlaceDataService>;
    playerDataService: jest.Mocked<IPlayerDataService>;
}

/**
 * UseCaseテスト用のセットアップ
 * @returns セットアップ済みのサービスとユースケース
 */
export function setupUseCaseTest(): UseCaseTestSetup {
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
        calendarService,
        raceDataService,
        placeDataService,
        playerDataService,
    };
}

/**
 * サービステスト用のセットアップ
 */
export interface ServiceTestSetup {
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
}

/**
 * Serviceテスト用のセットアップ
 * @returns セットアップ済みのサービス
 */
export function setupServiceTest(): ServiceTestSetup {
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

    return {
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
    };
}
