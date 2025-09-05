import { inject, injectable } from 'tsyringe';
import { CommonParameter } from '../..';
import { PlayerEntity } from '../../../lib/src/repository/entity/playerEntity';
import { IPlayerRepository } from '../../repository/interface/IPlayerRepository';
import { IPlayerService } from '../interface/IPlayerService';

@injectable()
export class PlayerService implements IPlayerService {
    constructor(
        @inject('PlayerRepository')
        private readonly repository: IPlayerRepository,
    ) {}

    public async fetchPlayerEntityList(
        commonParameter: CommonParameter,
    ): Promise<PlayerEntity[]> {
        const results =
            await this.repository.fetchPlayerDataList(commonParameter);
        console.log(results);
        // PlayerEntityに変換する
        return results
            .map((item) => {
                try {
                    return PlayerEntity.create(
                        item.race_type,
                        item.player_no,
                        item.player_name,
                        item.priority,
                    );
                } catch (error) {
                    console.error('Error creating PlayerEntity:', error);
                    return null;
                }
            })
            .filter((item): item is PlayerEntity => item !== null);
    }
}
