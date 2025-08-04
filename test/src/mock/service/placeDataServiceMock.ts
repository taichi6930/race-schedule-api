import type { PlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';

/**
 * PlaceDataServiceのモックを作成する
 * @returns モック化されたIPlaceDataServiceインターフェースのインスタンス
 */
export const placeDataServiceMock = (): jest.Mocked<IPlaceDataService> => {
    return {
        fetchPlaceEntityList: jest
            .fn()
            .mockResolvedValue(
                [] as JraPlaceEntity[] | NarPlaceEntity[] | PlaceEntity[],
            ),
        updatePlaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
