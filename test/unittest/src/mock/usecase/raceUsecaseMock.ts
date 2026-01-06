import type { IOldRaceUseCase } from '../../../../../src/usecase/interface/IOldRaceUsecase';

/**
 * RaceUseCaseのモックを作成する
 * @returns モック化されたIRaceUseCaseインターフェースのインスタンス
 */
export const raceUsecaseMock = (): jest.Mocked<IOldRaceUseCase> => {
    return {
        fetchRaceEntityList: jest.fn().mockResolvedValue([]),
        upsertRaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
