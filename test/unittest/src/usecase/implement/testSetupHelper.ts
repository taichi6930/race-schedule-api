import 'reflect-metadata';

import { container } from 'tsyringe';

import type { ICalendarService } from '../../../../../lib/src/service/interface/ICalendarService';
import type { IPlaceDataService } from '../../../../../lib/src/service/interface/IPlaceDataService';
import type { IPlayerDataService } from '../../../../../lib/src/service/interface/IPlayerDataService';
import type { IRaceDataService } from '../../../../../lib/src/service/interface/IRaceDataService';
import { calendarServiceMock } from '../../mock/service/calendarServiceMock';
import { placeDataServiceMock } from '../../mock/service/placeDataServiceMock';
import { playerDataServiceMock } from '../../mock/service/playerDataServiceMock';
import { raceDataServiceMock } from '../../mock/service/raceDataServiceMock';

/**
 * カレンダーユースケーステスト用のセットアップ
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
 * afterEach処理の共通化
 */
export function clearMocks(): void {
    jest.clearAllMocks();
}
