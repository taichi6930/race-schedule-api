import type { PlaceEntityTagged } from '../../../../../src/repository/entity/placeEntities';
import type { PlaceEntity } from '../../../../../src/repository/entity/placeEntity';
import type { IPlaceService } from '../../../../../src/service/interface/IPlaceService';

/**
 * PlaceServiceのモックを作成する
 * @returns モック化されたIPlaceServiceインターフェースのインスタンス
 */
export const placeServiceMock = (): jest.Mocked<IPlaceService> => {
    return {
        fetchPlaceEntityList: jest.fn().mockResolvedValue([] as PlaceEntity[]),
        fetchPlaceEntityListV2: jest
            .fn()
            .mockResolvedValue([] as PlaceEntityTagged[]),
        upsertPlaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
