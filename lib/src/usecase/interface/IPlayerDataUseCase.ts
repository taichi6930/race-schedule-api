import type { PlayerData } from '../../domain/playerData';
import type { RaceType } from '../../utility/raceType';

/**
 * IPlayerDataUseCase
 */
export interface IPlayerDataUseCase {
    /**
     * プレイヤーデータを取得する
     * @param startDate
     * @param finishDate
     */
    fetchPlayerDataList: (raceTypeList: RaceType[]) => Promise<PlayerData[]>;
}
