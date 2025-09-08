import {
    type RaceType,
    validateRaceType,
} from '../../../../src/utility/raceType';
import { PlayerRecord } from '../../gateway/record/playerRecord';

/**
 * Repository層のEntity
 */
export class PlayerEntityForAWS {
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
        raceType: string,
        playerNo: string,
        playerName: string,
        priority: number,
    ): PlayerEntityForAWS {
        try {
            return new PlayerEntityForAWS(
                validateRaceType(raceType),
                playerNo,
                playerName,
                priority,
            );
        } catch (error) {
            console.error('Error creating PlayerEntity:', error);
            throw error;
        }
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
