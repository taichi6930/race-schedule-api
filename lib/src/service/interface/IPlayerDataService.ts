import type { PlayerData } from '../../domain/playerData';
import type { RaceType } from '../../utility/sqlite';

export interface IPlayerDataService {
    /**
     * プレイヤーデータをStorageから取得します
     *
     * このメソッドは、指定された期間のプレイヤーデータを
     * Storageから取得します。データが存在しない場合は空の配列を返します。
     */
    fetchPlayerDataList: (type: RaceType) => PlayerData[];
}
