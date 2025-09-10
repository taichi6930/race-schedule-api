import type { IPlayerServiceForAWS } from '../../../../../../lib/src/service/interface/IPlayerService';

/**
 * PlayerDataServiceのモックを作成する
 * @returns モック化されたIPlayerDataServiceインターフェースのインスタンス
 */
export const playerDataServiceForAWSMock =
    (): jest.Mocked<IPlayerServiceForAWS> => {
        return {
            fetchPlayerDataList: jest.fn().mockReturnValue([]),
        };
    };
