import 'reflect-metadata';

import { container } from 'tsyringe';

import type { ICalendarGateway } from '../../src/gateway/interface/iCalendarGateway';
import type { ICalendarRepository } from '../../src/repository/interface/ICalendarRepository';
import type { IPlaceRepository } from '../../src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../src/repository/interface/IRaceRepository';
import type { ICalendarService } from '../../src/service/interface/ICalendarService';
import type { IPlaceService } from '../../src/service/interface/IPlaceService';
import type { IPlayerService } from '../../src/service/interface/IPlayerService';
import type { IRaceService } from '../../src/service/interface/IRaceService';
import { mockGoogleCalendarGateway } from '../unittest/src/mock/gateway/mockGoogleCalendarGateway';
import { mockCalendarRepository } from '../unittest/src/mock/repository/mockCalendarRepository';
import { mockPlaceRepository } from '../unittest/src/mock/repository/mockPlaceRepository';
import { mockRaceRepository } from '../unittest/src/mock/repository/mockRaceRepository';
import { calendarServiceMock } from '../unittest/src/mock/service/calendarServiceMock';
import { placeServiceMock } from '../unittest/src/mock/service/placeServiceMock';
import { playerServiceMock } from '../unittest/src/mock/service/playerServiceMock';
import { raceServiceMock } from '../unittest/src/mock/service/raceServiceMock';

/**
 * afterEach処理の共通化
 */
export const clearMocks = (): void => {
    jest.clearAllMocks();
};

/**
 * テスト用のセットアップ
 */
export interface TestRepositorySetup {
    placeRepositoryFromStorage: jest.Mocked<IPlaceRepository>;
    placeRepositoryFromHtml: jest.Mocked<IPlaceRepository>;
    calendarRepository: jest.Mocked<ICalendarRepository>;
    raceRepositoryFromStorage: jest.Mocked<IRaceRepository>;
    raceRepositoryFromHtml: jest.Mocked<IRaceRepository>;
}

/**
 * テスト用のセットアップ
 */
export interface TestGatewaySetup {
    googleCalendarGateway: jest.Mocked<ICalendarGateway>;
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
export const setupTestRepositoryMock = (): TestRepositorySetup => {
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
    const calendarRepository = mockCalendarRepository();
    container.registerInstance('CalendarRepository', calendarRepository);

    const raceRepositoryFromStorage = mockRaceRepository();
    container.registerInstance<IRaceRepository>(
        'RaceRepositoryFromStorage',
        raceRepositoryFromStorage,
    );
    const raceRepositoryFromHtml = mockRaceRepository();
    container.registerInstance<IRaceRepository>(
        'RaceRepositoryFromHtml',
        raceRepositoryFromHtml,
    );
    return {
        placeRepositoryFromStorage,
        placeRepositoryFromHtml,
        calendarRepository,
        raceRepositoryFromStorage,
        raceRepositoryFromHtml,
    };
};

/**
 * テスト用のセットアップ
 * @returns セットアップ済みのサービス
 */
export const setupTestGatewayMock = (): TestGatewaySetup => {
    const googleCalendarGateway = mockGoogleCalendarGateway();
    container.registerInstance('GoogleCalendarGateway', googleCalendarGateway);

    return {
        googleCalendarGateway,
    };
};

/**
 * テスト用のセットアップ（Serviceクラス）
 * @returns セットアップ済みのサービス
 */
export const setupTestServiceMock = (): TestServiceSetup => {
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
    container.registerInstance<IPlayerService>('PlayerService', playerService);

    return {
        calendarService,
        raceService,
        placeService,
        playerService,
    };
};
