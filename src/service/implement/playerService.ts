import { inject, injectable } from 'tsyringe';

import { PlayerEntity } from '../../../lib/src/repository/entity/playerEntity';
import { CommonParameter } from '../../commonParameter';
import { IPlayerRepository } from '../../repository/interface/IPlayerRepository';
import { IPlayerService } from '../interface/IPlayerService';

@injectable()
export class PlayerService implements IPlayerService {
    public constructor(
        @inject('PlayerRepository')
        private readonly repository: IPlayerRepository,
    ) {}

    public async fetchPlayerEntityList(
        commonParameter: CommonParameter,
    ): Promise<PlayerEntity[]> {
        const playerRecordList =
            await this.repository.fetchPlayerDataList(commonParameter);
        // PlayerEntityに変換する
        return playerRecordList
            .map((playerRecord) => {
                try {
                    return playerRecord.toEntity();
                } catch (error) {
                    console.error('Error creating PlayerEntity:', error);
                    return null;
                }
            })
            .filter((item): item is PlayerEntity => item !== null);
    }

    public async upsertPlayerEntityList(
        commonParameter: CommonParameter,
        entityList: PlayerEntity[],
    ): Promise<void> {
        await this.repository.upsertPlayerEntityList(
            commonParameter,
            entityList,
        );
    }
}
