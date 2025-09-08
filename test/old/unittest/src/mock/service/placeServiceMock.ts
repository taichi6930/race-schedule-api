import type { PlaceEntityForAWS } from '../../../../../../lib/src/repository/entity/placeEntity';
import type { IPlaceService } from '../../../../../../lib/src/service/interface/IPlaceService';

/**
 * PlaceServiceのモックを作成する
 * @returns モック化されたIPlaceServiceインターフェースのインスタンス
 */
export const placeServiceMock = (): jest.Mocked<IPlaceService> => {
    return {
        fetchPlaceEntityList: jest
            .fn()
            .mockResolvedValue([] as PlaceEntityForAWS[]),
        updatePlaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
