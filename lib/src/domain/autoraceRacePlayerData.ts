import {
    type AutoracePositionNumber,
    validateAutoracePositionNumber,
} from '../utility/data/common/commonPositionNumber';
import {
    type PlayerNumber,
    validatePlayerNumber,
} from '../utility/data/playerNumber';

/**
 * オートレースのレースの選手データ
 */
export class AutoraceRacePlayerData {
    /**
     * 枠番
     * @type {AutoracePositionNumber}
     */
    public readonly positionNumber: AutoracePositionNumber;
    /**
     * 選手番号
     * @type {PlayerNumber}
     */
    public readonly playerNumber: PlayerNumber;

    /**
     * コンストラクタ
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     * @remarks
     * オートレースのレースの選手データを生成する
     */
    private constructor(
        positionNumber: AutoracePositionNumber,
        playerNumber: PlayerNumber,
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
    ): AutoraceRacePlayerData {
        return new AutoraceRacePlayerData(
            validateAutoracePositionNumber(positionNumber),
            validatePlayerNumber(playerNumber),
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(
        partial: Partial<AutoraceRacePlayerData> = {},
    ): AutoraceRacePlayerData {
        return new AutoraceRacePlayerData(
            partial.positionNumber ?? this.positionNumber,
            partial.playerNumber ?? this.playerNumber,
        );
    }
}
