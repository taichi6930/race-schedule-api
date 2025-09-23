import type { OldPlaceEntity } from '../../../../../src/repository/entity/placeEntity';
import type { IPlaceService } from '../../../../../src/service/interface/IPlaceService';

/**
 * PlaceServiceのモックを作成する
 * @returns モック化されたIPlaceServiceインターフェースのインスタンス
 */
export const placeServiceMock = (): jest.Mocked<IPlaceService> => {
    return {
        fetchPlaceEntityList: jest
            .fn()
            .mockResolvedValue([] as OldPlaceEntity[]),
        upsertPlaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
