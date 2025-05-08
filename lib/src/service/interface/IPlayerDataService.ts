import type { PlayerData } from '../../domain/playerData';
import type { RaceType } from '../../utility/sqlite';

export interface IPlayerDataService {
    /**
     * プレイヤーデータをRepositoryから取得します
     *
     * このメソッドは、指定されたレースタイプのプレイヤーデータを
     * Repositoryから取得します。データが存在しない場合は空の配列を返します。
     */
    fetchPlayerDataList: (type: RaceType) => Promise<PlayerData[]>;
}
