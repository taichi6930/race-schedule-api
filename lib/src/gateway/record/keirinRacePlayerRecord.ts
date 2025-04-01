import '../../utility/format';

import {
    type KeirinPlayerNumber,
    validateKeirinPlayerNumber,
} from '../../utility/data/keirin/keirinPlayerNumber';
import {
    type KeirinPositionNumber,
    validateKeirinPositionNumber,
} from '../../utility/data/keirin/keirinPositionNumber';
import type { KeirinRaceId } from '../../utility/data/keirin/keirinRaceId';
import { validateKeirinRaceId } from '../../utility/data/keirin/keirinRaceId';
import type { KeirinRacePlayerId } from '../../utility/data/keirin/keirinRacePlayerId';
import { validateKeirinRacePlayerId } from '../../utility/data/keirin/keirinRacePlayerId';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * 競輪のレース選手データ
 */
export class KeirinRacePlayerRecord implements IRecord<KeirinRacePlayerRecord> {
    /**
     * コンストラクタ
     * @remarks
     * レース開催データを生成する
     * @param id - ID
     * @param raceId - レースID
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     * @param updateDate - 更新日時
     */
    private constructor(
        public readonly id: KeirinRacePlayerId,
        public readonly raceId: KeirinRaceId,
        public readonly positionNumber: KeirinPositionNumber,
        public readonly playerNumber: KeirinPlayerNumber,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param raceId - レースID
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        raceId: string,
        positionNumber: number,
        playerNumber: number,
        updateDate: Date,
    ): KeirinRacePlayerRecord {
        try {
            return new KeirinRacePlayerRecord(
                validateKeirinRacePlayerId(id),
                validateKeirinRaceId(raceId),
                validateKeirinPositionNumber(positionNumber),
                validateKeirinPlayerNumber(playerNumber),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(
                `KeirinRacePlayerRecord: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
        }
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(
        partial: Partial<KeirinRacePlayerRecord> = {},
    ): KeirinRacePlayerRecord {
        return KeirinRacePlayerRecord.create(
            partial.id ?? this.id,
            partial.raceId ?? this.raceId,
            partial.positionNumber ?? this.positionNumber,
            partial.playerNumber ?? this.playerNumber,
            partial.updateDate ?? this.updateDate,
        );
    }
}
