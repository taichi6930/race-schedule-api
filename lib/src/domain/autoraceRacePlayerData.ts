import {
    type AutoracePlayerNumber,
    validateAutoracePlayerNumber,
} from '../utility/data/autorace/autoracePlayerNumber';
import {
    type AutoracePositionNumber,
    validateAutoracePositionNumber,
} from '../utility/data/autorace/autoracePositionNumber';

/**
 * オートレースのレースの選手データ
 */
export class AutoraceRacePlayerData {
    /**
     * 枠番
     *
     * @type {AutoracePositionNumber}
     * @memberof AutoraceRacePlayerData
     */
    public readonly positionNumber: AutoracePositionNumber;
    /**
     * 選手番号
     *
     * @type {AutoracePlayerNumber}
     * @memberof AutoraceRacePlayerData
     */
    public readonly playerNumber: AutoracePlayerNumber;

    /**
     * コンストラクタ
     *
     * @remarks
     * オートレースのレースの選手データを生成する
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     */
    private constructor(
        positionNumber: AutoracePositionNumber,
        playerNumber: AutoracePlayerNumber,
    ) {
        this.positionNumber = positionNumber;
        this.playerNumber = playerNumber;
    }

    /**
     * インスタンス生成メソッド
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     */
    static create(
        positionNumber: number,
        playerNumber: number,
    ): AutoraceRacePlayerData {
        return new AutoraceRacePlayerData(
            validateAutoracePositionNumber(positionNumber),
            validateAutoracePlayerNumber(playerNumber),
        );
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(
        partial: Partial<AutoraceRacePlayerData> = {},
    ): AutoraceRacePlayerData {
        return new AutoraceRacePlayerData(
            partial.positionNumber ?? this.positionNumber,
            partial.playerNumber ?? this.playerNumber,
        );
    }
}
