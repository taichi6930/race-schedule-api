import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { MechanicalRacingPlaceEntity } from '../../../../lib/src/repository/entity/mechanicalRacingPlaceEntity';
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
                    | MechanicalRacingPlaceEntity[],
            ),
        updatePlaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
