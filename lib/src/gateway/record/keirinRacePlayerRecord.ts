import '../../utility/format';

import {
    type KeirinPositionNumber,
    validateKeirinPositionNumber,
} from '../../utility/data/keirin/keirinPositionNumber';
import type { KeirinRaceId } from '../../utility/data/keirin/keirinRaceId';
import { validateKeirinRaceId } from '../../utility/data/keirin/keirinRaceId';
import type { KeirinRacePlayerId } from '../../utility/data/keirin/keirinRacePlayerId';
import { validateKeirinRacePlayerId } from '../../utility/data/keirin/keirinRacePlayerId';
import type { PlayerNumber } from '../../utility/data/playerNumber';
import { validatePlayerNumber } from '../../utility/data/playerNumber';
import { createErrorMessage } from '../../utility/error';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * 競輪のレース選手データ
 */
export class KeirinRacePlayerRecord implements IRecord<KeirinRacePlayerRecord> {
    /**
     * コンストラクタ
     * @param id - ID
     * @param raceId - レースID
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     * @param updateDate - 更新日時
     * @remarks
     * レース開催データを生成する
     */
    private constructor(
        public readonly id: KeirinRacePlayerId,
        public readonly raceId: KeirinRaceId,
        public readonly positionNumber: KeirinPositionNumber,
        public readonly playerNumber: PlayerNumber,
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
                validatePlayerNumber(playerNumber),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(
                createErrorMessage('KeirinRacePlayerRecord', error),
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
