import { inject, injectable } from 'tsyringe';
import { CommonParameter } from '../..';
import { IPlayerRepository } from '../../repository/interface/IPlayerRepository';
import { IPlayerService } from '../interface/IPlayerService';

@injectable()
export class PlayerService implements IPlayerService {
    constructor(
        @inject('PlayerRepository')
        private readonly repository: IPlayerRepository,
    ) {}

    public async getPlayerData(
        commonParameter: CommonParameter,
    ): Promise<{ results: any[] }> {
        const results =
            await this.repository.getPlayerDataList(commonParameter);
        return { results };
    }
}
