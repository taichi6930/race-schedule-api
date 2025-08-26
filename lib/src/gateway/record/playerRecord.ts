import '../../utility/format';

import { PlayerEntity } from '../../repository/entity/playerEntity';
import { createErrorMessage } from '../../utility/error';
import type { RaceType } from '../../utility/raceType';
import { PlayerData } from './../../domain/playerData';

/**
 * 選手データ
 */
export class PlayerRecord {
    /**
     * コンストラクタ
     * @param raceType - レース種別
     * @param playerNumber - 選手番号
     * @param name - 選手名
     * @param priority - 優先度
     * @remarks 選手データを生成する
     */
    private constructor(
        public readonly raceType: RaceType,
        public readonly playerNumber: number,
        public readonly name: string,
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
        playerNo: number,
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
            partial.playerNumber ?? this.playerNumber,
            partial.name ?? this.name,
            partial.priority ?? this.priority,
        );
    }

    public toEntity(): PlayerEntity {
        return PlayerEntity.create(
            PlayerData.create(
                this.raceType,
                this.playerNumber,
                this.name,
                this.priority,
            ),
        );
    }
}
