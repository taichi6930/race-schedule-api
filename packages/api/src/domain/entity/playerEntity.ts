import type { RaceType } from '@race-schedule/shared/src/types/raceType';

/**
 * race_type文字列をRaceTypeに変換する
 */
const validateRaceType = (raceType: string): RaceType => {
    const validRaceTypes = ['JRA', 'NAR', 'KEIRIN', 'AUTORACE', 'BOATRACE'];
    if (!validRaceTypes.includes(raceType)) {
        throw new Error(`Invalid race_type: ${raceType}`);
    }
    return raceType as RaceType;
};

/**
 * Player Entity (選手エンティティ)
 */
export class PlayerEntity {
    /**
     * コンストラクタ
     * @param raceType - レース種別
     * @param playerNo - プレイヤー番号
     * @param playerName - プレイヤー名
     * @param priority - 優先度
     * @remarks
     * 選手データを生成する
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
