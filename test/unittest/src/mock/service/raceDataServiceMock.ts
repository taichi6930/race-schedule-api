import type { IRaceService } from '../../../../../src/service/interface/IRaceService';

/**
 * RaceDataServiceのモックを作成する
 * @returns モック化されたIRaceDataServiceインターフェースのインスタンス
 */
export const raceServiceMock = (): jest.Mocked<IRaceService> => {
    return {
        fetchRaceEntityList: jest.fn().mockResolvedValue([]),
        upsertRaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
