import type { PlayerEntity } from '../../../lib/src/repository/entity/playerEntity';
import type { CommonParameter } from '../../commonParameter';

export interface IPlayerRepository {
    fetchPlayerDataList: (commonParameter: CommonParameter) => Promise<
        {
            race_type: string;
            player_no: string;
            player_name: string;
            priority: number;
            created_at: string;
            updated_at: string;
        }[]
    >;

    upsertPlayerEntityList: (
        commonParameter: CommonParameter,
        entityList: PlayerEntity[],
    ) => Promise<void>;
}
