import { inject, injectable } from 'tsyringe';
import { CommonParameter } from '../..';
import { PlayerEntity } from '../../../lib/src/repository/entity/playerEntity';
import { PlayerRegisterDTO, PlayerRecord } from '../../model/player';
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
        dto: PlayerRegisterDTO,
        commonParameter: CommonParameter,
    ): Promise<PlayerEntity> {
        // バリデーション
        if (
            !dto.race_type ||
            !dto.player_no ||
            !dto.player_name ||
            dto.priority === undefined
        ) {
            throw new Error(
                'race_type, player_no, player_name, priorityは必須です',
            );
        }
        if (typeof dto.priority !== 'number' || dto.priority < 0) {
            throw new Error('priorityは0以上の数値で指定してください');
        }

        // DB登録/更新
        const record: PlayerRecord = await this.repository.upsertPlayer(
            dto,
            commonParameter,
        );
        // PlayerEntityに変換
        return PlayerEntity.create(
            record.race_type,
            record.player_no,
            record.player_name,
            record.priority,
        );
    }
}
