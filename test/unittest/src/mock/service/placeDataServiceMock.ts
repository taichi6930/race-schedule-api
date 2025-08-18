import type { HorseRacingPlaceEntity } from '../../../../../lib/src/repository/entity/horseRacingPlaceEntity';
import type { MechanicalRacingPlaceEntity } from '../../../../../lib/src/repository/entity/mechanicalRacingPlaceEntity';
import type { PlaceEntity } from '../../../../../lib/src/repository/entity/placeEntity';
import type { IPlaceDataService } from '../../../../../lib/src/service/interface/IPlaceDataService';

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
                    | PlaceEntity[]
                    | HorseRacingPlaceEntity[]
                    | MechanicalRacingPlaceEntity[],
            ),
        updatePlaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
