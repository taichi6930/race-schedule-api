import {
    type PlayerNumber,
    validatePlayerNumber,
} from '../utility/validateAndType/playerNumber';
import type { PositionNumber } from '../utility/validateAndType/positionNumber';
import { validatePositionNumber } from '../utility/validateAndType/positionNumber';

/**
 * レースの選手データ
 */
export class RacePlayerData {
    /**
     * コンストラクタ
     * @param raceType - レース種別
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     * @remarks
     * レースの選手データを生成する
     */
    private constructor(
        public readonly raceType: RaceType,
        public readonly positionNumber: PositionNumber,
        public readonly playerNumber: PlayerNumber,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param raceType - レース種別
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     */
    public static create(
        raceType: RaceType,
        positionNumber: number,
        playerNumber: number,
    ): RacePlayerData {
        return new RacePlayerData(
            raceType,
            validatePositionNumber(raceType, positionNumber),
            validatePlayerNumber(playerNumber),
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    public copy(partial: Partial<RacePlayerData> = {}): RacePlayerData {
        return RacePlayerData.create(
            partial.raceType ?? this.raceType,
            partial.positionNumber ?? this.positionNumber,
            partial.playerNumber ?? this.playerNumber,
        );
    }
}
