import type { PlaceEntity } from '../../../../../lib/src/repository/entity/placeEntity';
import type { IPlaceDataService } from '../../../../../lib/src/service/interface/IPlaceDataService';

/**
 * PlaceDataServiceのモックを作成する
 * @returns モック化されたIPlaceDataServiceインターフェースのインスタンス
 */
export const placeDataServiceMock = (): jest.Mocked<IPlaceDataService> => {
    return {
        fetchPlaceEntityList: jest.fn().mockResolvedValue([] as PlaceEntity[]),
        updatePlaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
