import 'reflect-metadata';

import { container } from 'tsyringe';

import type { ICalendarGateway } from '../../lib/src/gateway/interface/iCalendarGateway';
import type { IS3Gateway } from '../../lib/src/gateway/interface/iS3Gateway';
import type { ICalendarRepository } from '../../lib/src/repository/interface/ICalendarRepository';
import type { IPlaceRepository } from '../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../lib/src/repository/interface/IRaceRepository';
import type { ICalendarService } from '../../lib/src/service/interface/ICalendarService';
import type { IPlaceService } from '../../lib/src/service/interface/IPlaceService';
import type { IPlayerService } from '../../lib/src/service/interface/IPlayerService';
import type { IRaceService } from '../../lib/src/service/interface/IRaceService';
import { mockGoogleCalendarGateway } from '../unittest/src/mock/gateway/mockGoogleCalendarGateway';
import { mockS3Gateway } from '../unittest/src/mock/gateway/mockS3Gateway';
import { mockCalendarRepository } from '../unittest/src/mock/repository/mockCalendarRepository';
import { mockPlaceRepository } from '../unittest/src/mock/repository/mockPlaceRepository';
import { mockRaceRepository } from '../unittest/src/mock/repository/mockRaceRepository';
import { calendarServiceMock } from '../unittest/src/mock/service/calendarServiceMock';
import { placeServiceMock } from '../unittest/src/mock/service/placeServiceMock';
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
export interface TestRepositorySetup {
    calendarRepository: jest.Mocked<ICalendarRepository>;
    placeRepositoryFromStorage: jest.Mocked<IPlaceRepository>;
    placeRepositoryFromHtml: jest.Mocked<IPlaceRepository>;
    horseRacingRaceRepositoryFromStorage: jest.Mocked<IRaceRepository>;
    jraRaceRepositoryFromHtml: jest.Mocked<IRaceRepository>;
    narRaceRepositoryFromHtml: jest.Mocked<IRaceRepository>;
    overseasRaceRepositoryFromHtml: jest.Mocked<IRaceRepository>;
    mechanicalRacingRaceRepositoryFromStorage: jest.Mocked<IRaceRepository>;
    keirinRaceRepositoryFromHtml: jest.Mocked<IRaceRepository>;
    boatraceRaceRepositoryFromHtml: jest.Mocked<IRaceRepository>;
    autoraceRaceRepositoryFromHtml: jest.Mocked<IRaceRepository>;
}

/**
 * テスト用のセットアップ
 */
export interface TestGatewaySetup {
    googleCalendarGateway: jest.Mocked<ICalendarGateway>;
    s3Gateway: jest.Mocked<IS3Gateway>;
}

export interface TestServiceSetup {
    calendarService: jest.Mocked<ICalendarService>;
    raceService: jest.Mocked<IRaceService>;
    placeService: jest.Mocked<IPlaceService>;
    playerService: jest.Mocked<IPlayerService>;
}

/**
 * テスト用のセットアップ
 * @returns セットアップ済みのサービス
 */
export function setupTestRepositoryMock(): TestRepositorySetup {
    const horseRacingRaceRepositoryFromStorage = mockRaceRepository();
    container.registerInstance<IRaceRepository>(
        'HorseRacingRaceRepositoryFromStorage',
        horseRacingRaceRepositoryFromStorage,
    );
    const jraRaceRepositoryFromHtml = mockRaceRepository();
    container.registerInstance<IRaceRepository>(
        'JraRaceRepositoryFromHtml',
        jraRaceRepositoryFromHtml,
    );
    const narRaceRepositoryFromHtml = mockRaceRepository();
    container.registerInstance<IRaceRepository>(
        'NarRaceRepositoryFromHtml',
        narRaceRepositoryFromHtml,
    );
    const overseasRaceRepositoryFromHtml = mockRaceRepository();
    container.registerInstance<IRaceRepository>(
        'OverseasRaceRepositoryFromHtml',
        overseasRaceRepositoryFromHtml,
    );

    const mechanicalRacingRaceRepositoryFromStorage = mockRaceRepository();
    container.registerInstance<IRaceRepository>(
        'MechanicalRacingRaceRepositoryFromStorage',
        mechanicalRacingRaceRepositoryFromStorage,
    );

    const keirinRaceRepositoryFromHtml = mockRaceRepository();
    container.registerInstance<IRaceRepository>(
        'KeirinRaceRepositoryFromHtml',
        keirinRaceRepositoryFromHtml,
    );

    const boatraceRaceRepositoryFromHtml = mockRaceRepository();
    container.registerInstance<IRaceRepository>(
        'BoatraceRaceRepositoryFromHtml',
        boatraceRaceRepositoryFromHtml,
    );

    const autoraceRaceRepositoryFromHtml = mockRaceRepository();
    container.registerInstance<IRaceRepository>(
        'AutoraceRaceRepositoryFromHtml',
        autoraceRaceRepositoryFromHtml,
    );

    const calendarRepository = mockCalendarRepository();
    container.registerInstance('CalendarRepository', calendarRepository);

    const placeRepositoryFromStorage = mockPlaceRepository();
    container.registerInstance<IPlaceRepository>(
        'PlaceRepositoryFromStorage',
        placeRepositoryFromStorage,
    );
    const placeRepositoryFromHtml = mockPlaceRepository();
    container.registerInstance<IPlaceRepository>(
        'PlaceRepositoryFromHtml',
        placeRepositoryFromHtml,
    );
    return {
        calendarRepository,
        placeRepositoryFromStorage,
        placeRepositoryFromHtml,
        horseRacingRaceRepositoryFromStorage,
        jraRaceRepositoryFromHtml,
        narRaceRepositoryFromHtml,
        overseasRaceRepositoryFromHtml,
        mechanicalRacingRaceRepositoryFromStorage,
        keirinRaceRepositoryFromHtml,
        boatraceRaceRepositoryFromHtml,
        autoraceRaceRepositoryFromHtml,
    };
}

/**
 * テスト用のセットアップ
 * @returns セットアップ済みのサービス
 */
export function setupTestGatewayMock(): TestGatewaySetup {
    const s3Gateway = mockS3Gateway();
    container.registerInstance('S3Gateway', s3Gateway);
    const googleCalendarGateway = mockGoogleCalendarGateway();
    container.registerInstance('GoogleCalendarGateway', googleCalendarGateway);

    return {
        googleCalendarGateway,
        s3Gateway,
    };
}

/**
 * テスト用のセットアップ（Serviceクラス）
 * @returns セットアップ済みのサービス
 */
export function setupTestServiceMock(): TestServiceSetup {
    const calendarService = calendarServiceMock();
    container.registerInstance<ICalendarService>(
        'PublicGamblingCalendarService',
        calendarService,
    );
    const raceService = raceDataServiceMock();
    container.registerInstance<IRaceService>(
        'PublicGamblingRaceService',
        raceService,
    );
    const placeService = placeServiceMock();
    container.registerInstance<IPlaceService>(
        'PublicGamblingPlaceService',
        placeService,
    );
    const playerService = playerDataServiceMock();
    container.registerInstance<IPlayerService>(
        'PlayerDataService',
        playerService,
    );

    return {
        calendarService,
        raceService,
        placeService,
        playerService,
    };
}
