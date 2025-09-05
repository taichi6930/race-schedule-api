import { CommonParameter } from '../..';

// UseCase層
export interface IPlayerUseCase {
    getPlayerData(
        commonParameter: CommonParameter,
    ): Promise<{ results: any[] }>;
}
