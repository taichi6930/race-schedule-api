import type { PlaceEntity } from '../../../../../src/repository/entity/placeEntity';
import type { IPlaceUseCase } from '../../../../../src/usecase/interface/IPlaceUsecase';

/**
 * PlaceServiceのモックを作成する
 * @returns モック化されたIPlaceUseCaseインターフェースのインスタンス
 */
export const placeUsecaseMock = (): jest.Mocked<IPlaceUseCase> => {
    return {
        fetchPlaceEntityList: jest.fn().mockResolvedValue([] as PlaceEntity[]),
        upsertPlaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
