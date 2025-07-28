import type { IPlaceEntity } from '../../../../lib/src/repository/entity/iPlaceEntity';
import type { IOldPlaceDataService } from '../../../../lib/src/service/interface/IOldPlaceDataService';

/**
 * PlaceDataServiceのモックを作成する
 * @returns モック化されたIPlaceDataServiceインターフェースのインスタンス
 */
export const oldPlaceDataServiceMock = <
    P extends IPlaceEntity<P>,
>(): jest.Mocked<IOldPlaceDataService<P>> => {
    return {
        fetchPlaceEntityList: jest.fn().mockResolvedValue([] as P[]),
        updatePlaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
