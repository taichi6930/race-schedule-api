import { inject, injectable } from 'tsyringe';
import { CommonParameter } from '../..';
import { PlayerEntity } from '../../../lib/src/repository/entity/playerEntity';
import { PlayerRegisterDTO } from '../../repository/implement/playerRepository';
import { IPlayerService } from '../../service/interface/IPlayerService';
import { IPlayerUseCase } from '../interface/IPlayerUsecase';

@injectable()
export class PlayerUseCase implements IPlayerUseCase {
    constructor(
        @inject('PlayerService')
        private readonly service: IPlayerService,
    ) {}
    public async fetchPlayerEntityList(
        commonParameter: CommonParameter,
    ): Promise<PlayerEntity[]> {
        return await this.service.fetchPlayerEntityList(commonParameter);
    }

    // 選手登録/更新
    public async upsertPlayerEntity(
        dto: PlayerRegisterDTO,
        commonParameter: CommonParameter,
    ): Promise<void> {
        await this.service.upsertPlayerEntity(dto, commonParameter);
    }
}
