import { inject, injectable } from 'tsyringe';
import { CommonParameter } from '../..';
import { IPlayerService } from '../../service/interface/IPlayerService';
import { IPlayerUseCase } from '../interface/IPlayerUsecase';

@injectable()
export class PlayerUseCase implements IPlayerUseCase {
    constructor(
        @inject('PlayerService')
        private readonly service: IPlayerService,
    ) {}
    public async getPlayerData(
        commonParameter: CommonParameter,
    ): Promise<{ results: any[] }> {
        return await this.service.getPlayerData(commonParameter);
    }
}
