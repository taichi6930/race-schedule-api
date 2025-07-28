import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
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
                [] as
                    | JraPlaceEntity[]
                    | NarPlaceEntity[]
                    | KeirinPlaceEntity[]
                    | AutoracePlaceEntity[]
                    | BoatracePlaceEntity[],
            ),
        updatePlaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
