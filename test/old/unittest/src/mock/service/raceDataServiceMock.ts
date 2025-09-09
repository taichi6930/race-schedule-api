import type { IRaceServiceForAWS } from '../../../../../../lib/src/service/interface/IRaceService';

/**
 * RaceDataServiceのモックを作成する
 * @returns モック化されたIRaceDataServiceインターフェースのインスタンス
 */
export const raceDataServiceMock = (): jest.Mocked<IRaceServiceForAWS> => {
    return {
        fetchRaceEntityList: jest.fn().mockResolvedValue([]),
        updateRaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
