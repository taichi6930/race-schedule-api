import type { RaceType } from '../../utility/raceType';
import { validateRaceType } from '../../utility/raceType';

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
        raceType: string,
        playerNo: string,
        playerName: string,
        priority: number,
    ): PlayerEntity {
        try {
            return new PlayerEntity(
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
}
