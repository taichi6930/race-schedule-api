import 'reflect-metadata';

import { container } from 'tsyringe';

import type { ICalendarGatewayForAWS } from '../../lib/src/gateway/interface/iCalendarGateway';
import type { IS3Gateway } from '../../lib/src/gateway/interface/iS3Gateway';
import type { ICalendarRepositoryForAWS } from '../../lib/src/repository/interface/ICalendarRepository';
import type { IPlaceRepositoryForAWS } from '../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepositoryForAWS } from '../../lib/src/repository/interface/IRaceRepository';
import type { ICalendarServiceForAWS } from '../../lib/src/service/interface/ICalendarService';
import type { IPlaceServiceForAWS } from '../../lib/src/service/interface/IPlaceService';
import type { IPlayerServiceForAWS } from '../../lib/src/service/interface/IPlayerService';
import type { IRaceServiceForAWS } from '../../lib/src/service/interface/IRaceService';
import type { IPlaceRepository } from '../../src/repository/interface/IPlaceRepository';
import type { ICalendarService } from '../../src/service/interface/ICalendarService';
import type { IPlaceService } from '../../src/service/interface/IPlaceService';
import type { IPlayerService } from '../../src/service/interface/IPlayerService';
import type { IRaceService } from '../../src/service/interface/IRaceService';
import { mockGoogleCalendarGateway } from '../old/unittest/src/mock/gateway/mockGoogleCalendarGateway';
import { mockS3Gateway } from '../old/unittest/src/mock/gateway/mockS3Gateway';
import { mockCalendarRepositoryForAWS } from '../old/unittest/src/mock/repository/mockCalendarRepository';
import {
    mockPlaceRepository,
    mockPlaceRepositoryForAWS,
} from '../old/unittest/src/mock/repository/mockPlaceRepository';
import { mockRaceRepositoryForAWS } from '../old/unittest/src/mock/repository/mockRaceRepository';
import { calendarServiceForAWSMock } from '../old/unittest/src/mock/service/calendarServiceMock';
import { placeServiceForAWSMock } from '../old/unittest/src/mock/service/placeServiceMock';
import { playerDataServiceForAWSMock as playerServiceForAWSMock } from '../old/unittest/src/mock/service/playerDataServiceMock';
import { raceDataServiceForAWSMock } from '../old/unittest/src/mock/service/raceDataServiceMock';
import { calendarServiceMock } from '../unittest/src/mock/service/calendarServiceMock';
import { placeServiceMock } from '../unittest/src/mock/service/placeServiceMock';
import { playerServiceMock } from '../unittest/src/mock/service/playerServiceMock';
import { raceServiceMock } from '../unittest/src/mock/service/raceDataServiceMock';

/**
 * afterEach処理の共通化
 */
export function clearMocks(): void {
    jest.clearAllMocks();
}

/**
 * テスト用のセットアップ
 */
export interface TestRepositoryForAWSSetup {
    calendarRepository: jest.Mocked<ICalendarRepositoryForAWS>;
    placeRepositoryFromStorage: jest.Mocked<IPlaceRepositoryForAWS>;
    placeRepositoryFromHtml: jest.Mocked<IPlaceRepositoryForAWS>;
    horseRacingRaceRepositoryFromStorage: jest.Mocked<IRaceRepositoryForAWS>;
    jraRaceRepositoryFromHtml: jest.Mocked<IRaceRepositoryForAWS>;
    narRaceRepositoryFromHtml: jest.Mocked<IRaceRepositoryForAWS>;
    overseasRaceRepositoryFromHtml: jest.Mocked<IRaceRepositoryForAWS>;
    mechanicalRacingRaceRepositoryFromStorage: jest.Mocked<IRaceRepositoryForAWS>;
    keirinRaceRepositoryFromHtml: jest.Mocked<IRaceRepositoryForAWS>;
    boatraceRaceRepositoryFromHtml: jest.Mocked<IRaceRepositoryForAWS>;
    autoraceRaceRepositoryFromHtml: jest.Mocked<IRaceRepositoryForAWS>;
}

export interface TestRepositorySetup {
    placeRepositoryFromStorage: jest.Mocked<IPlaceRepository>;
    placeRepositoryFromHtml: jest.Mocked<IPlaceRepository>;
}

/**
 * テスト用のセットアップ
 */
export interface TestGatewaySetup {
    googleCalendarGateway: jest.Mocked<ICalendarGatewayForAWS>;
    s3Gateway: jest.Mocked<IS3Gateway>;
}

