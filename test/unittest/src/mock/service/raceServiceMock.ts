import type { IRaceService } from '../../../../../src/service/interface/IRaceService';

/**
 * RaceServiceのモックを作成する
 * @returns モック化されたIRaceServiceインターフェースのインスタンス
 */
export const raceServiceMock = (): jest.Mocked<IRaceService> => {
    return {
        fetchRaceEntityList: jest.fn().mockResolvedValue([]),
        upsertRaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
