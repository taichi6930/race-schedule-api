import type { IPlaceService } from '../../../../../src/service/interface/IPlaceService';

/**
 * PlaceServiceのモックを作成する
 * @returns モック化されたIPlaceServiceインターフェースのインスタンス
 */
export const placeServiceMock = (): jest.Mocked<IPlaceService> => {
    return {
        fetchPlaceEntityList: jest.fn().mockResolvedValue([]),
        upsertPlaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
