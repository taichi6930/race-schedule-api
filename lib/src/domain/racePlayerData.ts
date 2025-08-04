import {
    type PlayerNumber,
    validatePlayerNumber,
} from '../utility/data/common/playerNumber';
import type { PositionNumber } from '../utility/data/common/positionNumber';
import {
    type BoatracePositionNumber,
    validatePositionNumber,
} from '../utility/data/common/positionNumber';
import type { RaceType } from '../utility/raceType';
import { isRaceType } from '../utility/raceType';

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
     * @type {BoatracePositionNumber}
     */
    public readonly positionNumber: PositionNumber;
    /**
     * 選手番号
     * @type {PlayerNumber}
     */
    public readonly playerNumber: PlayerNumber;

    /**
     * コンストラクタ
     * @param raceType - レースの種類
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
     * @param raceType - レースの種類
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     */
    public static create(
        raceType: string,
        positionNumber: number,
        playerNumber: number,
    ): RacePlayerData {
        if (!isRaceType(raceType)) {
            throw new Error(`Invalid raceType: ${raceType}`);
        }
        return new RacePlayerData(
            raceType,
            validatePositionNumber(raceType, positionNumber),
            validatePlayerNumber(playerNumber),
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<RacePlayerData> = {}): RacePlayerData {
        return new RacePlayerData(
            partial.raceType ?? this.raceType,
            partial.positionNumber ?? this.positionNumber,
            partial.playerNumber ?? this.playerNumber,
        );
    }
}
