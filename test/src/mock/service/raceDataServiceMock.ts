import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';

/**
 * RaceDataServiceのモックを作成する
 * @returns モック化されたIRaceDataServiceインターフェースのインスタンス
 */
export const raceDataServiceMock = (): jest.Mocked<IRaceDataService> => {
    return {
        fetchRaceEntityList: jest.fn().mockResolvedValue([]),
        updateRaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
