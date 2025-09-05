import { CommonParameter } from '../..';

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
}
