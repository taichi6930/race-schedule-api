import type { PlayerData } from '../../domain/playerData';
import type { RaceType } from '../../utility/raceType';

/**
 * プレイヤーデータUseCaseインターフェース
 */
export interface IPlayerDataUseCaseForAWS {
    /**
     * プレイヤーデータを取得する
     * @param startDate
     * @param finishDate
     */
    fetchPlayerDataList: (raceTypeList: RaceType[]) => Promise<PlayerData[]>;
}
