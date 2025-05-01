import type { IPlayerDataService } from '../../../../lib/src/service/interface/IPlayerDataService';

/**
 * RaceDataServiceのモックを作成する
 * @returns モック化されたIRaceDataServiceインターフェースのインスタンス
 */
export const playerDataServiceMock = (): jest.Mocked<IPlayerDataService> => {
    return {
        fetchPlayerDataList: jest.fn().mockReturnValue([]),
    };
};
