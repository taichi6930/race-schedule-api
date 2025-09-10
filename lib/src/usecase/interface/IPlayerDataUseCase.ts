import type { RaceType } from '../../../../src/utility/raceType';
import type { PlayerDataForAWS } from '../../domain/playerData';

/**
 * プレイヤーデータUseCaseインターフェース
 */
export interface IPlayerDataUseCaseForAWS {
    /**
     * プレイヤーデータを取得する
     * @param startDate
     * @param finishDate
     */
    fetchPlayerDataList: (
        raceTypeList: RaceType[],
    ) => Promise<PlayerDataForAWS[]>;
}
