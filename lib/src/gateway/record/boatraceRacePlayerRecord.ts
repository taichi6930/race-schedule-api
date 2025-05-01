import '../../utility/format';

import type { PlayerNumber } from 'lib/src/utility/data/playerNumber';
import { validatePlayerNumber } from 'lib/src/utility/data/playerNumber';

import {
    type BoatracePositionNumber,
    validateBoatracePositionNumber,
} from '../../utility/data/boatrace/boatracePositionNumber';
import type { BoatraceRaceId } from '../../utility/data/boatrace/boatraceRaceId';
import { validateBoatraceRaceId } from '../../utility/data/boatrace/boatraceRaceId';
import type { BoatraceRacePlayerId } from '../../utility/data/boatrace/boatraceRacePlayerId';
import { validateBoatraceRacePlayerId } from '../../utility/data/boatrace/boatraceRacePlayerId';
import { createErrorMessage } from '../../utility/error';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * ボートレースのレース選手データ
 */
export class BoatraceRacePlayerRecord
    implements IRecord<BoatraceRacePlayerRecord>
{
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
        public readonly id: BoatraceRacePlayerId,
        public readonly raceId: BoatraceRaceId,
        public readonly positionNumber: BoatracePositionNumber,
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
    ): BoatraceRacePlayerRecord {
        try {
            return new BoatraceRacePlayerRecord(
                validateBoatraceRacePlayerId(id),
                validateBoatraceRaceId(raceId),
                validateBoatracePositionNumber(positionNumber),
                validatePlayerNumber(playerNumber),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(
                createErrorMessage('BoatraceRacePlayerRecord', error),
            );
        }
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(
        partial: Partial<BoatraceRacePlayerRecord> = {},
    ): BoatraceRacePlayerRecord {
        return BoatraceRacePlayerRecord.create(
            partial.id ?? this.id,
            partial.raceId ?? this.raceId,
            partial.positionNumber ?? this.positionNumber,
            partial.playerNumber ?? this.playerNumber,
            partial.updateDate ?? this.updateDate,
        );
    }
}
