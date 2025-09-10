import type { IPlaceServiceForAWS } from '../../../../../../lib/src/service/interface/IPlaceService';
import type { PlaceEntity } from '../../../../../../src/repository/entity/placeEntity';

/**
 * PlaceServiceのモックを作成する
 * @returns モック化されたIPlaceServiceインターフェースのインスタンス
 */
export const placeServiceForAWSMock = (): jest.Mocked<IPlaceServiceForAWS> => {
    return {
        fetchPlaceEntityList: jest.fn().mockResolvedValue([] as PlaceEntity[]),
        updatePlaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
