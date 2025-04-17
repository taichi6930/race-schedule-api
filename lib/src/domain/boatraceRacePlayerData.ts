import {
    type BoatracePlayerNumber,
    validateBoatracePlayerNumber,
} from '../utility/data/boatrace/boatracePlayerNumber';
import {
    type BoatracePositionNumber,
    validateBoatracePositionNumber,
} from '../utility/data/boatrace/boatracePositionNumber';

/**
 * ボートレースのレースの選手データ
 */
export class BoatraceRacePlayerData {
    /**
     * 枠番
     * @type {BoatracePositionNumber}
     */
    public readonly positionNumber: BoatracePositionNumber;
    /**
     * 選手番号
     * @type {BoatracePlayerNumber}
     */
    public readonly playerNumber: BoatracePlayerNumber;

    /**
     * コンストラクタ
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     * @remarks
     * レースの選手データを生成する
     */
    private constructor(
        positionNumber: BoatracePositionNumber,
        playerNumber: BoatracePlayerNumber,
    ) {
        this.positionNumber = positionNumber;
        this.playerNumber = playerNumber;
    }

    /**
     * インスタンス生成メソッド
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     */
    public static create(
        positionNumber: number,
        playerNumber: number,
    ): BoatraceRacePlayerData {
        return new BoatraceRacePlayerData(
            validateBoatracePositionNumber(positionNumber),
            validateBoatracePlayerNumber(playerNumber),
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(
        partial: Partial<BoatraceRacePlayerData> = {},
    ): BoatraceRacePlayerData {
        return new BoatraceRacePlayerData(
            partial.positionNumber ?? this.positionNumber,
            partial.playerNumber ?? this.playerNumber,
        );
    }
}
