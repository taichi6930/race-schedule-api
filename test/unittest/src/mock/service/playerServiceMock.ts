import type { IPlayerService } from '../../../../../src/service/interface/IPlayerService';

/**
 * PlayerDataServiceのモックを作成する
 * @returns モック化されたIPlayerDataServiceインターフェースのインスタンス
 */
export const playerServiceMock = (): jest.Mocked<IPlayerService> => {
    return {
        fetchPlayerEntityList: jest.fn().mockReturnValue([]),
        upsertPlayerEntityList: jest.fn().mockResolvedValue([]),
    };
};
