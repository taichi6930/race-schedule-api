import type { IPlayerDataService } from '../../../../lib/src/service/interface/IPlayerDataService';

/**
 * PlayerDataServiceのモックを作成する
 * @returns モック化されたIPlayerDataServiceインターフェースのインスタンス
 */
export const playerDataServiceMock = (): jest.Mocked<IPlayerDataService> => {
    return {
        fetchPlayerDataList: jest.fn().mockReturnValue([]),
    };
};
