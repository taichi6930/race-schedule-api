import type { PlayerData } from '../../domain/playerData';
import { PlayerRecord } from '../../gateway/record/playerRecord';

/**
 * Repository層のEntity
 */
export class PlayerEntity {
    /**
     * コンストラクタ
     * @param playerData - プレイヤーデータ
     * @remarks
     * プレイヤーデータを元にインスタンスを生成する
     */

    private constructor(public readonly playerData: PlayerData) {}

    /**
     * インスタンス生成メソッド
     * @param playerData - プレイヤーデータ
     */
    public static create(playerData: PlayerData): PlayerEntity {
        return new PlayerEntity(playerData);
    }

    public toRecord(): PlayerRecord {
        return PlayerRecord.create(
            this.playerData.raceType,
            this.playerData.playerNumber,
            this.playerData.name,
            this.playerData.priority,
        );
    }
}
