import type { IRaceUseCase } from '../../../../../src/usecase/interface/IRaceUsecase';

/**
 * RaceUseCaseのモックを作成する
 * @returns モック化されたIRaceUseCaseインターフェースのインスタンス
 */
export const raceUsecaseMock = (): jest.Mocked<IRaceUseCase> => {
    return {
        fetchRaceEntityList: jest.fn().mockResolvedValue([]),
        upsertRaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
