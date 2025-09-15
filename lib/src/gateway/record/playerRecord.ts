import '../../utility/format';

import { createErrorMessage } from '../../../../src/utility/error';
import type { RaceType } from '../../../../src/utility/raceType';
import { PlayerEntityForAWS } from '../../repository/entity/playerEntity';

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
     * @remarks 選手データを生成する
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
     * @param playerNo - 選手番号
     * @param playerName - 選手名
     * @param priority - 優先度
     */
    public static create(
        raceType: RaceType,
        playerNo: string,
        playerName: string,
        priority: number,
    ): PlayerRecord {
        try {
            return new PlayerRecord(raceType, playerNo, playerName, priority);
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
