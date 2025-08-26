import type { PlayerData } from '../../domain/playerData';
import type { RaceType } from '../../utility/raceType';

export interface IPlayerService {
    /**
     * プレイヤーデータをStorageから取得します
     *
     * このメソッドは、指定された期間のプレイヤーデータを
     * Storageから取得します。データが存在しない場合は空の配列を返します。
     */
    /**
     * 指定レースタイプのプレイヤーデータを取得
     * @param raceType - レース種別
     */
    fetchPlayerDataList: (raceType: RaceType) => Promise<PlayerData[]>;
}
