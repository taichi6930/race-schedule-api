import {
    type KeirinPlayerNumber,
    validateKeirinPlayerNumber,
} from '../utility/data/keirin/keirinPlayerNumber';
import {
    type KeirinPositionNumber,
    validateKeirinPositionNumber,
} from '../utility/data/keirin/keirinPositionNumber';

/**
 * 競輪のレースの選手データ
 */
export class KeirinRacePlayerData {
    /**
     * 枠番
     *
     * @type {KeirinPositionNumber}
     * @memberof KeirinRacePlayerData
     */
    public readonly positionNumber: KeirinPositionNumber;
    /**
     * 選手番号
     *
     * @type {KeirinPlayerNumber}
     * @memberof KeirinRacePlayerData
     */
    public readonly playerNumber: KeirinPlayerNumber;

    /**
     * コンストラクタ
     *
     * @remarks
     * レースの選手データを生成する
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     */
    private constructor(
        positionNumber: KeirinPositionNumber,
        playerNumber: KeirinPlayerNumber,
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
    ): KeirinRacePlayerData {
        return new KeirinRacePlayerData(
            validateKeirinPositionNumber(positionNumber),
            validateKeirinPlayerNumber(playerNumber),
        );
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<KeirinRacePlayerData> = {}): KeirinRacePlayerData {
        return new KeirinRacePlayerData(
            partial.positionNumber ?? this.positionNumber,
            partial.playerNumber ?? this.playerNumber,
        );
    }
}
