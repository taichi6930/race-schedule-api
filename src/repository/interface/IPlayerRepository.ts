import { CommonParameter } from '../..';
import { RaceType } from '../../../lib/src/utility/raceType';

export interface IPlayerRepository {
    getPlayerDataList(commonParameter: CommonParameter): Promise<
        {
            race_type: string;
            player_no: string;
            player_name: string;
            priority: number;
            created_at: string;
            updated_at: string;
        }[]
    >;
}
