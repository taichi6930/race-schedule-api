import type { IOldPlaceService } from '../../../../../src/service/interface/IOldPlaceService';

/**
 * PlaceServiceのモックを作成する
 * @returns モック化されたIPlaceServiceインターフェースのインスタンス
 */
export const placeServiceMock = (): jest.Mocked<IOldPlaceService> => {
    return {
        fetchPlaceEntityList: jest.fn().mockResolvedValue([]),
        upsertPlaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
