import { inject, injectable } from 'tsyringe';
import { CommonParameter } from '../..';
import { PlayerEntity } from '../../../lib/src/repository/entity/playerEntity';
import {
    PlayerRecord,
    PlayerRegisterDTO,
} from '../../repository/implement/playerRepository';
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
        const dataList =
            await this.repository.fetchPlayerDataList(commonParameter);
        // PlayerEntityに変換する
        return dataList
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

    // 選手登録/更新（バリデーション＋upsert）
    public async upsertPlayerEntity(
        commonParameter: CommonParameter,
        entity: PlayerEntity,
    ): Promise<void> {
        // DB登録/更新
        await this.repository.upsertPlayerEntity(commonParameter, entity);
    }
}
