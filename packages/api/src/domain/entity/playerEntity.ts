import type { RaceType } from '@race-schedule/shared/src/types/raceType';

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
     * プレイヤーデータを生成する
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
}
