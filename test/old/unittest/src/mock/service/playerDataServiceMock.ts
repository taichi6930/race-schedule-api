import type { IPlayerServiceForAWS } from '../../../../../../lib/src/service/interface/IPlayerServiceForAWS';

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