export interface TestServiceForAWSSetup {
    calendarService: jest.Mocked<ICalendarServiceForAWS>;
    raceService: jest.Mocked<IRaceServiceForAWS>;
    placeService: jest.Mocked<IPlaceServiceForAWS>;
    playerService: jest.Mocked<IPlayerServiceForAWS>;
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
export function setupTestRepositoryForAWSMock(): TestRepositoryForAWSSetup {
    const horseRacingRaceRepositoryFromStorage = mockRaceRepositoryForAWS();
    container.registerInstance<IRaceRepositoryForAWS>(
        'HorseRacingRaceRepositoryFromStorage',
        horseRacingRaceRepositoryFromStorage,
    );
    const jraRaceRepositoryFromHtml = mockRaceRepositoryForAWS();
    container.registerInstance<IRaceRepositoryForAWS>(
        'JraRaceRepositoryFromHtml',
        jraRaceRepositoryFromHtml,
    );
    const narRaceRepositoryFromHtml = mockRaceRepositoryForAWS();
    container.registerInstance<IRaceRepositoryForAWS>(
        'NarRaceRepositoryFromHtml',
        narRaceRepositoryFromHtml,
    );
    const overseasRaceRepositoryFromHtml = mockRaceRepositoryForAWS();
    container.registerInstance<IRaceRepositoryForAWS>(
        'OverseasRaceRepositoryFromHtml',
        overseasRaceRepositoryFromHtml,
    );

    const mechanicalRacingRaceRepositoryFromStorage =
        mockRaceRepositoryForAWS();
    container.registerInstance<IRaceRepositoryForAWS>(
        'MechanicalRacingRaceRepositoryFromStorage',
        mechanicalRacingRaceRepositoryFromStorage,
    );

    const keirinRaceRepositoryFromHtml = mockRaceRepositoryForAWS();
    container.registerInstance<IRaceRepositoryForAWS>(
        'KeirinRaceRepositoryFromHtml',
        keirinRaceRepositoryFromHtml,
    );

    const boatraceRaceRepositoryFromHtml = mockRaceRepositoryForAWS();
    container.registerInstance<IRaceRepositoryForAWS>(
        'BoatraceRaceRepositoryFromHtml',
        boatraceRaceRepositoryFromHtml,
    );

    const autoraceRaceRepositoryFromHtml = mockRaceRepositoryForAWS();
    container.registerInstance<IRaceRepositoryForAWS>(
        'AutoraceRaceRepositoryFromHtml',
        autoraceRaceRepositoryFromHtml,
    );

    const calendarRepository = mockCalendarRepositoryForAWS();
    container.registerInstance('CalendarRepository', calendarRepository);

    const placeRepositoryFromStorage = mockPlaceRepositoryForAWS();
    container.registerInstance<IPlaceRepositoryForAWS>(
        'PlaceRepositoryFromStorage',
        placeRepositoryFromStorage,
    );
    const placeRepositoryFromHtml = mockPlaceRepositoryForAWS();
    container.registerInstance<IPlaceRepositoryForAWS>(
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
export function setupTestRepositoryMock(): TestRepositorySetup {
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
        placeRepositoryFromStorage,
        placeRepositoryFromHtml,
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
export function setupTestServiceForAWSMock(): TestServiceForAWSSetup {
    const calendarService = calendarServiceForAWSMock();
    container.registerInstance<ICalendarServiceForAWS>(
        'CalendarService',
        calendarService,
    );
    const raceService = raceDataServiceForAWSMock();
    container.registerInstance<IRaceServiceForAWS>('RaceService', raceService);
    const placeService = placeServiceForAWSMock();
    container.registerInstance<IPlaceServiceForAWS>(
        'PlaceService',
        placeService,
    );
    const playerService = playerServiceForAWSMock();
    container.registerInstance<IPlayerServiceForAWS>(
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

/**
 * テスト用のセットアップ（Serviceクラス）
 * @returns セットアップ済みのサービス
 */
export function setupTestServiceMock(): TestServiceSetup {
    const calendarService = calendarServiceMock();
    container.registerInstance<ICalendarService>(
        'CalendarService',
        calendarService,
    );
    const raceService = raceServiceMock();
    container.registerInstance<IRaceService>('RaceService', raceService);
    const placeService = placeServiceMock();
    container.registerInstance<IPlaceService>('PlaceService', placeService);
    const playerService = playerServiceMock();
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
