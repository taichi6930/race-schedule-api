import { CommonParameter } from '../..';
import { PlayerEntity } from '../../../lib/src/repository/entity/playerEntity';

export interface IPlayerRepository {
    fetchPlayerDataList(commonParameter: CommonParameter): Promise<
        {
            race_type: string;
            player_no: string;
            player_name: string;
            priority: number;
            created_at: string;
            updated_at: string;
        }[]
    >;

    upsertPlayerEntity(
        commonParameter: CommonParameter,
        entity: PlayerEntity,
    ): Promise<void>;
}
