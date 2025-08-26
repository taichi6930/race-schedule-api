import type { IPlayerService } from '../../../../../lib/src/service/interface/IPlayerService';

/**
 * PlayerDataServiceのモックを作成する
 * @returns モック化されたIPlayerDataServiceインターフェースのインスタンス
 */
export const playerDataServiceMock = (): jest.Mocked<IPlayerService> => {
    return {
        fetchPlayerDataList: jest.fn().mockReturnValue([]),
    };
};
