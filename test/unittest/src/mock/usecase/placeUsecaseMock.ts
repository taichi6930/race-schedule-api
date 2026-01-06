import type { IOldPlaceUseCase } from '../../../../../src/usecase/interface/IOldPlaceUsecase';

/**
 * PlaceServiceのモックを作成する
 * @returns モック化されたIPlaceUseCaseインターフェースのインスタンス
 */
export const placeUsecaseMock = (): jest.Mocked<IOldPlaceUseCase> => {
    return {
        fetchPlaceEntityList: jest.fn().mockResolvedValue([]),
        upsertPlaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
