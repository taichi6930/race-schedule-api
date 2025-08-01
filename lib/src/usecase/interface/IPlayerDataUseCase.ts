import type { PlayerData } from '../../domain/playerData';

/**
 * IPlayerDataUseCase
 */
export interface IPlayerDataUseCase {
    /**
     * プレイヤーデータを取得する
     * @param startDate
     * @param finishDate
     */
    fetchPlayerDataList: (raceTypeList: string[]) => PlayerData[];
}
