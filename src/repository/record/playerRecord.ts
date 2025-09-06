import { PlayerEntityForAWS } from '../../../lib/src/repository/entity/playerEntity';
import { createErrorMessage } from '../../../lib/src/utility/error';
import {
    type RaceType,
    validateRaceType,
} from '../../../lib/src/utility/raceType';

/**
 * 選手データ
 */
export class PlayerRecord {
    /**
     * コンストラクタ
     * @param raceType - レース種別
     * @param playerNo - 選手番号
     * @param playerName - 選手名
     * @param priority - 優先度
     * @param createdAt - 作成日時
     * @param updatedAt - 更新日時
     * @remarks 選手データを生成する
     */
    private constructor(
        public readonly raceType: RaceType,
        public readonly playerNo: string,
        public readonly playerName: string,
        public readonly priority: number,
        public readonly createdAt: string,
        public readonly updatedAt: string,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param raceType - レース種別
     * @param playerNo - 選手番号
     * @param playerName - 選手名
     * @param priority - 優先度
     * @param createdAt - 作成日時
     * @param updatedAt - 更新日時
     */
    public static create(
        raceType: string,
        playerNo: string,
        playerName: string,
        priority: number,
        createdAt: string,
        updatedAt: string,
    ): PlayerRecord {
        try {
            return new PlayerRecord(
                validateRaceType(raceType),
                playerNo,
                playerName,
                priority,
                createdAt,
                updatedAt,
            );
        } catch (error) {
            throw new Error(
                createErrorMessage('Failed to create PlayerRecord', error),
            );
        }
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    public copy(partial: Partial<PlayerRecord> = {}): PlayerRecord {
        return PlayerRecord.create(
            partial.raceType ?? this.raceType,
            partial.playerNo ?? this.playerNo,
            partial.playerName ?? this.playerName,
            partial.priority ?? this.priority,
            partial.createdAt ?? this.createdAt,
            partial.updatedAt ?? this.updatedAt,
        );
    }

    public toEntity(): PlayerEntityForAWS {
        return PlayerEntityForAWS.create(
            this.raceType,
            this.playerNo,
            this.playerName,
            this.priority,
        );
    }
}
