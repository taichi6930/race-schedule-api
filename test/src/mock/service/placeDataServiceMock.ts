import type { IPlaceEntity } from '../../../../lib/src/repository/entity/iPlaceEntity';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';

/**
 * PlaceDataServiceのモックを作成する
 * @returns
 */
export const placeDataServiceMock = <P extends IPlaceEntity<P>>(): jest.Mocked<
    IPlaceDataService<P>
> => {
    return {
        fetchPlaceEntityList: jest.fn().mockResolvedValue([] as P[]),
        updatePlaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
