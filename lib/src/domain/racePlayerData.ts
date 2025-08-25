import type { RaceType } from '../utility/raceType';
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
     * レースの種類
     * @type {RaceType}
     */
    public readonly raceType: RaceType;

    /**
     * 枠番
     * @type {PositionNumber}
     */
    public readonly positionNumber: PositionNumber;

    /**
     * 選手番号
     * @type {PlayerNumber}
     */
    public readonly playerNumber: PlayerNumber;

    /**
     * コンストラクタ
     * @param raceType - レース種別
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     * @remarks
     * レースの選手データを生成する
     */
    private constructor(
        raceType: RaceType,
        positionNumber: PositionNumber,
        playerNumber: PlayerNumber,
    ) {
        this.raceType = raceType;
        this.positionNumber = positionNumber;
        this.playerNumber = playerNumber;
    }

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
