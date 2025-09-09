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
import { mockGoogleCalendarGateway } from '../old/unittest/src/mock/gateway/mockGoogleCalendarGateway';
import { mockS3Gateway } from '../old/unittest/src/mock/gateway/mockS3Gateway';
import { mockCalendarRepository } from '../old/unittest/src/mock/repository/mockCalendarRepository';
import { mockPlaceRepository } from '../old/unittest/src/mock/repository/mockPlaceRepository';
import { mockRaceRepository } from '../old/unittest/src/mock/repository/mockRaceRepository';
import { calendarServiceMock } from '../old/unittest/src/mock/service/calendarServiceMock';
import { placeServiceMock } from '../old/unittest/src/mock/service/placeServiceMock';
import { playerDataServiceMock } from '../old/unittest/src/mock/service/playerDataServiceMock';
import { raceDataServiceMock } from '../old/unittest/src/mock/service/raceDataServiceMock';

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

/**
 * テスト用のセットアップ
 */
export interface TestGatewaySetup {
    googleCalendarGateway: jest.Mocked<ICalendarGatewayForAWS>;
    s3Gateway: jest.Mocked<IS3Gateway>;
}

export interface TestServiceSetup {
    calendarService: jest.Mocked<ICalendarServiceForAWS>;
    raceService: jest.Mocked<IRaceServiceForAWS>;
    placeService: jest.Mocked<IPlaceServiceForAWS>;
    playerService: jest.Mocked<IPlayerServiceForAWS>;
}

/**
 * テスト用のセットアップ
 * @returns セットアップ済みのサービス
 */
export function setupTestRepositoryMock(): TestRepositorySetup {
    const horseRacingRaceRepositoryFromStorage = mockRaceRepository();
    container.registerInstance<IRaceRepositoryForAWS>(
        'HorseRacingRaceRepositoryFromStorage',
        horseRacingRaceRepositoryFromStorage,
    );
    const jraRaceRepositoryFromHtml = mockRaceRepository();
    container.registerInstance<IRaceRepositoryForAWS>(
        'JraRaceRepositoryFromHtml',
        jraRaceRepositoryFromHtml,
    );
    const narRaceRepositoryFromHtml = mockRaceRepository();
    container.registerInstance<IRaceRepositoryForAWS>(
        'NarRaceRepositoryFromHtml',
        narRaceRepositoryFromHtml,
    );
    const overseasRaceRepositoryFromHtml = mockRaceRepository();
    container.registerInstance<IRaceRepositoryForAWS>(
        'OverseasRaceRepositoryFromHtml',
        overseasRaceRepositoryFromHtml,
    );

    const mechanicalRacingRaceRepositoryFromStorage = mockRaceRepository();
    container.registerInstance<IRaceRepositoryForAWS>(
        'MechanicalRacingRaceRepositoryFromStorage',
        mechanicalRacingRaceRepositoryFromStorage,
    );

    const keirinRaceRepositoryFromHtml = mockRaceRepository();
    container.registerInstance<IRaceRepositoryForAWS>(
        'KeirinRaceRepositoryFromHtml',
        keirinRaceRepositoryFromHtml,
    );

    const boatraceRaceRepositoryFromHtml = mockRaceRepository();
    container.registerInstance<IRaceRepositoryForAWS>(
        'BoatraceRaceRepositoryFromHtml',
        boatraceRaceRepositoryFromHtml,
    );

    const autoraceRaceRepositoryFromHtml = mockRaceRepository();
    container.registerInstance<IRaceRepositoryForAWS>(
        'AutoraceRaceRepositoryFromHtml',
        autoraceRaceRepositoryFromHtml,
    );

    const calendarRepository = mockCalendarRepository();
    container.registerInstance('CalendarRepository', calendarRepository);

    const placeRepositoryFromStorage = mockPlaceRepository();
    container.registerInstance<IPlaceRepositoryForAWS>(
        'PlaceRepositoryFromStorage',
        placeRepositoryFromStorage,
    );
    const placeRepositoryFromHtml = mockPlaceRepository();
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
    container.registerInstance<ICalendarServiceForAWS>(
        'CalendarService',
        calendarService,
    );
    const raceService = raceDataServiceMock();
    container.registerInstance<IRaceServiceForAWS>('RaceService', raceService);
    const placeService = placeServiceMock();
    container.registerInstance<IPlaceServiceForAWS>(
        'PlaceService',
        placeService,
    );
    const playerService = playerDataServiceMock();
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
