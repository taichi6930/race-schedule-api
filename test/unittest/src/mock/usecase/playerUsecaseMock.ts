import type { IPlayerUseCase } from '../../../../../src/usecase/interface/IPlayerUsecase';

/**
 * PlayerUsecaseのモックを作成する
 * @returns モック化されたIPlayerUseCaseインターフェースのインスタンス
 */
export const playerUsecaseMock = (): jest.Mocked<IPlayerUseCase> => {
    return {
        fetchPlayerEntityList: jest.fn().mockResolvedValue([]),
        upsertPlayerEntityList: jest.fn().mockResolvedValue(undefined),
    };
};
