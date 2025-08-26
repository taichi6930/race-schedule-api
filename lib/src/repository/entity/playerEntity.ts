import { PlayerRecord } from '../../gateway/record/playerRecord';
import type { RaceType } from '../../utility/raceType';

/**
 * Repository層のEntity
 */
export class PlayerEntity {
    /**
     * コンストラクタ
     * @param raceType - レース種別
     * @param playerNo - プレイヤー番号
     * @param playerName - プレイヤー名
     * @param priority - 優先度
     * @remarks
     * レース開催場所データを生成する
     */

    private constructor(
        public readonly raceType: RaceType,
        public readonly playerNo: string,
        public readonly playerName: string,
        public readonly priority: number,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param raceType - レース種別
     * @param playerNo - プレイヤー番号
     * @param playerName - プレイヤー名
     * @param priority - 優先度
     */
    public static create(
        raceType: RaceType,
        playerNo: string,
        playerName: string,
        priority: number,
    ): PlayerEntity {
        return new PlayerEntity(raceType, playerNo, playerName, priority);
    }

    public toRecord(): PlayerRecord {
        return PlayerRecord.create(
            this.raceType,
            this.playerNo,
            this.playerName,
            this.priority,
        );
    }
}
