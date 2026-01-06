import type { IOldRaceService } from '../../../../../src/service/interface/IOldRaceService';

/**
 * RaceServiceのモックを作成する
 * @returns モック化されたIRaceServiceインターフェースのインスタンス
 */
export const raceServiceMock = (): jest.Mocked<IOldRaceService> => {
    return {
        fetchRaceEntityList: jest.fn().mockResolvedValue([]),
        upsertRaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
