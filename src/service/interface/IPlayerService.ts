import { CommonParameter } from '../..';

// Service層
export interface IPlayerService {
    getPlayerData(
        commonParameter: CommonParameter,
    ): Promise<{ results: any[] }>;
}
